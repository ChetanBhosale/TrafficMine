import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const UserVisitsInsights = ({ data = [] }) => { // Default to an empty array
  const [filter, setFilter] = useState("average"); // Filter by average, first, or last

  // Calculate average time spent on each page
  const calculateAverageTime = () => {
    const pageDurations = {};

    data.forEach((session) => {
      session.visitedPages.forEach((page, index) => {
        if (!pageDurations[page]) {
          pageDurations[page] = { totalDuration: 0, count: 0 };
        }
        // Distribute duration equally across pages
        pageDurations[page].totalDuration += session.duration / session.visitedPages.length;
        pageDurations[page].count += 1;
      });
    });

    return Object.keys(pageDurations).map((page) => ({
      page,
      averageDuration: (pageDurations[page].totalDuration / pageDurations[page].count).toFixed(2),
    }));
  };

  // Get first or last page visits
  const getPageVisits = (type) => {
    const pages = {};

    data.forEach((session) => {
      const page = type === "first" ? session.firstPage : session.lastPage;
      if (!pages[page]) {
        pages[page] = 0;
      }
      pages[page] += 1;
    });

    return Object.keys(pages).map((page) => ({
      page,
      visits: pages[page],
    }));
  };

  const renderData = () => {
    switch (filter) {
      case "average":
        return calculateAverageTime().map((item) => (
          <div key={item.page} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">{item.page}</span>
            <span className="text-gray-900 dark:text-gray-100 font-semibold">
              {item.averageDuration} sec
            </span>
          </div>
        ));
      case "first":
        return getPageVisits("first").map((item) => (
          <div key={item.page} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">{item.page}</span>
            <span className="text-gray-900 dark:text-gray-100 font-semibold">
              {item.visits} visits
            </span>
          </div>
        ));
      case "last":
        return getPageVisits("last").map((item) => (
          <div key={item.page} className="flex justify-between py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-700 dark:text-gray-300">{item.page}</span>
            <span className="text-gray-900 dark:text-gray-100 font-semibold">
              {item.visits} exits
            </span>
          </div>
        ));
      default:
        return null;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
        User Visits Insights
      </h3>
      <div className="mb-4">
        <div className="relative inline-block">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md py-2 pl-3 pr-8 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="average">Average Time Spent</option>
            <option value="first">First Page Visits</option>
            <option value="last">Last Page Exits</option>
          </select>
          <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none" />
        </div>
      </div>
      <div className="space-y-2">
        {renderData()}
      </div>
    </div>
  );
};

export default UserVisitsInsights;