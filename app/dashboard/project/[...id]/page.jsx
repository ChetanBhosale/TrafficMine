'use client'

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { getSingleProject } from "@/app/actions/projects";
import { getVisitorSessions } from "@/app/actions/visitorSession";
import InfoHeader from "@/components/custom/Info/infoHeader";
import InfoProjectSkeleton from "@/components/custom/Info/InfoProjectSkeleton";
import TimelineDropdown from "@/components/custom/Info/TimeLine";
import { Switch } from "@/components/ui/switch";
import { FiCalendar } from "react-icons/fi";
import toast from "react-hot-toast";
import TrafficOverviewChart from "@/components/custom/chart/TrafficOverviewChart";
import SummaryCards from "@/components/custom/chart/SummaryCards";
import VisitorWorldMap from "@/components/custom/chart/VisitorWorldMap";
import ReferralSourcesList from "@/components/custom/chart/ReferralSourcesList";
import RetentionChart from "@/components/custom/chart/RetentionChart";
import CombinedChart from "@/components/custom/chart/CombinedChart";

const ProjectPage = () => {
  const session = useSession();
  const router = useRouter();
  const getParams = useParams();
  const [projectInfo, setProjectInfo] = useState(null);
  const [selectedTimeline, setSelectedTimeline] = useState("Last Week");
  const [visitorData, setVisitorData] = useState({
    timelineData: [],
    referralData: [],
    mapData: [],
  });
  const [retentionData, setRetentionData] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUniqueVisitors, setShowUniqueVisitors] = useState(false);
  const [initial, setInitial] = useState(0);

  // Fetch project data
  async function fetchProjectData(projectId, userId) {
    try {
      const data = await getSingleProject(projectId, userId);
      if (data?.status === 200) {
        setProjectInfo(data?.data);
      } else {
        toast.error("Project not found");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching project data:", error);
      toast.error("An error occurred while fetching project data");
    }
  }

  // Fetch visitor data and transform it for charts
  async function fetchVisitorData(projectId, timeline) {
    if (initial === 0) {
      setIsLoading(true);
      setInitial(1);
    }
    try {
      const response = await getVisitorSessions(projectId, timeline);
      if (response?.status === 200) {
        console.log("Fetched sessions:", response.data); // Log fetched sessions
        const transformedData = transformDataForChart(response.data, showUniqueVisitors, timeline);
        setVisitorData((prevData) => ({
          ...prevData,
          timelineData: transformedData.timelineData,
          referralData: transformedData.referralData,
          mapData: transformedData.mapData,
        }));

        const retention = calculateRetention(response.data, timeline, showUniqueVisitors);
        setRetentionData(retention);
        
        const combined = calculateCombinedMetrics(response.data, timeline, showUniqueVisitors);
        setCombinedData(combined);
      } else {
        toast.error("Failed to fetch visitor data");
      }
    } catch (error) {
      console.error("Error fetching visitor data:", error);
      toast.error("An error occurred while fetching data");
    } finally {
      setIsLoading(false);
    }
  }

  // Transform data for Traffic Overview, Referral, and Map
  const transformDataForChart = (sessions, showUniqueVisitors, timeline) => {
    const now = new Date();
    let labels = [];

    // Generate labels based on the selected timeline
    switch (timeline) {
      case "Last 24 Hours":
        labels = Array.from({ length: 24 }, (_, i) => {
          const hour = new Date(now - i * 60 * 60 * 1000);
          return hour.toLocaleTimeString([], { hour: "2-digit", hour12: false });
        }).reverse();
        break;
      case "Last Week":
        labels = Array.from({ length: 7 }, (_, i) => {
          const day = new Date(now - i * 24 * 60 * 60 * 1000);
          return day.toLocaleDateString([], { weekday: "short" });
        }).reverse();
        break;
      case "Last Month":
        labels = Array.from({ length: 30 }, (_, i) => {
          const date = new Date(now - i * 24 * 60 * 60 * 1000);
          return date.toLocaleDateString([], { day: "numeric", month: "short" });
        }).reverse();
        break;
      default:
        labels = [];
    }

    // Group data by timeline
    const groupedData = sessions.reduce((acc, session) => {
      let label;
      switch (timeline) {
        case "Last 24 Hours":
          label = new Date(session.sessionStart).toLocaleTimeString([], { hour: "2-digit", hour12: false });
          break;
        case "Last Week":
          label = new Date(session.sessionStart).toLocaleDateString([], { weekday: "short" });
          break;
        case "Last Month":
          label = new Date(session.sessionStart).toLocaleDateString([], { day: "numeric", month: "short" });
          break;
        default:
          label = "";
      }

      if (!acc[label]) {
        acc[label] = { visitors: 0, uniqueVisitors: new Set(), activeUsers: new Set() };
      }
      acc[label].visitors += 1;
      acc[label].uniqueVisitors.add(session.visitorId);
      if (session.isActive) {
        acc[label].activeUsers.add(session.visitorId);
      }
      return acc;
    }, {});

    // Prepare data for the chart
    const timelineData = labels.map((label) => ({
      label,
      visitors: groupedData[label]?.visitors || 0,
      uniqueVisitors: groupedData[label]?.uniqueVisitors.size || 0,
      activeUsers: groupedData[label]?.activeUsers.size || 0,
    }));

    // Prepare map data for the world map
    const mapData = sessions.reduce((acc, session) => {
      if (session.country) {
        if (!acc[session.country]) {
          acc[session.country] = { visitors: new Set() };
        }
        if (showUniqueVisitors) {
          acc[session.country].visitors.add(session.visitorId); // Track unique visitors
        } else {
          acc[session.country].visitors.add(session.id); // Track all visitors
        }
      }
      return acc;
    }, {});

    const mapChartData = Object.keys(mapData).map((country) => ({
      country,
      visitors: mapData[country].visitors.size,
    }));

    // Prepare referral data
    const referralData = sessions.reduce((acc, session) => {
      const source = session.source || "direct";
      if (!acc[source]) {
        acc[source] = { visitors: new Set() };
      }
      if (showUniqueVisitors) {
        acc[source].visitors.add(session.visitorId); // Track unique visitors
      } else {
        acc[source].visitors.add(session.id); // Track all visitors
      }
      return acc;
    }, {});

    const referralChartData = Object.keys(referralData).map((source) => ({
      source,
      visitors: referralData[source].visitors.size,
    }));

    return {
      timelineData,
      referralData: referralChartData,
      mapData: mapChartData,
    };
  };

  // Calculate retention rate
  // Calculate retention rate
const calculateRetention = (sessions, timeline, showUniqueVisitors) => {
  const now = new Date();
  const retentionData = [];

  // Group sessions by visitorId and calculate return visits
  const userSessions = sessions.reduce((acc, session) => {
    if (!acc[session.visitorId]) {
      acc[session.visitorId] = [];
    }
    acc[session.visitorId].push(new Date(session.sessionStart));
    return acc;
  }, {});

  // Calculate retention rate based on timeline
  switch (timeline) {
    case "Last 24 Hours":
      for (let hour = 0; hour < 24; hour++) {
        const hourLabel = `${hour}:00`;
        const returningUsers = Object.values(userSessions).filter((sessionDates) => {
          return sessionDates.some((date) => date.getHours() === hour);
        }).length;
        
        const totalVisitors = showUniqueVisitors 
          ? new Set(sessions.map(s => s.visitorId)).size 
          : sessions.length;
        
        retentionData.push({
          label: hourLabel,
          retentionRate: ((returningUsers / totalVisitors) * 100).toFixed(2),
        });
      }
      break;

    case "Last Week":
      for (let day = 0; day < 7; day++) {
        const dayLabel = new Date(now - day * 24 * 60 * 60 * 1000).toLocaleDateString([], {
          weekday: "short",
        });
        const returningUsers = Object.values(userSessions).filter((sessionDates) => {
          return sessionDates.some((date) => date.getDay() === (now.getDay() - day + 7) % 7);
        }).length;
        
        const totalVisitors = showUniqueVisitors 
          ? new Set(sessions.map(s => s.visitorId)).size 
          : sessions.length;
        
        retentionData.push({
          label: dayLabel,
          retentionRate: ((returningUsers / totalVisitors) * 100).toFixed(2),
        });
      }
      break;

    case "Last Month":
      for (let day = 0; day < 30; day++) {
        const dayLabel = new Date(now - day * 24 * 60 * 60 * 1000).toLocaleDateString([], {
          day: "numeric",
          month: "short",
        });
        const returningUsers = Object.values(userSessions).filter((sessionDates) => {
          return sessionDates.some((date) => date.getDate() === new Date(now - day * 24 * 60 * 60 * 1000).getDate());
        }).length;
        
        const totalVisitors = showUniqueVisitors 
          ? new Set(sessions.map(s => s.visitorId)).size 
          : sessions.length;
        
        retentionData.push({
          label: dayLabel,
          retentionRate: ((returningUsers / totalVisitors) * 100).toFixed(2),
        });
      }
      break;

    default:
      break;
  }

  return retentionData;
};

// Calculate combined metrics
const calculateCombinedMetrics = (sessions, timeline, showUniqueVisitors) => {
  const now = new Date();
  const combinedData = [];

  // Group sessions by visitorId to track returning users
  const userSessions = sessions.reduce((acc, session) => {
    if (!acc[session.visitorId]) {
      acc[session.visitorId] = [];
    }
    acc[session.visitorId].push(new Date(session.sessionStart));
    return acc;
  }, {});

  // Generate labels for all dates in the selected timeline
  let labels = [];
  switch (timeline) {
    case "Last 24 Hours":
      labels = Array.from({ length: 24 }, (_, i) => {
        const hour = new Date(now - i * 60 * 60 * 1000);
        return hour.toLocaleTimeString([], { hour: "2-digit", hour12: false });
      }).reverse();
      break;
    case "Last Week":
      labels = Array.from({ length: 7 }, (_, i) => {
        const day = new Date(now - i * 24 * 60 * 60 * 1000);
        return day.toLocaleDateString([], { weekday: "short" });
      }).reverse();
      break;
    case "Last Month":
      labels = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(now - i * 24 * 60 * 60 * 1000);
        return date.toLocaleDateString([], { day: "numeric", month: "short" });
      }).reverse();
      break;
    default:
      labels = [];
  }

  // Group sessions by timeline
  const groupedSessions = sessions.reduce((acc, session) => {
    let label;
    switch (timeline) {
      case "Last 24 Hours":
        label = new Date(session.sessionStart).toLocaleTimeString([], { hour: "2-digit", hour12: false });
        break;
      case "Last Week":
        label = new Date(session.sessionStart).toLocaleDateString([], { weekday: "short" });
        break;
      case "Last Month":
        label = new Date(session.sessionStart).toLocaleDateString([], { day: "numeric", month: "short" });
        break;
      default:
        label = "";
    }

    if (!acc[label]) {
      acc[label] = { 
        sessions: [], 
        bounceSessions: 0, 
        engagedSessions: 0, 
        returningUsers: 0,
        uniqueVisitors: new Set(),
        uniqueReturningUsers: new Set()
      };
    }
    acc[label].sessions.push(session);
    acc[label].uniqueVisitors.add(session.visitorId);

    if (session.visitedPages.length === 1) {
      acc[label].bounceSessions++;
    } else {
      acc[label].engagedSessions++;
    }

    // Check if the user has returned
    if (userSessions[session.visitorId]?.length > 1) {
      acc[label].returningUsers++;
      acc[label].uniqueReturningUsers.add(session.visitorId);
    }

    return acc;
  }, {});

  // Fill in data for all labels, even if there's no data
  labels.forEach((label) => {
    const group = groupedSessions[label] || {
      sessions: [],
      bounceSessions: 0,
      engagedSessions: 0,
      returningUsers: 0,
      uniqueVisitors: new Set(),
      uniqueReturningUsers: new Set()
    };

    const totalSessions = group.sessions.length;
    const avgDuration =
      totalSessions > 0
        ? parseFloat((group.sessions.reduce((sum, session) => sum + (session.duration || 0), 0) / totalSessions).toFixed(2))
        : 0;
    
    // Determine total visitors based on unique vs all visitors setting
    const totalVisitors = showUniqueVisitors 
      ? group.uniqueVisitors.size 
      : totalSessions;

    const bounceRate = totalVisitors > 0 
      ? parseFloat(((group.bounceSessions / totalVisitors) * 100).toFixed(2)) 
      : 0;
    
    const engagementRate = totalVisitors > 0 
      ? parseFloat(((group.engagedSessions / totalVisitors) * 100).toFixed(2)) 
      : 0;
    
    const returningUsersPercentage = totalVisitors > 0 
      ? parseFloat(((showUniqueVisitors 
          ? group.uniqueReturningUsers.size 
          : group.returningUsers) / totalVisitors) * 100).toFixed(2)
      : 0;

    combinedData.push({
      label,
      avgDuration,
      bounceRate,
      engagementRate,
      returningUsersPercentage,
    });
  });

  return combinedData;
};


  // Handle timeline change
  const handleTimelineChange = (timeline) => {
    setSelectedTimeline(timeline);
    fetchVisitorData(getParams.id[0], timeline);
  };

  // Handle unique visitors toggle
  const handleToggle = () => {
    setShowUniqueVisitors(!showUniqueVisitors);
    fetchVisitorData(getParams.id[0], selectedTimeline);
  };

  // Fetch data on mount
  useEffect(() => {
    if (session?.status === "unauthenticated") {
      router.push("/");
    }
    if (session?.status === "authenticated") {
      fetchProjectData(getParams.id[0], session?.data?.user?.id);
      fetchVisitorData(getParams.id[0], selectedTimeline);
    }
  }, [session, selectedTimeline, showUniqueVisitors]);

  // Loading state
  if (session?.status === "loading" || isLoading) {
    return <InfoProjectSkeleton />;
  }

  return (
    <div className="mt-16 p-6">
      <InfoHeader projectInfo={projectInfo} />

      {/* Filters */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FiCalendar className="text-gray-600 dark:text-gray-400" />
          <TimelineDropdown onSelectTimeline={handleTimelineChange} selectedTimeline={selectedTimeline} />
        </div>
        <div className="flex items-center space-x-2">
          <Switch checked={showUniqueVisitors} onCheckedChange={handleToggle} />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {showUniqueVisitors ? "Unique Visitors" : "All Visitors"}
          </span>
        </div>
      </div>

      {/* Traffic Overview */}
      <h2 className="mt-8 text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">Traffic Overview</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Showing visitor data for the {selectedTimeline.toLowerCase()}.
      </p>

      {/* Summary Cards */}
      <SummaryCards data={visitorData.timelineData} />

      {/* Line Chart */}
      {isLoading ? (
        <div className="h-96 flex items-center justify-center">
          <p className="text-gray-600 dark:text-gray-400">Loading chart data...</p>
        </div>
      ) : (
        <TrafficOverviewChart data={visitorData.timelineData} />
      )}

      {/* Grid Layout for Retention Chart and Combined Chart */}
     

      {/* Grid Layout for VisitorWorldMap and ReferralSourcesList */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <VisitorWorldMap visitorData={visitorData.mapData} />
        <ReferralSourcesList data={visitorData.referralData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <RetentionChart data={retentionData} />
        <CombinedChart data={combinedData} />
      </div>
    </div>
  );
};

export default ProjectPage;