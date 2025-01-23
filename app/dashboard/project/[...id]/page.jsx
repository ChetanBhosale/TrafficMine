"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { getSingleProject } from "@/app/actions/projects";
import { getVisitorSessions } from "@/app/actions/visitorSession";
import InfoHeader from "@/components/custom/Info/infoHeader";
import InfoProjectSkeleton from "@/components/custom/Info/InfoProjectSkeleton";
import VisitorLineChart from "@/components/custom/chart/VisitorBarCharts";
import TimelineDropdown from "@/components/custom/Info/TimeLine";
import { Switch } from "@/components/ui/switch";
import VisitorWorldMap from "@/components/custom/Info/VisitorWorldMap";
import ReferralSourcesList from "@/components/custom/chart/ReferralChart";
import DeviceDistribution from "@/components/custom/chart/DeviceDistribution";
import { FiCalendar } from "react-icons/fi";
import toast from "react-hot-toast";
import UserVisitsInsights from "@/components/custom/chart/UserVisitsInsights";

const ProjectPage = () => {
  const session = useSession();
  const router = useRouter();
  const getParams = useParams();
  const [projectInfo, setProjectInfo] = useState(null);
  const [selectedTimeline, setSelectedTimeline] = useState("Last 24 Hours");
  const [visitorData, setVisitorData] = useState({ timelineData: [], referralData: [], deviceData: [] });
  const [loader, setLoader] = useState(false);
  const [showUniqueVisitors, setShowUniqueVisitors] = useState(false);

  async function fetchProjectData(projectId, userId) {
    const data = await getSingleProject(projectId, userId);
    if (data?.status === 200) {
      setProjectInfo(data?.data);
    } else {
      toast.error("Project not found");
      router.push("/dashboard");
    }
  }

  async function fetchVisitorData(projectId, timeline) {
    if (visitorData?.timelineData.length === 0 && visitorData?.referralData.length === 0) {
      setLoader(true);
    }

    const response = await getVisitorSessions(projectId, timeline);
    if (response?.status === 200) {
      console.log(response.data, 'reso')
      const transformedData = transformDataForChart(response.data, showUniqueVisitors, timeline);
      console.log(transformedData,'transformedData transformedData transformedData')
      setLoader(false);
      setVisitorData(transformedData);
    } else {
      toast.error("Failed to fetch visitor data");
    }
    setLoader(false);
  }
  const transformDataForChart = (sessions, showUniqueVisitors, timeline) => {
    const now = new Date();
    let labels = [];
    let groupedData = {};
    // Extract referral data
    const referralData = sessions.reduce((acc, session) => {
      const source = session.source || "direct";
      if (!acc[source]) {
        acc[source] = { visitors: new Set(), countries: new Set() };
      }
      if (showUniqueVisitors) {
        acc[source].visitors.add(session.visitorId); // Track unique visitors
      } else {
        acc[source].visitors.add(session.id); // Track all visitors
      }
      if (session.country) {
        acc[source].countries.add(session.country);
      }
      return acc;
    }, {});
  
    const referralChartData = Object.keys(referralData).map((source) => ({
      source,
      visitors: referralData[source].visitors.size,
    }));
  
    // Extract timeline data
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
    groupedData = sessions.reduce((acc, session) => {
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
        acc[label] = { visitors: new Set(), activeUsers: new Set(), countries: new Set(), devices: { desktop: 0, mobile: 0, tablet: 0 } };
      }
      if (showUniqueVisitors) {
        acc[label].visitors.add(session.visitorId); // Track unique visitors
      } else {
        acc[label].visitors.add(session.id); // Track all visitors
      }
      if (session.isActive) {
        acc[label].activeUsers.add(session.visitorId); // Track active users
      }
      if (session.country) {
        acc[label].countries.add(session.country);
      }
      if (session.deviceInfo?.deviceType) {
        acc[label].devices[session.deviceInfo.deviceType] += 1;
      }
      return acc;
    }, {});
  
    // Prepare timeline data for the line chart
    const timelineData = labels.map((label) => ({
      label,
      visitors: groupedData[label] ? groupedData[label].visitors.size : 0,
      activeUsers: groupedData[label] ? groupedData[label].activeUsers.size : 0,
      countries: groupedData[label] ? Array.from(groupedData[label].countries) : [],
      devices: groupedData[label] ? groupedData[label].devices : { desktop: 0, mobile: 0, tablet: 0 },
    }));
  
    // Prepare map data for the world map
    console.log(session,'sessionssss')
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

    console.log(mapData,'map data is not working')
  
    const mapChartData = Object.keys(mapData).map((country) => ({
      country,
      visitors: mapData[country].visitors.size,
    }));
  
    // Prepare device data for the device distribution
    const deviceData = sessions.reduce((acc, session) => {
      const deviceType = session.deviceInfo?.deviceType || "desktop";
      const duration = session.duration || 0;
  
      if (!acc[deviceType]) {
        acc[deviceType] = { visitors: new Set(), totalDuration: 0, browsers: {} };
      }
      if (showUniqueVisitors) {
        acc[deviceType].visitors.add(session.visitorId); // Track unique visitors
      } else {
        acc[deviceType].visitors.add(session.id); // Track all visitors
      }
      acc[deviceType].totalDuration += duration;
  
      // Track browser usage
      const browserName = session.browserInfo?.browserName || "Unknown";
      if (!acc[deviceType].browsers[browserName]) {
        acc[deviceType].browsers[browserName] = 0;
      }
      acc[deviceType].browsers[browserName] += 1;
  
      return acc;
    }, {});
  
    return {
      timelineData, // For the line chart
      referralData: referralChartData, // For the referral chart
      mapData: mapChartData, // For the world map
      pageVisitsData: sessions.map((session) => ({
        sessionId: session.id,
        visitorId: session.visitorId,
        firstPage: session.visitedPages?.[0] || "N/A",
        lastPage: session.visitedPages?.[session.visitedPages.length - 1] || "N/A",
        duration: session.duration || 0,
        visitedPages: session.visitedPages || [],
      })), // For the user visits insights
      deviceData: Object.keys(deviceData).map((deviceType) => ({
        deviceType,
        count: deviceData[deviceType].visitors.size,
        averageDuration: (deviceData[deviceType].totalDuration / deviceData[deviceType].visitors.size || 0).toFixed(2),
        browsers: deviceData[deviceType].browsers,
      })), // For the device distribution
    };
  };


  console.log(visitorData.mapData,'visitor map data')

  useEffect(() => {
    if (session?.status === "unauthenticated") {
      router.push("/");
    }
    if (session?.status === "authenticated") {
      fetchProjectData(getParams.id[0], session?.data?.user?.id);
      fetchVisitorData(getParams.id[0], selectedTimeline);
    }
  }, [session, selectedTimeline, showUniqueVisitors]);

  const handleTimelineChange = (timeline) => {
    setSelectedTimeline(timeline);
    fetchVisitorData(getParams.id[0], timeline);
  };

  const handleToggle = () => {
    setShowUniqueVisitors(!showUniqueVisitors);
  };

  if (session?.status === "loading" || loader === true) {
    return <InfoProjectSkeleton />;
  }

