import React from 'react';
import { FaUsers, FaUserCheck, FaUserClock } from 'react-icons/fa';

const SummaryCards = ({ data }) => {
  const totalVisitors = data.reduce((sum, entry) => sum + entry.visitors, 0);
  const totalUniqueVisitors = data.reduce((sum, entry) => sum + entry.uniqueVisitors, 0);
  const totalActiveUsers = data.reduce((sum, entry) => sum + entry.activeUsers, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Visitors Card */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Visitors</p>
            <p className="text-2xl font-bold">{totalVisitors}</p>
          </div>
          <div className="bg-blue-600 p-3 rounded-full">
            <FaUsers className="text-2xl" />
          </div>
        </div>
      </div>

      {/* Unique Visitors Card */}
      <div className="bg-gradient-to-r from-green-500 to-green-400 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Unique Visitors</p>
            <p className="text-2xl font-bold">{totalUniqueVisitors}</p>
          </div>
          <div className="bg-green-600 p-3 rounded-full">
            <FaUserCheck className="text-2xl" />
          </div>
        </div>
      </div>

      {/* Active Users Card */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-400 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Active Users</p>
            <p className="text-2xl font-bold">{totalActiveUsers}</p>
          </div>
          <div className="bg-purple-600 p-3 rounded-full">
            <FaUserClock className="text-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;