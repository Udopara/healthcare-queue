import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

const colors = {
  completed: "#10b981",
  waiting: "#3b82f6",
  serving: "#f59e0b",
  cancelled: "#ef4444"
};

export default function MultiLineChart({ data, title }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="w-full overflow-x-auto">
        <RechartsLineChart 
          width={800} 
          height={300} 
          data={data} 
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 12 }}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }}
          />
          <YAxis 
            stroke="#6b7280"
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
            labelFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="completed" 
            stroke={colors.completed} 
            strokeWidth={2}
            dot={{ fill: colors.completed, r: 3 }}
            name="Completed"
          />
          <Line 
            type="monotone" 
            dataKey="waiting" 
            stroke={colors.waiting} 
            strokeWidth={2}
            dot={{ fill: colors.waiting, r: 3 }}
            name="Waiting"
          />
          <Line 
            type="monotone" 
            dataKey="serving" 
            stroke={colors.serving} 
            strokeWidth={2}
            dot={{ fill: colors.serving, r: 3 }}
            name="Serving"
          />
          <Line 
            type="monotone" 
            dataKey="cancelled" 
            stroke={colors.cancelled} 
            strokeWidth={2}
            dot={{ fill: colors.cancelled, r: 3 }}
            name="Cancelled"
          />
        </RechartsLineChart>
      </div>
    </div>
  );
}

