import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';

export default function SimpleTable({ data, columns, title }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter data based on search term
  const filteredData = React.useMemo(() => {
    if (!searchTerm || !data) return data || [];
    
    return data.filter(row => {
      return columns.some(column => {
        const value = row[column.accessorKey];
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns]);

  // Sort filtered data
  const sortedData = React.useMemo(() => {
    if (!sortConfig.key || !filteredData) return filteredData || [];

    return [...filteredData].sort((a, b) => {
      const column = columns.find(col => col.accessorKey === sortConfig.key);
      if (!column) return 0;

      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [filteredData, sortConfig, columns]);

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp className="w-4 h-4 ml-1" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1" />
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        {title && <h3 className="text-lg font-bold text-gray-900">{title}</h3>}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-50">
              {columns.map((column) => (
                <th
                  key={column.accessorKey || column.header}
                  className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider"
                >
                  {column.sortable !== false ? (
                    <button
                      onClick={() => handleSort(column.accessorKey)}
                      className="flex items-center hover:text-gray-900 transition-colors"
                    >
                      {column.header}
                      {getSortIcon(column.accessorKey)}
                    </button>
                  ) : (
                    column.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                  {searchTerm ? 'No results found' : 'No data available'}
                </td>
              </tr>
            ) : (
              sortedData.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-indigo-50/30 transition-colors border-b border-gray-100 last:border-0">
                  {columns.map((column) => {
                    const cellValue = row[column.accessorKey];
                    return (
                      <td key={column.accessorKey || column.header} className="px-4 py-4 text-sm text-gray-900">
                        {column.cell
                          ? column.cell({ getValue: () => cellValue, row: { original: row } })
                          : cellValue}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {searchTerm && (
        <div className="mt-4 text-sm text-gray-500">
          Showing {sortedData.length} of {data?.length || 0} results
        </div>
      )}
    </div>
  );
}
