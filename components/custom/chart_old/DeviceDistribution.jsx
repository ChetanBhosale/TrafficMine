import React from "react";
import { FaDesktop, FaMobileAlt, FaTabletAlt } from "react-icons/fa";
import { SiGooglechrome, SiFirefox, SiSafari, SiOpera } from "react-icons/si";
import { FaEdgeLegacy } from "react-icons/fa";

const DeviceDistribution = ({ data }) => {
  // Predefined list of browsers with their icons and colors
  const allBrowsers = [
    { name: "Chrome", icon: <SiGooglechrome className="text-blue-500 text-xl" />, color: "blue" },
    { name: "Firefox", icon: <SiFirefox className="text-orange-500 text-xl" />, color: "orange" },
    { name: "Safari", icon: <SiSafari className="text-purple-500 text-xl" />, color: "purple" },
    { name: "Opera", icon: <SiOpera className="text-red-500 text-xl" />, color: "red" },
    { name: "Edge", icon: <FaEdgeLegacy className="text-blue-600 text-xl" />, color: "blue" },
  ];

  // Ensure all device types are present in the data
  const devices = ["desktop", "mobile", "tablet"].map((deviceType) => {
    const device = data.find((d) => d.deviceType === deviceType);
    return device || { deviceType, count: 0, averageDuration: "0.00", browsers: {} };
  });

  // Calculate total browser usage across all devices
  const browserUsage = allBrowsers.map((browser) => {
    const totalVisits = devices.reduce((sum, device) => sum + (device.browsers[browser.name] || 0), 0);
    return { ...browser, totalVisits };
  });

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">

      {/* Devices Section */}
      <div className="mb-8">
        <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-4">Devices</h4>
        <div className="space-y-4">
          {devices.map((device) => (
            <div key={device.deviceType} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {device.deviceType === "desktop" && <FaDesktop className="text-blue-500 text-2xl" />}
                  {device.deviceType === "mobile" && <FaMobileAlt className="text-green-500 text-2xl" />}
                  {device.deviceType === "tablet" && <FaTabletAlt className="text-purple-500 text-2xl" />}
                  <span className="text-gray-800 dark:text-gray-200 font-semibold capitalize">
                    {device.deviceType}
                  </span>
                </div>
                <div className="text-gray-900 dark:text-gray-100">
                  <span className="font-semibold">{device.count} visits</span>
                  <span className="ml-2">(Avg: {device.averageDuration} sec)</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Browsers Section */}
      <div>
        <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-4">Browsers</h4>
        <div className="space-y-4">
          {browserUsage.map((browser) => (
            <div key={browser.name} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {browser.icon}
                  <span className="text-gray-800 dark:text-gray-200 font-semibold capitalize">
                    {browser.name}
                  </span>
                </div>
                <span className="text-gray-900 dark:text-gray-100 font-semibold">
                  {browser.totalVisits} visits
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeviceDistribution;