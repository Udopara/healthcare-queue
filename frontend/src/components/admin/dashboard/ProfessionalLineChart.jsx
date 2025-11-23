import React, { useState } from 'react';

const PRIMARY_COLOR = "#6366f1"; // Indigo
const SECONDARY_COLOR = "#10b981"; // Emerald
const ACCENT_COLOR = "#8b5cf6"; // Purple

export default function ProfessionalLineChart({ data, title, dataKey, color = PRIMARY_COLOR }) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
        <div className="text-center text-gray-500 py-12">No data available</div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d[dataKey] || 0));
  const minValue = Math.min(...data.map(d => d[dataKey] || 0));
  const range = maxValue - minValue || 1;
  const chartHeight = 350; // Increased from 200
  const chartWidth = 1000;
  const padding = { top: 30, right: 50, bottom: 50, left: 70 }; // Increased padding

  // Calculate points for the line
  const points = data.map((d, idx) => {
    const x = padding.left + (idx * (chartWidth - padding.left - padding.right) / Math.max(1, data.length - 1));
    const value = d[dataKey] || 0;
    const y = padding.top + chartHeight - ((value - minValue) / range) * chartHeight;
    return { x, y, value, date: d.date, index: idx };
  });

  // Create smooth path
  const createSmoothPath = (points) => {
    if (points.length < 2) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[i + 1];
      
      if (i === 1) {
        const cp1x = prev.x + (curr.x - prev.x) / 3;
        const cp1y = prev.y;
        const cp2x = curr.x - (next ? (next.x - curr.x) / 3 : (curr.x - prev.x) / 3);
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else if (i === points.length - 1) {
        const cp1x = prev.x + (curr.x - prev.x) / 3;
        const cp1y = prev.y;
        const cp2x = curr.x - (curr.x - prev.x) / 3;
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      } else {
        const cp1x = prev.x + (curr.x - prev.x) / 3;
        const cp1y = prev.y;
        const cp2x = curr.x - (next.x - curr.x) / 3;
        const cp2y = curr.y;
        path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
      }
    }
    
    return path;
  };

  const linePath = createSmoothPath(points);
  const areaPath = linePath + ` L ${points[points.length - 1].x} ${padding.top + chartHeight} L ${points[0].x} ${padding.top + chartHeight} Z`;

  // Y-axis labels
  const yAxisLabels = [];
  for (let i = 0; i <= 4; i++) {
    const value = Math.round(minValue + (range * (4 - i) / 4));
    yAxisLabels.push({
      value,
      y: padding.top + (i * chartHeight / 4)
    });
  }

  return (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-bold text-gray-900 mb-6">{title}</h3>
      <div className="w-full overflow-x-auto relative">
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight + padding.top + padding.bottom}`} className="w-full" style={{ minHeight: '430px' }}>
          {/* Grid lines */}
          {yAxisLabels.map((label, idx) => (
            <line
              key={idx}
              x1={padding.left}
              y1={label.y + padding.top}
              x2={chartWidth - padding.right}
              y2={label.y + padding.top}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}

          {/* Y-axis labels */}
          {yAxisLabels.map((label, idx) => (
            <text
              key={idx}
              x={padding.left - 10}
              y={label.y + padding.top + 4}
              textAnchor="end"
              className="text-xs fill-gray-500"
              fontSize="12"
            >
              {label.value}
            </text>
          ))}

          {/* Area under curve */}
          <path
            d={areaPath}
            fill={color}
            fillOpacity="0.1"
          />

          {/* Line */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points with hover */}
          {points.map((point, idx) => (
            <g key={idx}>
              {/* Invisible larger circle for easier hovering */}
              <circle
                cx={point.x}
                cy={point.y}
                r="12"
                fill="transparent"
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  setHoveredPoint(point);
                }}
                onMouseLeave={() => setHoveredPoint(null)}
                style={{ cursor: 'pointer' }}
              />
              {/* Outer glow circle */}
              {hoveredPoint?.index === point.index && (
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="10"
                  fill={color}
                  fillOpacity="0.2"
                />
              )}
              {/* Inner circle */}
              <circle
                cx={point.x}
                cy={point.y}
                r={hoveredPoint?.index === point.index ? "6" : "4"}
                fill={color}
                stroke="white"
                strokeWidth="2"
              />
            </g>
          ))}

          {/* Tooltip */}
          {hoveredPoint && (
            <g>
              {/* Tooltip background */}
              <rect
                x={hoveredPoint.x - 60}
                y={hoveredPoint.y - 50}
                width="120"
                height="40"
                rx="6"
                fill="rgba(0, 0, 0, 0.8)"
              />
              {/* Tooltip text */}
              <text
                x={hoveredPoint.x}
                y={hoveredPoint.y - 35}
                textAnchor="middle"
                className="text-xs fill-white font-semibold"
                fontSize="11"
              >
                {new Date(hoveredPoint.date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </text>
              <text
                x={hoveredPoint.x}
                y={hoveredPoint.y - 20}
                textAnchor="middle"
                className="text-xs fill-white font-bold"
                fontSize="13"
              >
                {hoveredPoint.value}
              </text>
              {/* Tooltip arrow */}
              <polygon
                points={`${hoveredPoint.x - 6},${hoveredPoint.y - 10} ${hoveredPoint.x + 6},${hoveredPoint.y - 10} ${hoveredPoint.x},${hoveredPoint.y - 4}`}
                fill="rgba(0, 0, 0, 0.8)"
              />
            </g>
          )}

          {/* X-axis labels */}
          {data.map((d, idx) => {
            if (idx % Math.ceil(data.length / 8) !== 0 && idx !== data.length - 1) return null;
            const x = padding.left + (idx * (chartWidth - padding.left - padding.right) / Math.max(1, data.length - 1));
            const date = new Date(d.date);
            return (
              <text
                key={idx}
                x={x}
                y={chartHeight + padding.top + 20}
                textAnchor="middle"
                className="text-xs fill-gray-500"
                fontSize="11"
              >
                {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
