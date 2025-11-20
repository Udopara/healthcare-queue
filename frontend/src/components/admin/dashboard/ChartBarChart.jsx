import React, { useRef, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Title,
  Tooltip,
  Legend
);

const PRIMARY_COLOR = "#6366f1"; // Indigo

export default function ChartBarChart({ data, title, dataKey, nameKey = "name", color = PRIMARY_COLOR }) {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const ctx = chartRef.current?.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }

    const chartData = {
      labels: data.map(item => item[nameKey] || 'Unknown'),
      datasets: [
        {
          label: title,
          data: data.map(item => item[dataKey] || 0),
          backgroundColor: color,
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    };

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          padding: 12,
          titleFont: {
            size: 12,
          },
          bodyFont: {
            size: 11,
          },
          cornerRadius: 6,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return `${context.parsed.y}`;
            }
          }
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#f3f4f6',
            drawBorder: false,
          },
          ticks: {
            font: {
              size: 10,
            },
            color: '#6b7280',
          },
        },
        x: {
          grid: {
            display: false,
            drawBorder: false,
          },
          ticks: {
            font: {
              size: 10,
            },
            color: '#6b7280',
          },
        },
      },
    };

    // Small delay to ensure canvas is ready (handles React 19 strict mode)
    const timeoutId = setTimeout(() => {
      if (chartRef.current && !chartInstanceRef.current) {
        chartInstanceRef.current = new ChartJS(chartRef.current, {
          type: 'bar',
          data: chartData,
          options: options,
        });
      }
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [data, title, dataKey, nameKey, color]);

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
        <div className="text-center text-gray-500 py-8">No data available</div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <div style={{ height: '200px', position: 'relative' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
}
