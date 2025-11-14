import React from 'react';

const PRIMARY_COLOR = "#3b82f6"; // Blue
const SECONDARY_COLOR = "#10b981"; // Green
const ACCENT_COLOR = "#f59e0b"; // Orange
const COLORS = [PRIMARY_COLOR, SECONDARY_COLOR, ACCENT_COLOR, "#8b5cf6", "#ec4899", "#06b6d4"];

export default function SimplePieChart({ data, title }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-center text-gray-500 py-8">No data available</div>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
  let currentAngle = -90; // Start from top

  const segments = data.map((item, idx) => {
    const value = item.value || 0;
    const percentage = total > 0 ? (value / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const color = item.color || COLORS[idx % COLORS.length];
    
    // Calculate arc path
    const radius = 80;
    const largeArcFlag = angle > 180 ? 1 : 0;
    const startX = 100 + radius * Math.cos((startAngle * Math.PI) / 180);
    const startY = 100 + radius * Math.sin((startAngle * Math.PI) / 180);
    const endX = 100 + radius * Math.cos((endAngle * Math.PI) / 180);
    const endY = 100 + radius * Math.sin((endAngle * Math.PI) / 180);

    return {
      ...item,
      percentage,
      color,
      path: `M 100 100 L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`,
      labelAngle: (startAngle + angle / 2) * Math.PI / 180,
      labelX: 100 + (radius + 20) * Math.cos((startAngle + angle / 2) * Math.PI / 180),
      labelY: 100 + (radius + 20) * Math.sin((startAngle + angle / 2) * Math.PI / 180)
    };
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Pie Chart */}
        <div className="flex-shrink-0">
          <svg viewBox="0 0 200 200" className="w-48 h-48">
            {segments.map((segment, idx) => (
              <g key={idx}>
                <path
                  d={segment.path}
                  fill={segment.color}
                  stroke="white"
                  strokeWidth="2"
                />
                {segment.percentage > 5 && (
                  <text
                    x={segment.labelX}
                    y={segment.labelY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-xs font-semibold fill-gray-700"
                    fontSize="11"
                  >
                    {segment.percentage.toFixed(0)}%
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3">
          {segments.map((segment, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: segment.color }}
                ></div>
                <span className="text-sm font-medium text-gray-700">{segment.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">{segment.value}</span>
                <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                  {segment.percentage.toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

