import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function KPICard({ title, value, change, changeType, icon: Icon }) {
  const isPositive = changeType === 'increase';
  
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-white opacity-50"></div>
      
      <div className="relative flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{title}</p>
          <p className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            {value}
          </p>
          <div className="flex items-center space-x-1.5">
            <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-full ${
              isPositive ? 'bg-emerald-50' : 'bg-red-50'
            }`}>
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5 text-red-600" />
              )}
              <span className={`text-xs font-bold ${isPositive ? 'text-emerald-700' : 'text-red-700'}`}>
                {change}
              </span>
            </div>
            <span className="text-xs text-gray-400">vs last period</span>
          </div>
        </div>
        <div className="relative bg-indigo-700 rounded-2xl p-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
          {Icon && <Icon className="w-7 h-7 text-white" />}
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-2xl transition-opacity duration-300"></div>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
  );
}

