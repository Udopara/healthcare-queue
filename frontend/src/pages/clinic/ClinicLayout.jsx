import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ClinicLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [clinicData, setClinicData] = React.useState({
    id: 'CLIN-789123',
    name: 'City Medical Center',
    email: 'admin@citymedical.com',
    phone: '+1 (555) 123-4567'
  });

  const tabs = [
    { id: 'dashboard', path: '/clinic/dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'queues', path: '/clinic/queues', label: 'Queues', icon: '👥' },
    { id: 'doctors', path: '/clinic/doctors', label: 'Doctors', icon: '👨‍⚕️' },
    { id: 'reports', path: '/clinic/reports', label: 'Reports', icon: '📈' },
    { id: 'settings', path: '/clinic/settings', label: 'Settings', icon: '⚙️' }
  ];

  const getActiveTab = () => {
    const currentPath = location.pathname;
    const activeTab = tabs.find(tab => currentPath.startsWith(tab.path));
    return activeTab?.id || 'dashboard';
  };

  const handleTabClick = (tabPath) => {
    navigate(tabPath);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Updated White Header with Blue Elements */}
      <header className="bg-white border-b-2 border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Row - Clinic Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4">
            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white text-2xl">🏥</span>
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-blue-900 tracking-tight">{clinicData.name}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-sm text-blue-700 mt-1">
                  <span className="font-semibold">ID: {clinicData.id}</span>
                  <span className="hidden sm:inline text-blue-400">•</span>
                  <span>{clinicData.phone}</span>
                  <span className="hidden sm:inline text-blue-400">•</span>
                  <span>{clinicData.email}</span>
                </div>
              </div>
            </div>
            
            {/* Status Badge */}
            <div className="flex items-center space-x-2 bg-green-50 px-4 py-3 rounded-xl border-2 border-green-200 shadow-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-green-800">Online & Active</span>
            </div>
          </div>

          {/* Enhanced Navigation Tabs */}
          <nav className="flex space-x-3 pb-3 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = getActiveTab() === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.path)}
                  className={`flex items-center space-x-4 px-6 py-4 rounded-2xl text-base font-bold transition-all duration-300 whitespace-nowrap transform hover:scale-105 shadow-lg ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-blue-200'
                      : 'bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 border-2 border-blue-200 hover:from-blue-200 hover:to-blue-100 hover:shadow-blue-300'
                  }`}
                >
                  <span className="text-2xl">{tab.icon}</span>
                  <span className="text-lg">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Clean White Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg">
          {children}
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-blue-50 border-t border-blue-100 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-blue-700">
            <div className="text-center sm:text-left mb-2 sm:mb-0">
              © 2024 City Medical Center - Providing Quality Healthcare
            </div>
            <div className="text-center sm:text-right">
              <span className="flex items-center justify-center sm:justify-end space-x-2">
                <span>🛡️ HIPAA Compliant</span>
                <span>•</span>
                <span>🔒 Secure & Encrypted</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClinicLayout;