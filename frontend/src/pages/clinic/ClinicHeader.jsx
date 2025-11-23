import React from 'react';

const ClinicHeader = ({ clinicData, activeTab, setActiveTab }) => {
  // Default data in case props aren't passed
  const data = clinicData || {
    name: "City Medical Center",
    id: "CLIN-789123", 
    phone: "+1 (555) 123-4567",
    email: "admin@citymedical.com"
  };

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'doctors', name: 'Doctors', icon: '👨‍⚕️' },
    { id: 'queue', name: 'Queue', icon: '📋' },
    { id: 'profile', name: 'Profile', icon: '🏥' },
    { id: 'reports', name: 'Reports', icon: '📈' },
    { id: 'settings', name: 'Settings', icon: '⚙️' }
  ];

  return (
    <header className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="flex flex-col items-center py-6 text-center">
          {/* Clinic Logo and Name */}
          <div className="mb-4">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">🏥</span>
            </div>
            <h1 className="text-3xl font-bold text-white">{data.name}</h1>
          </div>
          
          {/* Clinic Info */}
          <div className="flex flex-wrap justify-center gap-4 mb-4 text-sm">
            <div className="bg-indigo-500 px-3 py-1 rounded-full">
              ID: <span className="font-mono">{data.id}</span>
            </div>
            <div className="flex items-center gap-1">
              📞 {data.phone}
            </div>
            <div className="flex items-center gap-1">
              ✉️ {data.email}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 bg-indigo-500 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-semibold">Online & Active</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex justify-center pb-4">
          <div className="flex gap-1 bg-white/20 p-1 rounded-xl">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab && setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === item.id
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'text-white hover:bg-white/20'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default ClinicHeader;