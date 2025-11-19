import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ClinicDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const clinicData = {
    id: 'CLIN-789123',
    name: 'City Medical Center',
    email: 'admin@citymedical.com',
    phone: '+1 (555) 123-4567'
  };

  const tabs = [
    { id: 'dashboard', path: '/clinic/dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'queues', path: '/clinic/queues', label: 'Queues', icon: '👥' },
    { id: 'doctors', path: '/clinic/doctors', label: 'Doctors', icon: '👨‍⚕️' },
    { id: 'reports', path: '/clinic/reports', label: 'Reports', icon: '📈' },
    { id: 'activity', path: '/clinic/activity', label: 'Recent Activity', icon: '🔄' }
  ];

  const getActiveTab = () => {
    const currentPath = location.pathname;
    const activeTab = tabs.find(tab => currentPath.startsWith(tab.path));
    return activeTab?.id || 'dashboard';
  };

  const handleTabClick = (tabPath) => {
    navigate(tabPath);
  };

  // NEW: State management for interactive queue
  const [queueData, setQueueData] = useState({
    activeQueues: 1,
    ticketsServed: 8,
    patientsWaiting: 2,
    avgWaitTime: 18
  });

  const [currentQueue, setCurrentQueue] = useState([
    { id: 1, name: 'John Smith', ticketNumber: 'A-101', phone: '+1234567890', time: '09:30 AM', status: 'called' },
    { id: 2, name: 'Sarah Johnson', ticketNumber: 'A-102', phone: '+1234567891', time: '09:45 AM', status: 'waiting' },
    { id: 3, name: 'Michael Brown', ticketNumber: 'A-103', phone: '+1234567892', time: '10:00 AM', status: 'waiting' }
  ]);

  // NEW: Interactive functions
  const callNextPatient = () => {
    if (currentQueue.length === 0) return;

    const nextPatient = currentQueue.find(patient => patient.status === 'waiting');
    if (!nextPatient) return;

    setCurrentQueue(prev => 
      prev.map(patient => 
        patient.id === nextPatient.id 
          ? { ...patient, status: 'called' }
          : patient
      )
    );
  };

  const markAsServed = (patientId) => {
    setCurrentQueue(prev => prev.filter(patient => patient.id !== patientId));
    setQueueData(prev => ({
      ...prev,
      ticketsServed: prev.ticketsServed + 1,
      patientsWaiting: Math.max(0, prev.patientsWaiting - 1)
    }));
  };

  const addNewPatient = () => {
    const names = ['Emily Davis', 'Robert Wilson', 'Lisa Anderson', 'David Miller'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const newTicketNumber = `A-${Math.floor(Math.random() * 90) + 10}`;
    const newPhone = `+1${Math.floor(Math.random() * 900000000) + 100000000}`;
    
    const newPatient = {
      id: Date.now(),
      name: randomName,
      ticketNumber: newTicketNumber,
      phone: newPhone,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'waiting'
    };

    setCurrentQueue(prev => [...prev, newPatient]);
    setQueueData(prev => ({
      ...prev,
      patientsWaiting: prev.patientsWaiting + 1
    }));
  };

  // NEW: Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setQueueData(prev => ({
        ...prev,
        avgWaitTime: Math.max(5, prev.avgWaitTime + Math.floor(Math.random() * 3) - 1)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // NEW: Update waiting count when queue changes
  useEffect(() => {
    const waitingCount = currentQueue.filter(patient => patient.status === 'waiting').length;
    setQueueData(prev => ({
      ...prev,
      patientsWaiting: waitingCount
    }));
  }, [currentQueue]);

  const departmentStats = [
    { name: 'Cardiology', visits: 40, color: '#FF6B6B' },
    { name: 'Neurology', visits: 40, color: '#4ECDC4' },
    { name: 'Dermatology', visits: 200, color: '#45B7D1' },
    { name: 'Gynecology', visits: 85, color: '#FFA07A' },
    { name: 'Urology', visits: 60, color: '#98D8C8' }
  ];

  const employeeData = [
    { department: 'Emergency', percentage: 50, count: 250 },
    { department: 'Neurology', percentage: 70, count: 350 },
    { department: 'Cardiology', percentage: 65, count: 325 },
    { department: 'Gynecology', percentage: 80, count: 400 },
    { department: 'Urology', percentage: 45, count: 225 }
  ];

  // NEW: Dynamic metrics data
  const metricsData = [
    { 
      type: 'primary',
      icon: '🏥',
      value: queueData.activeQueues,
      label: 'Active Queues',
      darkText: true
    },
    { 
      type: 'success',
      icon: '✅',
      value: queueData.ticketsServed,
      label: 'Tickets Served',
      darkText: true
    },
    { 
      type: 'warning',
      icon: '⏳',
      value: queueData.patientsWaiting,
      label: 'Patients Waiting',
      darkText: true
    },
    { 
      type: 'info',
      icon: '⏰',
      value: queueData.avgWaitTime,
      label: 'Avg Wait Time',
      suffix: 'm',
      darkText: true
    }
  ];

  return (
    <div className="dashboard">
      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          <div className="clinic-info">
            <h1>Viora Medical Dashboard</h1>
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

      {/* Main Content Grid */}
      <div className="main-content">
        {/* Sidebar Navigation - REPLACED MAIN MENU */}
        <aside className="sidebar">
          {/* Navigation Tabs - New Design */}
          <nav className="nav-tabs">
            <h3>NAVIGATION</h3>
            <div className="tabs-container">
              {tabs.map((tab) => {
                const isActive = getActiveTab() === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.path)}
                    className={`tab-button ${isActive ? 'active' : ''}`}
                  >
                    <span className="tab-icon">{tab.icon}</span>
                    <span className="tab-label">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Patient Visit Stats */}
          <div className="stats-section">
            <h3>Patient Visit By Department</h3>
            <div className="visit-stats">
              <div className="overall-stat">
                <div className="stat-value">70%</div>
                <div className="stat-label">Overall</div>
              </div>
              {departmentStats.map(dept => (
                <div key={dept.name} className="department-stat">
                  <div className="stat-bar">
                    <div 
                      className="stat-progress" 
                      style={{
                        width: `${Math.min(dept.visits, 100)}%`,
                        backgroundColor: dept.color
                      }}
                    ></div>
                  </div>
                  <span className="stat-text">{dept.name} {dept.visits}%</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Dashboard Content */}
        <main className="content-area">
          {/* Metrics Cards - NOW INTERACTIVE */}
          <div className="metrics-grid">
            {metricsData.map((metric, index) => (
              <div key={metric.label} className={`metric-card ${metric.type}`}>
                <div className="metric-icon">{metric.icon}</div>
                <div className="metric-content">
                  <div className="metric-value dark-text">
                    {metric.value}{metric.suffix || ''}
                  </div>
                  <div className="metric-label dark-text">{metric.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Employee Statistics */}
          <div className="employee-section">
            <h2>Employee Distribution</h2>
            <div className="employee-cards">
              {employeeData.map(emp => (
                <div key={emp.department} className="employee-card">
                  <div className="employee-header">
                    <h4>{emp.department}</h4>
                    <span className="percentage">{emp.percentage}%</span>
                  </div>
                  <div className="employee-progress">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${emp.percentage}%` }}
                    ></div>
                  </div>
                  <div className="employee-count">{emp.count} employees</div>
                </div>
              ))}
            </div>
          </div>

          {/* Queue Management Section - NOW INTERACTIVE */}
          <section className="queue-section">
            <div className="section-header">
              <h2>Queue Management</h2>
              <div className="subtitle">Manage today's patient queue</div>
              {/* NEW: Queue controls */}
              <div className="queue-controls">
                <button 
                  onClick={addNewPatient}
                  className="btn btn-secondary"
                >
                  + Add Patient
                </button>
                <button 
                  onClick={callNextPatient}
                  className="btn btn-primary"
                  disabled={!currentQueue.some(patient => patient.status === 'waiting')}
                >
                  📞 Call Next Patient
                </button>
              </div>
            </div>
            
            <div className="queue-table">
              <table>
                <thead>
                  <tr>
                    <th>Ticket No.</th>
                    <th>Patient Name</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentQueue.map((patient) => (
                    <tr key={patient.id}>
                      <td className="ticket-number">{patient.ticketNumber}</td>
                      <td className="patient-name">
                        <div className="avatar-small">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        {patient.name}
                      </td>
                      <td>{patient.phone}</td>
                      <td>
                        <span className={`status-badge ${patient.status}`}>
                          {patient.status === 'called' ? 'Called' : 'Waiting'}
                        </span>
                      </td>
                      <td>{patient.time}</td>
                      <td>
                        {patient.status === 'called' ? (
                          <button 
                            className="btn btn-primary"
                            onClick={() => markAsServed(patient.id)}
                          >
                            Served
                          </button>
                        ) : (
                          <button className="btn btn-secondary" disabled>
                            Call Next
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {currentQueue.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <div className="empty-queue">
                          <p>No patients in queue</p>
                          <button 
                            onClick={addNewPatient}
                            className="btn btn-secondary"
                          >
                            Add First Patient
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 20px 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
        }
        
        /* NEW NAVIGATION TABS STYLES */
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
        }
        
        .tab-button:hover {
          background: #e3f2fd;
          transform: translateX(5px);
        }
        
        .tab-button.active {
          background: linear-gradient(45deg, #3498db, #2980b9);
          color: white;
          box-shadow: 0 4px 15px rgba(52, 152, 219, 0.3);
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
        }
        
        .overall-stat {
          text-align: center;
          margin-bottom: 20px;
          padding: 15px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
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
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .metric-card {
          padding: 25px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }
        
        .metric-card.primary {
          background: linear-gradient(135deg, #a8e6cf, #88d3a0);
        }
        
        .metric-card.success {
          background: linear-gradient(135deg, #ffd3b6, #ffaaa5);
        }
        
        .metric-card.warning {
          background: linear-gradient(135deg, #ff8b94, #ff6b6b);
        }
        
        .metric-card.info {
          background: linear-gradient(135deg, #a0c4ff, #74b9ff);
        }
        
        .metric-icon {
          font-size: 32px;
        }
        
        .metric-value {
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 5px;
        }
        
        .metric-label {
          font-size: 14px;
        }
        
        /* FIXED TEXT COLOR - Added dark text class */
        .dark-text {
          color: #2c3e50 !important;
        }
        
        .employee-section {
          margin-bottom: 40px;
        }
        
        .employee-section h2 {
          color: #2c3e50;
          margin-bottom: 20px;
          font-size: 22px;
        }
        
        .employee-cards {
          display: grid;
          gap: 15px;
        }
        
        .employee-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          border-left: 4px solid #3498db;
        }
        
        .employee-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        
        .employee-header h4 {
          margin: 0;
          color: #2c3e50;
          font-size: 16px;
        }
        
        .percentage {
          color: #3498db;
          font-weight: 700;
          font-size: 18px;
        }
        
        .employee-progress {
          width: 100%;
          height: 8px;
          background: #e0e6ed;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 8px;
        }
        
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #3498db, #9b59b6);
          border-radius: 10px;
          transition: width 0.3s ease;
        }
        
        .employee-count {
          font-size: 12px;
          color: #7f8c8d;
        }
        
        .queue-section {
          margin-top: 30px;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .section-header h2 {
          color: #2c3e50;
          margin-bottom: 8px;
          font-size: 24px;
        }
        
        .subtitle {
          color: #7f8c8d;
          font-size: 14px;
        }
        
        /* NEW: Queue controls */
        .queue-controls {
          display: flex;
          gap: 10px;
          justify-content: center;
          margin-top: 15px;
        }
        
        .queue-table {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
        }
        
        th {
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
          padding: 18px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
        }
        
        td {
          padding: 18px;
          border-bottom: 1px solid #f1f3f4;
          color: #2c3e50;
        }
        
        tr:hover {
          background: #f8f9fa;
        }
        
        .ticket-number {
          font-weight: 700;
          color: #3498db;
        }
        
        .patient-name {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
        }
        
        .avatar-small {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #e3f2fd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          color: #3498db;
        }
        
        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .status-badge.called {
          background: #d4edda;
          color: #155724;
        }
        
        .status-badge.waiting {
          background: #fff3cd;
          color: #856404;
        }
        
        .btn {
          padding: 10px 20px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
        }
        
        .btn-secondary {
          background: linear-gradient(135deg, #95a5a6, #7f8c8d);
          color: white;
        }
        
        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        /* NEW: Empty queue state */
        .empty-queue {
          text-align: center;
          padding: 40px;
          color: #7f8c8d;
        }
        
        .text-center {
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default ClinicDashboard;