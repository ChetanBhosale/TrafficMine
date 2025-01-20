"use client"

import React, { useEffect, useState, Suspense } from "react"
import { useSession } from "next-auth/react"
import { useParams, useRouter } from "next/navigation"
import { getSingleProject } from "@/app/actions/projects"
import { getVisitorSessions } from "@/app/actions/visitorSession"
import InfoHeader from "@/components/custom/Info/infoHeader"
import InfoProjectSkeleton from "@/components/custom/Info/InfoProjectSkeleton"
import VisitorLineChart from "@/components/custom/chart/VisitorBarCharts"
import TimelineDropdown from "@/components/custom/Info/TimeLine"
import { Switch } from "@/components/ui/switch"
import VisitorWorldMap from "@/components/custom/Info/VisitorWorldMap"
import ReferralSourcesList from "@/components/custom/chart/ReferralChart"
import { FiCalendar } from "react-icons/fi"
import toast from "react-hot-toast"

const ProjectPage = () => {
  const session = useSession()
  const router = useRouter()
  const getParams = useParams()
  const [projectInfo, setProjectInfo] = useState(null)
  const [selectedTimeline, setSelectedTimeline] = useState("Last 24 Hours")
  const [visitorData, setVisitorData] = useState({ timelineData: [], referralData: [] })
  const [loader,setLoader] = useState(false)
  const [showUniqueVisitors, setShowUniqueVisitors] = useState(false)

  async function fetchProjectData(projectId, userId) {
    const data = await getSingleProject(projectId, userId)
    if (data?.status === 200) {
      setProjectInfo(data?.data)
    } else {
      toast.error("Project not found")
      router.push("/dashboard")
    }
  }

  async function fetchVisitorData(projectId, timeline) {
    setLoader(true)
    const response = await getVisitorSessions(projectId, timeline)
    if (response?.status === 200) {
      
      const transformedData = transformDataForChart(response.data, showUniqueVisitors, timeline)
      setLoader(false)
      setVisitorData(transformedData)
    } else {
      toast.error("Failed to fetch visitor data")
    }
    setLoader(false)
  }

  const transformDataForChart = (sessions, showUniqueVisitors, timeline) => {
    const now = new Date();
    let labels = [];
    let groupedData = {};

    const referralData = sessions.reduce((acc, session) => {
      const source = session.source || "direct";
      if (!acc[source]) {
        acc[source] = { visitors: new Set(), countries: new Set() };
      }
      if (showUniqueVisitors) {
        acc[source].visitors.add(session.visitorId);
      } else {
        acc[source].visitors.add(session.id);
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
        acc[label] = { visitors: new Set(), countries: new Set() };
      }
      if (showUniqueVisitors) {
        acc[label].visitors.add(session.visitorId);
      } else {
        acc[label].visitors.add(session.id);
      }
      if (session.country) {
        acc[label].countries.add(session.country);
      }
      return acc;
    }, {});

    return {
      timelineData: labels.map((label) => ({
        label,
        visitors: groupedData[label] ? groupedData[label].visitors.size : 0,
        countries: groupedData[label] ? Array.from(groupedData[label].countries) : [],
      })),
      referralData: referralChartData,
    };
  };

  useEffect(() => {
    if (session?.status === "unauthenticated") {
      router.push("/")
    }
    if (session?.status === "authenticated") {
      fetchProjectData(getParams.id[0], session?.data?.user?.id)
      fetchVisitorData(getParams.id[0], selectedTimeline)
    }
  }, [session, selectedTimeline, showUniqueVisitors])

  const handleTimelineChange = (timeline) => {
    setSelectedTimeline(timeline)
    fetchVisitorData(getParams.id[0], timeline)
  }

  const handleToggle = () => {
    setShowUniqueVisitors(!showUniqueVisitors)
  }

  if (session?.status === "loading" || loader == true) {
    return <InfoProjectSkeleton />
  }

  console.log(projectInfo,'project INdo')

  return (
    <div className="mt-16 p-6 ">
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
            <VisitorWorldMap visitorData={visitorData.timelineData} />
          </Suspense>
          <Suspense fallback={<div className="h-[400px] bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>}>
            <ReferralSourcesList data={visitorData.referralData} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default ProjectPage