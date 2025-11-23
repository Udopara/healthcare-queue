import React from 'react'
import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        placeholder={placeholder}
      />
    </div>
  )
}

