import React, { useState } from 'react';
import { FaDesktop, FaMobileAlt, FaTabletAlt, FaQuestionCircle, FaChrome, FaFirefox, FaEdge, FaSafari, FaOpera } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const UserDeviceBrowserStats = ({ deviceData, browserData }) => {
  const [activeView, setActiveView] = useState('devices');

  const deviceIcons = { desktop: FaDesktop, mobile: FaMobileAlt, tablet: FaTabletAlt, unknown: FaQuestionCircle };
  const browserIcons = { Chrome: FaChrome, Firefox: FaFirefox, Edge: FaEdge, Safari: FaSafari, Opera: FaOpera, Unknown: FaQuestionCircle };

  const processData = (data) => data.reduce((acc, { name, value }) => ({ ...acc, [name]: value }), {});

  const mergedDeviceStats = { desktop: 0, mobile: 0, tablet: 0, unknown: 0, ...processData(deviceData) };
  const mergedBrowserStats = { Chrome: 0, Firefox: 0, Edge: 0, Safari: 0, Opera: 0, Unknown: 0, ...processData(browserData) };

  const deviceChartData = Object.entries(mergedDeviceStats).map(([name, value]) => ({ name, value }));
  const browserChartData = Object.entries(mergedBrowserStats).map(([name, value]) => ({ name, value }));

  const COLORS = ['#3B82F6', '#10B981', '#EAB308', '#6B7280'];

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-200">User Device & Browser Analytics</h3>
        <div className="flex space-x-2">
          <button onClick={() => setActiveView('devices')} className={`px-3 py-1 rounded-full ${activeView === 'devices' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'}`}>Devices</button>
          <button onClick={() => setActiveView('browsers')} className={`px-3 py-1 rounded-full ${activeView === 'browsers' ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-400'}`}>Browsers</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 rounded-lg p-4">
          <h4 className="text-sm font-semibold mb-4 text-gray-300">{activeView === 'devices' ? 'Device Distribution' : 'Browser Distribution'}</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={activeView === 'devices' ? deviceChartData : browserChartData} innerRadius={40} outerRadius={60} dataKey="value" >
                {(activeView === 'devices' ? deviceChartData : browserChartData).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              
              <Tooltip contentStyle={{ backgroundColor: 'white', color: 'white', fontSize: '12px', padding: '8px' }} color="white" cursor={{ fill: 'white' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {activeView === 'devices'
            ? Object.entries(mergedDeviceStats).map(([device, count]) => (
                <div key={device} className="bg-gray-800 rounded-lg p-3 flex items-center space-x-3">
                  <span className={`text-2xl ${device === 'unknown' ? 'text-gray-500' : device === 'desktop' ? 'text-blue-500' : device === 'mobile' ? 'text-green-500' : 'text-yellow-500'}`}>
                    {React.createElement(deviceIcons[device])}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-200 capitalize">{device}</p>
                    <p className="text-xs text-gray-400">{count} users</p>
                  </div>
                </div>
              ))
            : Object.entries(mergedBrowserStats).map(([browser, count]) => (
                <div key={browser} className="bg-gray-800 rounded-lg p-3 flex items-center space-x-3">
                  <span className={`text-2xl ${browser === 'Unknown' ? 'text-gray-500' : browser === 'Chrome' ? 'text-blue-500' : browser === 'Firefox' ? 'text-orange-500' : browser === 'Edge' ? 'text-blue-500' : browser === 'Safari' ? 'text-gray-500' : 'text-red-500'}`}>
                    {React.createElement(browserIcons[browser])}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-200 capitalize">{browser}</p>
                    <p className="text-xs text-gray-400">{count} users</p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default UserDeviceBrowserStats;