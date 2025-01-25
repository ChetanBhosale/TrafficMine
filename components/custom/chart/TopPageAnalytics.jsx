"use client";

import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Sankey } from "recharts";

const TopPagesAnalytics = ({ sessions }) => {
  // Process sessions data to extract landing pages, exit pages, and user journey
  const landingPages = {};
  const exitPages = {};
  const userJourney = { nodes: [], links: [] };

  sessions.forEach((session) => {
    // Check if visitedPages exists and has at least one element
    const landingPage = session.visitedPages && session.visitedPages.length > 0 ? session.visitedPages[0] : null;
    const exitPage = session.page; // Exit page

    // Skip if landingPage is null or undefined
    if (!landingPage) return;

    // Count landing pages
    if (!landingPages[landingPage]) {
      landingPages[landingPage] = { views: 0, uniqueVisitors: new Set() };
    }
    landingPages[landingPage].views += 1;
    landingPages[landingPage].uniqueVisitors.add(session.visitorId);

    // Count exit pages
    if (!exitPages[exitPage]) {
      exitPages[exitPage] = { views: 0, uniqueVisitors: new Set() };
    }
    exitPages[exitPage].views += 1;
    exitPages[exitPage].uniqueVisitors.add(session.visitorId);

    // Build user journey (landing page → exit page)
    const landingIndex = userJourney.nodes.findIndex((node) => node.name === landingPage);
    const exitIndex = userJourney.nodes.findIndex((node) => node.name === exitPage);

    if (landingIndex === -1) {
      userJourney.nodes.push({ name: landingPage });
    }
    if (exitIndex === -1) {
      userJourney.nodes.push({ name: exitPage });
    }

    const linkIndex = userJourney.links.findIndex(
      (link) => link.source === landingPage && link.target === exitPage
    );

    if (linkIndex === -1) {
      userJourney.links.push({ source: landingPage, target: exitPage, value: 1 });
    } else {
      userJourney.links[linkIndex].value += 1;
    }
  });

  // Format data for charts
  const landingPagesData = Object.keys(landingPages).map((page) => ({
    page,
    views: landingPages[page].views,
    uniqueVisitors: landingPages[page].uniqueVisitors.size,
  }));

  const exitPagesData = Object.keys(exitPages).map((page) => ({
    page,
    views: exitPages[page].views,
    uniqueVisitors: exitPages[page].uniqueVisitors.size,
  }));

  // Check if userJourney data is valid for Sankey diagram
  const isUserJourneyValid = userJourney.nodes.length > 0 && userJourney.links.length > 0;

  return (
    <div className="space-y-8">
      {/* Top Landing Pages */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Top Landing Pages</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={landingPagesData}>
            <XAxis dataKey="page" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend />
            <Bar dataKey="views" fill="#3b82f6" name="Page Views" />
            <Bar dataKey="uniqueVisitors" fill="#10b981" name="Unique Visitors" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Exit Pages */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Top Exit Pages</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={exitPagesData}>
            <XAxis dataKey="page" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend />
            <Bar dataKey="views" fill="#3b82f6" name="Page Views" />
            <Bar dataKey="uniqueVisitors" fill="#10b981" name="Unique Visitors" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* User Journey */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">User Journey</h2>
        {isUserJourneyValid ? (
          <ResponsiveContainer width="100%" height={400}>
            <Sankey
              data={userJourney}
              node={{ fill: "#3b82f6", stroke: "#1e40af", strokeWidth: 2 }}
              link={{ fill: "#93c5fd", stroke: "#1e40af", strokeWidth: 0 }}
            >
              <Tooltip />
            </Sankey>
          </ResponsiveContainer>
        ) : (
          <div className="h-96 flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-400">No user journey data available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopPagesAnalytics;