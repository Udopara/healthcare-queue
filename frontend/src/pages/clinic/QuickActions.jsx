import React from 'react';

const QuickActions = () => {
  const actions = [
    { icon: '👥', label: 'Add Patient', color: 'blue' },
    { icon: '📞', label: 'Call Next', color: 'green' },
    { icon: '📊', label: 'Generate Report', color: 'purple' },
    { icon: '⚙️', label: 'Settings', color: 'gray' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            className={`p-3 rounded-lg text-center transition-all hover:shadow-md ${
              action.color === 'blue' ? 'bg-blue-50 hover:bg-blue-100' :
              action.color === 'green' ? 'bg-green-50 hover:bg-green-100' :
              action.color === 'purple' ? 'bg-purple-50 hover:bg-purple-100' :
              'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <div className="text-2xl mb-1">{action.icon}</div>
            <div className="text-sm font-medium text-gray-700">{action.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;

