import React, { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts";

const RevisedMostVisitedPages = ({ mostVisitedPagesData, mostCommonLastPageData }) => {
  const [selectedOption, setSelectedOption] = useState("mostVisited");

  const data = selectedOption === "mostVisited" ? mostVisitedPagesData : mostCommonLastPageData;

  // Gradient colors for the bars
  const gradientColors = [
    { start: "#4299e1", end: "#63b3ed" },
    { start: "#f56565", end: "#fc8181" },
    { start: "#48bb78", end: "#68d391" },
  ];

  console.log(data,'data')

  return (
    <div className="bg-gray-800 text-white p-6 rounded-2xl shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold">
          {selectedOption === "mostVisited" ? "Most Visited Pages" : "Most Common Last Page"}
        </h3>
        <div>
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="p-2 bg-gray-700 rounded-md text-white border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
            <option value="mostVisited">Most Visited Pages</option>
            <option value="lastPage">Most Common Last Page</option>
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
          <XAxis type="number" hide />
          <YAxis type="category"  hide/>
          <Tooltip
            cursor={{ fill: "rgba(255, 255, 255, 0.1)", strokeWidth: 1 }}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              border: "none",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              color: "black",
              padding: "16px",
            }}
          />
          <Legend
            wrapperStyle={{
              color: "gray-400",
              fontSize: "14px",
              marginBottom: "16px",
            }}
          />
          <Bar
            dataKey="visitors"
            fill="url(#colorGradient)"
            radius={[0, 12, 12, 0]}
            barSize={24}
          >
            <YAxis dataKey="visitors" type="number" hide />
            <LabelList
              dataKey="label"
              position="bottom"
              fill="white"
              fontSize={12}
              fontWeight="medium"
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <svg style={{ height: 0 }}>
        <defs>
          <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={gradientColors[selectedOption === "mostVisited" ? 0 : 1].start} />
            <stop offset="100%" stopColor={gradientColors[selectedOption === "mostVisited" ? 0 : 1].end} />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-400">
          {selectedOption === "mostVisited"
            ? "Shows the most visited pages by users."
            : "Shows the most common last page users were on before leaving."}
        </p>
        <p className="text-sm text-gray-400">{data[0]?.visitors} visits</p>
      </div>
    </div>
  );
};

export default RevisedMostVisitedPages;