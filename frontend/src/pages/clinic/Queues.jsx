import React, { useState, useMemo } from 'react';
import SimpleTable from '../../components/admin/dashboard/SimpleTable';
import DashboardLayout from '../../layouts/DashboardLayout';

const Queues = () => {

  const clinicData = {
    id: 'CLIN-789123',
    name: 'City Medical Center',
    email: 'admin@citymedical.com',
    phone: '+1 (555) 123-4567'
  };

  const [queueData, setQueueData] = useState({
    activePatients: 12,
    avgWaitTime: 18,
    doctorsAvailable: 5,
    isQueuePaused: false,
    todayPatients: 24
  });

  const [currentQueue, setCurrentQueue] = useState([
    { id: 1, name: 'Sandra Andrews', visitTime: '8:04 pm', visitDuration: '15 min', status: 'waiting' },
    { id: 2, name: 'Kurt Cadowell', visitTime: '8:20 pm', visitDuration: '12 min', status: 'waiting' },
    { id: 3, name: 'Javi Elizandro', visitTime: '8:35 pm', visitDuration: '17 min', status: 'in-progress' },
    { id: 4, name: 'Maria Rodriguez', visitTime: '9:15 pm', visitDuration: '20 min', status: 'in-progress' },
    { id: 5, name: 'David Thompson', visitTime: '9:45 pm', visitDuration: '14 min', status: 'waiting' }
  ]);

  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const queueStats = [
    { 
      name: 'Active Patients', 
      value: queueData.activePatients, 
      change: '+3', 
      color: '#FF6B6B' 
    },
    { 
      name: 'Avg Wait Time', 
      value: queueData.avgWaitTime, 
      change: '-5m', 
      color: '#4ECDC4' 
    },
    { 
      name: 'Doctors Available', 
      value: queueData.doctorsAvailable, 
      change: '+2', 
      color: '#45B7D1' 
    }
  ];

  const stats = [
    { title: 'Total visits', value: '156', trend: 'More than yesterday' },
    { title: 'Average visit time', value: '2 min', trend: 'Less than yesterday' },
    { title: 'Average user age', value: '42', trend: 'Older than yesterday' },
    { title: 'Cancelled visits', value: '8', trend: 'Less than yesterday' }
  ];

  const conditions = ['Asthma', 'Hypertension', 'Diabetes', 'Arthritis', 'Migraine', 'Allergies'];

  const queueTableColumns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Patient Name',
        cell: ({ getValue }) => (
          <span className="font-medium text-gray-900">{getValue()}</span>
        ),
      },
      {
        accessorKey: 'visitTime',
        header: 'Wait Time',
        cell: ({ getValue }) => (
          <span className="text-gray-600">{getValue()}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
          const status = getValue();
          const isWaiting = status === 'waiting';
          return (
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                isWaiting
                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
              }`}
            >
              {isWaiting ? 'Waiting' : 'In Progress'}
            </span>
          );
        },
      },
    ],
    []
  );

  const callNextPatient = () => {
    if (queueData.isQueuePaused) {
      showNotification('Queue is currently paused. Please resume the queue first.', 'warning');
      return;
    }

    const nextWaitingPatient = currentQueue.find(patient => patient.status === 'waiting');
    if (!nextWaitingPatient) {
      showNotification('No patients waiting in queue.', 'warning');
      return;
    }

    setCurrentQueue(prev => 
      prev.map(patient => 
        patient.id === nextWaitingPatient.id 
          ? { ...patient, status: 'in-progress' }
          : patient
      )
    );
    
    setQueueData(prev => ({
      ...prev,
      activePatients: Math.max(0, prev.activePatients - 1)
    }));

    showNotification(`Calling next patient: ${nextWaitingPatient.name}`, 'success');
  };

  const togglePauseQueue = () => {
    const newPausedState = !queueData.isQueuePaused;
    setQueueData(prev => ({
      ...prev,
      isQueuePaused: newPausedState
    }));
    showNotification(`Queue ${newPausedState ? 'paused' : 'resumed'}`, newPausedState ? 'warning' : 'success');
  };

  const viewWaitingList = () => {
    const waitingPatients = currentQueue.filter(patient => patient.status === 'waiting');
    if (waitingPatients.length === 0) {
      showNotification('No patients currently waiting.', 'info');
    } else {
      const patientList = waitingPatients.map(p => `${p.name} (${p.visitTime})`).join(', ');
      showNotification(`Waiting: ${patientList}`, 'info');
    }
  };

  const manageAppointments = () => {
    showNotification('Opening appointment management system...', 'info');
  };

  const refreshQueue = () => {
    setQueueData(prev => ({
      ...prev,
      activePatients: Math.max(3, prev.activePatients + Math.floor(Math.random() * 3) - 1),
      avgWaitTime: Math.max(10, prev.avgWaitTime + Math.floor(Math.random() * 5) - 2)
    }));
    showNotification('Queue data refreshed!', 'success');
  };

  const addNewPatient = () => {
    const names = ['Lisa Anderson', 'James Wilson', 'Emma Thompson', 'Robert Garcia'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const hours = ['7', '8', '9', '10'];
    const minutes = ['00', '15', '30', '45'];
    const randomTime = `${hours[Math.floor(Math.random() * hours.length)]}:${minutes[Math.floor(Math.random() * minutes.length)]} ${Math.random() > 0.5 ? 'am' : 'pm'}`;
    
    const newPatient = {
      id: Date.now(),
      name: randomName,
      visitTime: randomTime,
      visitDuration: `${Math.floor(Math.random() * 20) + 10} min`,
      status: 'waiting'
    };

    setCurrentQueue(prev => [...prev, newPatient]);
    setQueueData(prev => ({
      ...prev,
      activePatients: prev.activePatients + 1,
      todayPatients: prev.todayPatients + 1
    }));
    showNotification(`Added patient: ${randomName}`, 'success');
  };

  return (
    <DashboardLayout>
      <div className="dashboard">
      {/* Notification Popup */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-message">{notification.message}</span>
            <button 
              className="notification-close"
              onClick={() => setNotification({ show: false, message: '', type: '' })}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          <div className="clinic-info">
            <h1>Queue Management</h1>
            <div className="clinic-details">
              <span className="clinic-id">{clinicData.id}</span>
              <span className="clinic-email">{clinicData.email}</span>
              <span className="clinic-phone">{clinicData.phone}</span>
            </div>
          </div>
          <div className="user-profile">
            <div className="user-avatar">AZ</div>
            <span className="user-status">Available for work</span>
          </div>
        </div>
      </header>

      <div className="content-area">
          {/* Queue Metrics Cards */}
          <div className="metrics-grid">
            {queueStats.map((stat, index) => (
              <div key={stat.name} className={`metric-card ${index === 0 ? 'primary' : index === 1 ? 'success' : 'info'}`}>
                <div className="metric-icon">👥</div>
                <div className="metric-content">
                  <div className="metric-value dark-text">{stat.value}{stat.name === 'Avg Wait Time' ? 'm' : ''}</div>
                  <div className="metric-label dark-text">{stat.name}</div>
                  <div className={`metric-change ${stat.change.includes('+') ? 'positive' : 'negative'}`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="queues-content">
            {/* Left Column - Stats and Current Queue */}
            <div className="queues-left">
              {/* Stats Grid */}
              <div className="stats-grid">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-card">
                    <h3 className="stat-title">{stat.title}</h3>
                    <p className="stat-value-large">{stat.value}</p>
                    <p className="stat-trend">{stat.trend}</p>
                  </div>
                ))}
              </div>

              {/* Current Queue Table */}
              <div className="table-card">
                <h3 className="table-title mb-4">Current Queue</h3>
                <SimpleTable
                  data={currentQueue}
                  columns={queueTableColumns}
                  title={null}
                />
              </div>
            </div>

            {/* Right Column - Queue Actions and Common Conditions */}
            <div className="queues-right">
              {/* Queue Actions */}
              <div className="action-card">
                <h3 className="action-title">Queue Actions</h3>
                <div className="action-buttons">
                  <button 
                    onClick={callNextPatient}
                    className="btn btn-primary full-width"
                    disabled={queueData.isQueuePaused}
                  >
                    📞 Call Next Patient
                  </button>
                  <button 
                    onClick={togglePauseQueue}
                    className={`btn full-width ${queueData.isQueuePaused ? 'btn-warning' : 'btn-secondary'}`}
                  >
                    {queueData.isQueuePaused ? '▶️ Resume Queue' : '⏸️ Pause Queue'}
                  </button>
                  <button 
                    onClick={viewWaitingList}
                    className="btn btn-secondary full-width"
                  >
                    📋 View Waiting List
                  </button>
                  <button 
                    onClick={manageAppointments}
                    className="btn btn-secondary full-width"
                  >
                    📅 Manage Appointments
                  </button>
                  <button 
                    onClick={refreshQueue}
                    className="btn btn-secondary full-width"
                  >
                    🔄 Refresh Queue
                  </button>
                  <button 
                    onClick={addNewPatient}
                    className="btn btn-success full-width"
                  >
                    👤 Add Test Patient
                  </button>
                </div>
              </div>

              {/* Common Conditions */}
              <div className="status-card">
                <h3 className="status-title">Common Conditions</h3>
                <div className="conditions-grid">
                  {conditions.map((condition, index) => (
                    <span key={index} className="condition-tag">
                      {condition}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="stats-card">
                <h3 className="stats-title">Quick Stats</h3>
                <div className="quick-stats">
                  <div className="quick-stat">
                    <span className="stat-label">Today's Patients</span>
                    <span className="stat-value">{queueData.todayPatients}</span>
                  </div>
                  <div className="quick-stat">
                    <span className="stat-label">Avg Wait Time</span>
                    <span className="stat-value">{queueData.avgWaitTime}m</span>
                  </div>
                  <div className="quick-stat">
                    <span className="stat-label">Doctors Online</span>
                    <span className="stat-value">5/8</span>
                  </div>
                  <div className="quick-stat">
                    <span className="stat-label">Queue Status</span>
                    <span className={`stat-value ${queueData.isQueuePaused ? 'status-paused' : 'status-active'}`}>
                      {queueData.isQueuePaused ? '⏸️ Paused' : '▶️ Active'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>


      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
          font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          position: relative;
        }
        
        /* Notification Styles */
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          min-width: 300px;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          animation: slideIn 0.3s ease-out;
          background: #1a1a1a;
          border: 2px solid;
        }
        
        .notification.success {
          border-color: #27ae60;
        }
        
        .notification.warning {
          border-color: #f39c12;
        }
        
        .notification.info {
          border-color: #3498db;
        }
        
        .notification-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
        }
        
        .notification-message {
          font-weight: 500;
          font-size: 14px;
          flex: 1;
          color: white;
        }
        
        .notification-close {
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
          margin-left: 15px;
          opacity: 0.7;
          transition: opacity 0.2s;
          font-weight: bold;
        }
        
        .notification-close:hover {
          opacity: 1;
        }
        
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        /* HEADER STYLES */
        .header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 20px 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          border-bottom: 2px solid #e0e6ed;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }
        
        .clinic-info h1 {
          color: #2c3e50;
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: 700;
        }
        
        .clinic-details {
          display: flex;
          gap: 20px;
          font-size: 14px;
          color: #7f8c8d;
        }
        
        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(45deg, #3498db, #9b59b6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }
        
        .user-status {
          color: #27ae60;
          font-weight: 500;
        }
        
        .main-content {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 0;
          max-width: 1400px;
          margin: 0 auto;
          padding: 30px;
        }
        
        .sidebar {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 20px 0 0 20px;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid #e0e6ed;
        }
        
        /* NAVIGATION TABS STYLES */
        .nav-tabs h3 {
          color: #7f8c8d;
          font-size: 12px;
          text-transform: uppercase;
          margin-bottom: 20px;
          letter-spacing: 1px;
        }
        
        .tabs-container {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .tab-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 20px;
          border: none;
          border-radius: 12px;
          background: #f8f9fa;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          text-align: left;
          border: 1px solid transparent;
        }
        
        .tab-button:hover {
          background: #e3f2fd;
          transform: translateX(5px);
          border-color: #3498db;
        }
        
        .tab-button.active {
          background: linear-gradient(45deg, #3498db, #2980b9);
          color: white;
          box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
          border-color: #2980b9;
        }
        
        .tab-icon {
          font-size: 20px;
        }
        
        .tab-label {
          font-weight: 600;
          font-size: 14px;
        }
        
        .stats-section {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e0e6ed;
        }
        
        .stats-section h3 {
          color: #2c3e50;
          margin-bottom: 20px;
          font-size: 16px;
        }
        
        .visit-stats {
          background: #f8f9fa;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid #e0e6ed;
        }
        
        .overall-stat {
          text-align: center;
          margin-bottom: 20px;
          padding: 15px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border: 1px solid #e0e6ed;
        }
        
        .overall-stat .stat-value {
          font-size: 32px;
          font-weight: 700;
          color: #3498db;
        }
        
        .department-stat {
          margin: 15px 0;
        }
        
        .stat-bar {
          width: 100%;
          height: 8px;
          background: #e0e6ed;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 8px;
          border: 1px solid #d0d7de;
        }
        
        .stat-progress {
          height: 100%;
          border-radius: 10px;
          transition: width 0.3s ease;
        }
        
        .stat-text {
          font-size: 12px;
          color: #7f8c8d;
          font-weight: 500;
        }
        
        .content-area {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 0 20px 20px 0;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          border: 1px solid #e0e6ed;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .metric-card {
          padding: 24px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 15px;
          border: 1px solid #e0e7ff;
          background: linear-gradient(135deg, #eef2ff, #e0e7ff);
          box-shadow: 0 6px 18px rgba(79, 70, 229, 0.08);
        }
        
        .metric-icon {
          font-size: 32px;
        }
        
        .metric-value {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 5px;
          color: #111827;
        }
        
        .metric-label {
          font-size: 14px;
          font-weight: 600;
          color: #4b5563;
        }
        
        .metric-change {
          font-size: 12px;
          font-weight: 600;
          margin-top: 5px;
        }
        
        .metric-change.positive {
          color: #27ae60;
        }
        
        .metric-change.negative {
          color: #e74c3c;
        }
        
        /* FIXED TEXT COLOR */
        .dark-text {
          color: #2c3e50 !important;
        }
        
        .queues-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 30px;
        }
        
        .queues-left {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .queues-right {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        
        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          border: 1px solid #e0e6ed;
        }
        
        .stat-title {
          color: #7f8c8d;
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 8px 0;
        }
        
        .stat-value-large {
          color: #2c3e50;
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 4px 0;
        }
        
        .stat-trend {
          color: #7f8c8d;
          font-size: 12px;
          margin: 0;
        }
        
        .table-card, .action-card, .status-card, .stats-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
          border: 1px solid #e0e6ed;
        }
        
        .table-title, .action-title, .status-title, .stats-title {
          color: #2c3e50;
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 15px 0;
        }
        
        .visits-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .visits-table th {
          text-align: left;
          padding: 12px 0;
          border-bottom: 2px solid #e0e6ed;
          color: #7f8c8d;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .visits-table td {
          padding: 14px 0;
          border-bottom: 1px solid #f8f9fa;
          font-size: 14px;
        }
        
        .patient-name {
          color: #2c3e50;
          font-weight: 600;
        }
        
        .visit-time {
          color: #7f8c8d;
        }
        
        .status-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          border: 1px solid;
        }
        
        .status-badge.waiting {
          background: #fff3cd;
          color: #856404;
          border-color: #ffeaa7;
        }
        
        .status-badge.in-progress {
          background: #d4edda;
          color: #155724;
          border-color: #c3e6cb;
        }
        
        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .btn {
          padding: 12px 16px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          text-align: center;
          border: 1px solid transparent;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #4338ca, #4f46e5);
          color: white;
          border-color: #4338ca;
        }
        
        .btn-secondary {
          background: #1f2937;
          color: white;
          border-color: #111827;
        }
        
        .btn-warning {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          border-color: #d97706;
        }
        
        .btn-success {
          background: linear-gradient(135deg, #059669, #10b981);
          color: white;
          border-color: #059669;
        }
        
        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }
        
        .btn:disabled:hover {
          transform: none !important;
          box-shadow: none !important;
        }
        
        .full-width {
          width: 100%;
        }
        
        .conditions-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .condition-tag {
          background: #eef2ff;
          color: #4338ca;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid #c7d2fe;
        }
        
        .quick-stats {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .quick-stat {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f8f9fa;
        }
        
        .quick-stat:last-child {
          border-bottom: none;
        }
        
        .stat-label {
          color: #7f8c8d;
          font-size: 14px;
        }
        
        .stat-value {
          color: #2c3e50;
          font-size: 16px;
          font-weight: 600;
        }
        
        .status-paused {
          color: #e74c3c;
          font-weight: 600;
        }
        
        .status-active {
          color: #27ae60;
          font-weight: 600;
        }
      `}</style>
      </div>
    </DashboardLayout>
  );
};

export default Queues;