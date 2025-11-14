import React from 'react';

export default function SimpleLineChart({ data, title }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-center text-gray-500 py-8">No data available</div>
      </div>
    );
  }

  const maxValue = Math.max(
    ...data.flatMap(d => [d.completed || 0, d.waiting || 0, d.serving || 0, d.cancelled || 0])
  );

  const colors = {
    completed: "#10b981",
    waiting: "#3b82f6",
    serving: "#f59e0b",
    cancelled: "#ef4444"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.completed }}></div>
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.waiting }}></div>
            <span className="text-gray-600">Waiting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.serving }}></div>
            <span className="text-gray-600">Serving</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors.cancelled }}></div>
            <span className="text-gray-600">Cancelled</span>
          </div>
        </div>

        {/* Chart Area */}
        <div className="relative" style={{ height: '250px' }}>
          <svg viewBox="0 0 800 250" className="w-full h-full">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <line
                key={i}
                x1="40"
                y1={50 + i * 40}
                x2="760"
                y2={50 + i * 40}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}

            {/* Y-axis labels */}
            {[0, 1, 2, 3, 4].map(i => {
              const value = Math.round(maxValue * (1 - i / 4));
              return (
                <text
                  key={i}
                  x="35"
                  y={55 + i * 40}
                  textAnchor="end"
                  className="text-xs fill-gray-600"
                >
                  {value}
                </text>
              );
            })}

            {/* Draw lines for each status */}
            {['completed', 'waiting', 'serving', 'cancelled'].map((status, statusIdx) => {
              const points = data.map((d, idx) => {
                const x = 60 + (idx * (700 / Math.max(1, data.length - 1)));
                const value = d[status] || 0;
                const y = 50 + (200 * (1 - value / maxValue));
                return `${x},${y}`;
              }).join(' ');

              return (
                <polyline
                  key={status}
                  points={points}
                  fill="none"
                  stroke={colors[status]}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}

            {/* X-axis labels */}
            {data.map((d, idx) => {
              if (idx % Math.ceil(data.length / 8) !== 0 && idx !== data.length - 1) return null;
              const x = 60 + (idx * (700 / Math.max(1, data.length - 1)));
              const date = new Date(d.date);
              return (
                <text
                  key={idx}
                  x={x}
                  y="240"
                  textAnchor="middle"
                  className="text-xs fill-gray-600"
                >
                  {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}

