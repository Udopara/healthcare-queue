import React from 'react';

export default function SimpleBarChart({ data, title, dataKey, nameKey = "name", color = "#3b82f6" }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-center text-gray-500 py-8">No data available</div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d[dataKey] || 0));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {data.map((item, idx) => {
          const value = item[dataKey] || 0;
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          const name = item[nameKey] || 'Unknown';

          return (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">{name}</span>
                <span className="text-gray-600">{value}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

