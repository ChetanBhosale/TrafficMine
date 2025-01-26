import React from "react";

const TimelineDropdown = ({ onSelectTimeline,selectedTimeline }) => {
  const handleChange = (event) => {
    const selectedValue = event.target.value;
    onSelectTimeline(selectedValue);
  };

  return (
    <select
      onChange={handleChange}
      defaultValue={selectedTimeline}
      className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-2 text-sm text-gray-700 dark:text-gray-300"
    >
      <option value="Last 24 Hours">Last 24 Hours</option>
      <option value="Last Week">Last Week</option>
      <option value="Last Month">Last Month</option>
    </select>
  );
};

export default TimelineDropdown;