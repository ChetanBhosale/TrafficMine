"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { scaleQuantile } from "d3-scale";
import { useTheme } from "next-themes";
import { getCountryName } from "@/lib/countryCode";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function VisitorWorldMap({ visitorData = [] }) {
  const { theme } = useTheme();
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Count visitors by country

  const countryCounts = visitorData.reduce((acc, session) => {
    const country = session.countries; // Ensure this is the correct field
    if (country) {
      const countryName = getCountryName(country);
      acc[countryName] = (acc[countryName] || 0) + (session.visitors || 1); // Use session.visitors or default to 1
    }
    return acc;
  }, {});

  const colorScale = scaleQuantile()
    .domain(Object.values(countryCounts))
    .range(["#ffedea", "#ffcec5", "#ffad9f", "#ff8a75", "#ff5533", "#e2492d", "#be3d26", "#9a311f", "#782618"]);

  const handleMouseMove = (event) => {
    setTooltipPosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div className="bg-background rounded-lg shadow-lg dark:bg-background-dark col-span-2" onMouseMove={handleMouseMove}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 120,
        }}
        width={800}
        height={400}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) => (
            <>
              {geographies.map((geo) => {
                const countryName = geo.properties.name;
                const visitors = countryCounts[countryName] || 0;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={visitors ? colorScale(visitors) : theme === "dark" ? "#374151" : "#f3f4f6"}
                    stroke={theme === "dark" ? "#4b5563" : "#d1d5db"}
                    strokeWidth={0.5}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", fill: "#ff5533" },
                      pressed: { outline: "none" },
                    }}
                    onMouseEnter={() => setHoveredCountry({ countryName, visitors })}
                    onMouseLeave={() => setHoveredCountry(null)}
                  />
                );
              })}

              {/* Render markers for countries with visitors */}
              {geographies.map((geo) => {
                const countryName = geo.properties.name;
                const visitors = countryCounts[countryName] || 0;
                if (visitors > 0) {
                  const [longitude, latitude] = geo.properties.center; // Use centroid coordinates
                  return (
                    <Marker key={countryName} coordinates={[longitude, latitude]}>
                      <circle r={Math.sqrt(visitors) * 2} fill="#ff5533" stroke="#fff" strokeWidth={1} opacity={0.8} />
                      <text x={5} y={-5} fontSize={10} fill={theme === "dark" ? "#fff" : "#000"} textAnchor="middle">
                        {visitors}
                      </text>
                    </Marker>
                  );
                }
                return null;
              })}
            </>
          )}
        </Geographies>
      </ComposableMap>

      {hoveredCountry && (
        <div
          style={{
            position: "fixed",
            left: tooltipPosition.x + 10,
            top: tooltipPosition.y + 10,
            backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
            padding: "8px",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            zIndex: 1000,
            pointerEvents: "none",
          }}
        >
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{hoveredCountry.countryName}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Visitors: {hoveredCountry.visitors}</p>
        </div>
      )}
    </div>
  );
}