return (
    <div className="mt-16 p-6">
      <InfoHeader projectInfo={projectInfo} />

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FiCalendar className="text-gray-600 dark:text-gray-400" />
          <TimelineDropdown onSelectTimeline={handleTimelineChange} />
        </div>
        <div className="flex items-center space-x-2">
          <Switch checked={showUniqueVisitors} onCheckedChange={handleToggle} />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {showUniqueVisitors ? "Unique Visitors" : "All Visitors"}
          </span>
        </div>
      </div>

      <h2 className="mt-8 text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">Visitor Analytics</h2>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
        Showing visitor data for the {selectedTimeline.toLowerCase()}.
      </p>

      <div className="space-y-8">
        <Suspense fallback={<div className="h-[400px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>}>
          <VisitorLineChart data={visitorData.timelineData} />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Suspense fallback={<div className="h-[400px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg col-span-2"></div>}>
            <VisitorWorldMap visitorData={visitorData.mapData} />
          </Suspense>
          <Suspense fallback={<div className="h-[400px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>}>
            <ReferralSourcesList data={visitorData.referralData} />
          </Suspense>
        </div>

        {/* Add Device Distribution and User Visits Insights Components */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <DeviceDistribution data={visitorData.deviceData} />
          <UserVisitsInsights data={visitorData.pageVisitsData} />
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;