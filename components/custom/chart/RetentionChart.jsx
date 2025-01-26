import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const RetentionChart = ({ data }) => {
  return (
    <div className="p-4 rounded-lg shadow-md dark:bg-gray-800 ">
      <h2 className="text-xl font-bold mb-4 ">User Retention Over Time</h2>
      <p className="text-sm text-gray-600 mb-4">
        Percentage of users returning to the website over time.
      </p>
      <ResponsiveContainer width="100%" height={400} className="text-black ">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis unit="%" />
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
          <Line type="monotone" dataKey="retentionRate" stroke="#8884d8" name="Retention Rate" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RetentionChart;