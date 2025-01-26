import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const CombinedChart = ({ data }) => {
  return (
    <div className="dark:bg-gray-800 p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Session Metrics</h2>
      <p className="text-sm text-gray-600 mb-4">
        Average session duration, bounce rate, engagement rate, and returning users over time.
      </p>
      <ResponsiveContainer width="100%" height={400} className="text-black">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis yAxisId="left" unit="s" />
          <YAxis yAxisId="right" orientation="right" unit="%" />
          <Tooltip formatter={(value, name) => `${value}${name.includes("Rate") || name.includes("Percentage") ? "%" : ""}`} />
          <Legend />
          <Line yAxisId="left" type="monotone" dataKey="avgDuration" stroke="#82ca9d" name="Avg Duration (s)" />
          <Line yAxisId="right" type="monotone" dataKey="bounceRate" stroke="#ff7300" name="Bounce Rate (%)" />
          <Line yAxisId="right" type="monotone" dataKey="engagementRate" stroke="#8884d8" name="Engagement Rate (%)" />
          <Line yAxisId="right" type="monotone" dataKey="returningUsersPercentage" stroke="#ffc658" name="Returning Users (%)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CombinedChart;