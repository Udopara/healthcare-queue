import React from 'react';

const PRIMARY_COLOR = "#3b82f6"; // Blue
const SECONDARY_COLOR = "#10b981"; // Green
const ACCENT_COLOR = "#f59e0b"; // Orange

export default function VerticalBarChart({ data, title, dataKey, nameKey = "name", color = PRIMARY_COLOR }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-center text-gray-500 py-8">No data available</div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d[dataKey] || 0));
  const chartHeight = 140;
  const barWidth = 28;
  const spacing = 12;
  const chartWidth = data.length * (barWidth + spacing) + spacing;
  const padding = { top: 15, right: 20, bottom: 30, left: 40 };

  // Y-axis labels
  const yAxisLabels = [];
  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    const value = Math.round((maxValue * (steps - i)) / steps);
    yAxisLabels.push({
      value: value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value,
      y: padding.top + (i * chartHeight / steps)
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${chartWidth + padding.left + padding.right} ${chartHeight + padding.top + padding.bottom}`} className="w-full" style={{ minHeight: '200px' }}>
          {/* Grid lines */}
          {yAxisLabels.map((label, idx) => (
            <line
              key={idx}
              x1={padding.left}
              y1={label.y + padding.top}
              x2={chartWidth + padding.left}
              y2={label.y + padding.top}
              stroke="#f3f4f6"
              strokeWidth="1"
            />
          ))}

          {/* Y-axis labels */}
          {yAxisLabels.map((label, idx) => (
            <text
              key={idx}
              x={padding.left - 8}
              y={label.y + padding.top + 3}
              textAnchor="end"
              className="fill-gray-500"
              fontSize="10"
            >
              {label.value}
            </text>
          ))}

          {/* Bars */}
          {data.map((item, idx) => {
            const value = item[dataKey] || 0;
            const barHeight = maxValue > 0 ? (value / maxValue) * chartHeight : 0;
            const x = padding.left + spacing + idx * (barWidth + spacing);
            const y = padding.top + chartHeight - barHeight;
            const name = item[nameKey] || 'Unknown';

            return (
              <g key={idx}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={color}
                  rx="3"
                  ry="3"
                />
                {/* Value label on top of bar */}
                {barHeight > 15 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 3}
                    textAnchor="middle"
                    className="font-semibold fill-gray-700"
                    fontSize="9"
                  >
                    {value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                  </text>
                )}
                {/* X-axis label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + padding.top + 15}
                  textAnchor="middle"
                  className="fill-gray-500"
                  fontSize="9"
                >
                  {name.length > 12 ? name.substring(0, 10) + '...' : name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

