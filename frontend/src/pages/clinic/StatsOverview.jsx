import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ListChecks,
  CheckCircle2,
  Users,
  Clock3,
  Stethoscope
} from 'lucide-react';
import KPICard from '../../components/admin/dashboard/KPICard';

const StatsOverview = ({ clinicData }) => {
  const navigate = useNavigate();
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const stats = [
    { 
      title: 'Active Queues', 
      value: '3', 
      change: '+1', 
      trend: 'up',
      description: 'Doctors with active patients',
      icon: ListChecks
    },
    { 
      title: 'Tickets Served', 
      value: '24', 
      change: '+8', 
      trend: 'up',
      description: 'Today',
      icon: CheckCircle2
    },
    { 
      title: 'Patients Waiting', 
      value: '12', 
      change: '-3', 
      trend: 'down',
      description: 'Across all queues',
      icon: Users
    },
    { 
      title: 'Avg Wait Time', 
      value: '18m', 
      change: '-5m', 
      trend: 'down',
      description: 'Improving',
      icon: Clock3
    },
    { 
      title: 'Doctors Online', 
      value: '5/8', 
      change: '+2', 
      trend: 'up',
      description: 'Currently active',
      icon: Stethoscope
    },
  ];

  // Report types with sample data
  const reportTypes = [
    {
      id: 'monthly',
      title: 'Monthly Patient Visits',
      description: 'Analysis of patient visits and trends',
      data: {
        totalVisits: 156,
        averageVisitTime: '2 min',
        peakHours: '10:00 AM - 12:00 PM',
        popularDepartment: 'Cardiology'
      }
    },
    {
      id: 'revenue',
      title: 'Revenue Analysis', 
      description: 'Financial performance and revenue streams',
      data: {
        totalRevenue: '$45,230',
        revenueGrowth: '+12.5%',
        topService: 'Consultations',
        monthlyTarget: '98% achieved'
      }
    },
    {
      id: 'performance',
      title: 'Doctor Performance',
      description: 'Efficiency and patient satisfaction metrics',
      data: {
        averageRating: '4.8/5',
        patientSatisfaction: '96%',
        avgConsultationTime: '18 min',
        completedAppointments: '89%'
      }
    }
  ];

  // Interactive functions
  const handleViewFullReport = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const handleGenerateReport = (type) => {
    // Navigate to reports page with filter
    navigate('/clinic/reports', { 
      state: { 
        reportType: type,
        autoGenerate: true 
      } 
    });
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'analytics':
        navigate('/clinic/reports');
        break;
      case 'doctors':
        navigate('/clinic/doctors');
        break;
      case 'queues':
        navigate('/clinic/queues');
        break;
      default:
        break;
    }
  };

  return (
    <div>
      {/* Stats Grid - using shared admin KPICard styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((stat) => (
          <KPICard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.trend === 'up' ? 'increase' : 'decrease'}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Report Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {reportTypes.map((report) => (
          <div key={report.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{report.description}</p>
            <div className="space-y-2 mb-4">
              {Object.entries(report.data).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>
                  <span className="font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => handleViewFullReport(report)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                View Full Report
              </button>
              <button
                onClick={() => handleGenerateReport(report.id)}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Generate New
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-6 mb-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quick Actions</h2>
          <p className="text-gray-600">Access frequently used features quickly</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => handleQuickAction('analytics')}
            className="p-6 rounded-xl border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 text-left transition-all hover:shadow-md hover:scale-105 transform duration-200"
          >
            <div className="flex items-start space-x-4">
              <span className="text-3xl">📊</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  View Analytics
                </h3>
                <p className="text-sm text-gray-600">
                  Detailed charts and insights
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleQuickAction('doctors')}
            className="p-6 rounded-xl border-2 border-green-200 bg-green-50 hover:bg-green-100 text-left transition-all hover:shadow-md hover:scale-105 transform duration-200"
          >
            <div className="flex items-start space-x-4">
              <span className="text-3xl">👨‍⚕️</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Manage Doctors
                </h3>
                <p className="text-sm text-gray-600">
                  Doctor schedules and performance
                </p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handleQuickAction('queues')}
            className="p-6 rounded-xl border-2 border-blue-200 bg-blue-50 hover:bg-blue-100 text-left transition-all hover:shadow-md hover:scale-105 transform duration-200"
          >
            <div className="flex items-start space-x-4">
              <span className="text-3xl">👥</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  Queue Management
                </h3>
                <p className="text-sm text-gray-600">
                  Real-time queue monitoring
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold mb-2">Clinic Performance Summary</h3>
            <p className="text-blue-100">All systems operational • {clinicData.operatingHours}</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold">98%</p>
            <p className="text-blue-100 text-sm">Efficiency Rate</p>
          </div>
        </div>
      </div>

      {/* Report Modal */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedReport.title}</h2>
                <button
                  onClick={() => setShowReportModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <p className="text-gray-600 mb-6">{selectedReport.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {Object.entries(selectedReport.data).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 p-4 rounded-lg">
                    <div className="text-sm text-gray-500 capitalize mb-1">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      {value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex">
                  <div className="text-yellow-800 text-sm">
                    <strong>Note:</strong> This is a preview of the report data. 
                    For detailed analysis and historical trends, visit the full reports section.
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => handleGenerateReport(selectedReport.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Generate Full Report
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsOverview;