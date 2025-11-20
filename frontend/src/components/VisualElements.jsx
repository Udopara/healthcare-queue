import React from 'react';

export const StatCard = ({ number, label, icon, gradient, trend }) => {
  return (
    <div className=\"bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105\">
      <div className=\"flex items-center justify-between\">
        <div>
          <p className=\"text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent\">
            {number}
          </p>
          <p className=\"text-gray-600 text-sm mt-1\">{label}</p>
          {trend && (
            <p className={\	ext-xs font-semibold mt-2 \\}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}% from last month
            </p>
          )}
        </div>
        <div className={\w-14 h-14 bg-gradient-to-r \ rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg\}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export const FeatureCard = ({ title, description, icon, features }) => {
  return (
    <div className=\"bg-white/70 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300 group\">
      <div className=\"flex items-start space-x-4\">
        <div className=\"w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-300\">
          {icon}
        </div>
        <div className=\"flex-1\">
          <h3 className=\"text-lg font-semibold text-gray-800 mb-2\">{title}</h3>
          <p className=\"text-gray-600 text-sm mb-3\">{description}</p>
          <div className=\"flex flex-wrap gap-2\">
            {features.map((feature, index) => (
              <span key={index} className=\"bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium\">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
