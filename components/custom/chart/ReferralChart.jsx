import React from "react"
import {
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaReddit,
  FaPinterest,
  FaSnapchat,
  FaGoogle,
  FaYahoo,
  FaGlobe,
  FaSearch,
  FaQuestionCircle,
} from "react-icons/fa"
import { TiDirections } from "react-icons/ti"

const ReferralSourcesList = ({ data }) => {
  const sourceConfig = {
    twitter: { icon: FaTwitter, color: "#1DA1F2", name: "Twitter" },
    facebook: { icon: FaFacebook, color: "#4267B2", name: "Facebook" },
    instagram: { icon: FaInstagram, color: "#E1306C", name: "Instagram" },
    linkedin: { icon: FaLinkedin, color: "#0077B5", name: "LinkedIn" },
    youtube: { icon: FaYoutube, color: "#FF0000", name: "YouTube" },
    reddit: { icon: FaReddit, color: "#FF4500", name: "Reddit" },
    pinterest: { icon: FaPinterest, color: "#E60023", name: "Pinterest" },
    tiktok: { icon: FaTiktok, color: "#000000", name: "TikTok" },
    snapchat: { icon: FaSnapchat, color: "#FFFC00", name: "Snapchat" },
    search: { icon: FaSearch, color: "#4285F4", name: "Search" },
    google: { icon: FaGoogle, color: "#4285F4", name: "Google" },
    yahoo: { icon: FaYahoo, color: "#720E9E", name: "Yahoo" },
    direct: { icon: TiDirections, color: "#42832A", name: "Direct/None" },
    unknown: { icon: FaQuestionCircle, color: "#9CA3AF", name: "Unknown" },
  }

  const getSourceType = (ref) => {
    console.log(ref ,'ref')
    if (!ref) return "direct"
    ref = ref.toLowerCase()

    if (ref.includes("t.co")) return "twitter"
    if (ref.includes("facebook.com") || ref.includes("fb.me")) return "facebook"
    if (ref.includes("instagram.com")) return "instagram"
    if (ref.includes("linkedin.com")) return "linkedin"
    if (ref.includes("youtube.com")) return "youtube"
    if (ref.includes("reddit.com")) return "reddit"
    if (ref.includes("pinterest.com")) return "pinterest"
    if (ref.includes("tiktok.com")) return "tiktok"
    if (ref.includes("snapchat.com")) return "snapchat"
    if (ref.includes("google")) return "google"
    if (ref.includes("bing.com")) return "search"
    if (ref.includes("yahoo.com")) return "yahoo"
    if (ref.includes("direct")) return "direct"
    return "unknown"
  }

  const getCompleteSourceData = () => {

    const completeData = Object.keys(sourceConfig).reduce((acc, source) => {
      acc[source] = { source, visitors: 0 }
      return acc
    }, {})

    // Update counts from actual data
    data.forEach((item) => {
      const sourceType = getSourceType(item.source)
      completeData[sourceType].visitors += item.visitors
    })

    return Object.values(completeData)
  }

  const sortedData = getCompleteSourceData().sort((a, b) => {
    if (a.visitors === 0 && b.visitors === 0) return 0
    if (a.visitors === 0) return 1
    if (b.visitors === 0) return -1
    return b.visitors - a.visitors
  })

  const maxVisitors = Math.max(...sortedData.map((d) => d.visitors))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Referrer Sources</h3>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Active Sources: {sortedData.filter((item) => item.visitors > 0).length}
        </span>
      </div>

      <div className="space-y-4">
        {sortedData.map((item, index) => {
          const config = sourceConfig[item.source]
          const Icon = config.icon

          return (
            <div
              key={index}
              className={`flex items-center justify-between rounded-lg transition-colors
                ${item.visitors > 0 ? "hover:bg-gray-50 dark:hover:bg-gray-700" : "opacity-50"}`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-8  flex items-center justify-center rounded-full"
                  style={{ backgroundColor: `${config.color}15` }}
                >
                  <Icon className="text-lg" style={{ color: config.color }} />
                </div>
                <span className="text-sm text-gray-700 dark:text-gray-300">{config.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="h-2 bg-blue-100 dark:bg-blue-900 rounded transition-all duration-300"
                  style={{
                    width: item.visitors > 0 ? `${(item.visitors / maxVisitors) * 150}px` : "20px",
                    opacity: item.visitors > 0 ? 1 : 0.3,
                  }}
                />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[3rem] text-right">
                  {item.visitors.toLocaleString()}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ReferralSourcesList

