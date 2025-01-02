import React from 'react';
import { SiVirustotal } from "react-icons/si";
import { FaTwitter } from "react-icons/fa";

const Flow = () => {
  const data = [
    {
      name: 'total',
      icon: SiVirustotal,
      count: 100,
    },
    {
      name: "twitter",
      icon: FaTwitter,
      count: 20,
    },
    {
      name: "facebook",
      icon: FaTwitter,
      count: 40,
    },
    {
      name: "instagram",
      icon: FaTwitter,
      count: 60,
    }
  ];

  return (
    <div className="w-full p-6 space-y-4 text-white rounded-lg">
      <h2 className=" text-header">Social Media Stats ( Refers )</h2>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.name} className="relative">
            <div className="flex items-center gap-3 mb-2">
              <item.icon className="w-6 h-6 text-white" />
              <span className="text-sm font-medium capitalize text-gray-700">
                {item.name}
              </span>
              <span className="ml-auto font-bold text-white">
                {item.count}
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${(item.count / Math.max(...data.map(d => d.count))) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Flow;