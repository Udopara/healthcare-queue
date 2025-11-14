import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RecentActivity = () => {
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

  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [activities, setActivities] = useState([
    {
      id: 1,
      user: 'Dr. Sarah Johnson',
      action: 'completed patient consultation',
      time: '2 minutes ago',
      type: 'success',
      avatar: 'SJ'
    },
    {
      id: 2,
      user: 'Dr. Michael Chen',
      action: 'added new patient records',
      time: '5 minutes ago',
      type: 'info',
      avatar: 'MC'
    },
    {
      id: 3,
      user: 'Nurse Emily Davis',
      action: 'updated medication schedule',
      time: '12 minutes ago',
      type: 'warning',
      avatar: 'ED'
    },
    {
      id: 4,
      user: 'Dr. James Wilson',
      action: 'started new treatment plan',
      time: '25 minutes ago',
      type: 'success',
      avatar: 'JW'
    },
    {
      id: 5,
      user: 'Admin Staff',
      action: 'processed insurance claims',
      time: '1 hour ago',
      type: 'info',
      avatar: 'AS'
    },
    {
      id: 6,
      user: 'Dr. Lisa Brown',
      action: 'conducted follow-up check',
      time: '2 hours ago',
      type: 'success',
      avatar: 'LB'
    }
  ]);

  const [activityStats, setActivityStats] = useState([
    { period: 'Today', activities: 24, change: '+8' },
    { period: 'This Week', activities: 156, change: '+42' },
    { period: 'This Month', activities: 589, change: '+127' }
  ]);

  const activityMetrics = [
    { name: 'Tasks Completed', value: 42, change: '+40%', color: '#4ECDC4' },
    { name: 'Active Projects', value: 8, change: '+85%', color: '#45B7D1' },
    { name: 'Team Efficiency', value: 92, change: '+60%', color: '#FF6B6B' }
  ];

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  const refreshFeed = () => {
    // Add a new activity to simulate refresh
    const newActivities = [
      {
        id: Date.now(),
        user: 'System',
        action: 'Activity feed refreshed',
        time: 'Just now',
        type: 'info',
        avatar: 'SYS'
      },
      ...activities.slice(0, 5) // Keep only the first 5 activities
    ];
    
    setActivities(newActivities);
    
    // Update stats with random increases
    setActivityStats(prev => prev.map(stat => ({
      ...stat,
      activities: stat.activities + Math.floor(Math.random() * 3) + 1,
      change: `+${Math.floor(Math.random() * 5) + 1}`
    })));
    
    showNotification('Activity feed refreshed successfully!', 'success');
  };

  const exportLogs = () => {
    // Simulate export functionality
    const logData = activities.map(activity => 
      `${activity.time} - ${activity.user} ${activity.action}`
    ).join('\n');
    
    // Create a blob and download link
    const blob = new Blob([logData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity-logs-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('Activity logs exported successfully!', 'success');
  };

  const filterActivities = () => {
    // Toggle between showing all activities and only today's activities
    const now = new Date();
    const filteredActivities = activities.filter(activity => {
      if (activity.time.includes('hour') || activity.time.includes('minutes')) {
        return true;
      }
      return false;
    });
    
    if (activities.length === filteredActivities.length) {
      // If already filtered, show all
      setActivities(activities);
      showNotification('Showing all activities', 'info');
    } else {
      // Filter to recent activities only
      setActivities(filteredActivities);
      showNotification('Filtered to show recent activities only', 'info');
    }
  };

  const clearAllActivities = () => {
    if (activities.length === 0) {
      showNotification('No activities to clear', 'warning');
      return;
    }
    
    setActivities([]);
    setActivityStats(prev => prev.map(stat => ({
      ...stat,
      activities: 0,
      change: '+0'
    })));
    showNotification('All activities cleared', 'info');
  };

  const addSampleActivity = () => {
    const users = ['Dr. Alex Morgan', 'Nurse Sarah Kim', 'Dr. Robert Taylor', 'Tech Support'];
    const actions = [
      'performed routine checkup',
      'updated patient chart',
      'scheduled appointment',
      'reviewed lab results',
      'prescribed medication'
    ];
    const types = ['success', 'info', 'warning'];
    
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const avatar = randomUser.split(' ').map(n => n[0]).join('').substring(0, 2);
    
    const newActivity = {
      id: Date.now(),
      user: randomUser,
      action: randomAction,
      time: 'Just now',
      type: randomType,
      avatar: avatar
    };
    
    setActivities(prev => [newActivity, ...prev]);
    
    // Update today's count
    setActivityStats(prev => prev.map((stat, index) => 
      index === 0 
        ? { ...stat, activities: stat.activities + 1, change: `+${parseInt(stat.change) + 1}` }
        : stat
    ));
    
    showNotification('Sample activity added', 'success');
  };

  return (
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
            <h1>Recent Activity</h1>
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
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          {/* Navigation Tabs */}
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

          {/* Activity Metrics */}
          <div className="stats-section">
            <h3>Activity Metrics</h3>
            <div className="visit-stats">
              <div className="overall-stat">
                <div className="stat-value">70%</div>
                <div className="stat-label">Team Activity</div>
              </div>
              {activityMetrics.map((metric, index) => (
                <div key={metric.name} className="department-stat">
                  <div className="stat-bar">
                    <div 
                      className="stat-progress" 
                      style={{
                        width: `${Math.min((metric.value / (metric.name === 'Tasks Completed' ? 50 : metric.name === 'Active Projects' ? 10 : 100)) * 100, 100)}%`,
                        backgroundColor: metric.color
                      }}
                    ></div>
                  </div>
                  <span className="stat-text">{metric.name} {metric.change}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="content-area">
          {/* Page Header */}
          <div className="page-header">
            <h2>Recent Activity Timeline</h2>
            <p className="page-subtitle">Track all activities and updates across your clinic</p>
          </div>

          {/* Activity Stats Cards */}
          <div className="metrics-grid">
            {activityStats.map((stat, index) => (
              <div key={stat.period} className={`metric-card ${index === 0 ? 'primary' : index === 1 ? 'success' : 'info'}`}>
                <div className="metric-icon">📊</div>
                <div className="metric-content">
                  <div className="metric-value dark-text">{stat.activities}</div>
                  <div className="metric-label dark-text">{stat.period}</div>
                  <div className="metric-change positive">
                    {stat.change} activities
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Timeline */}
          <div className="activity-section">
            <div className="section-header">
              <h3>Latest Activities</h3>
              <div className="subtitle">Real-time updates from your team</div>
            </div>
            
            <div className="activity-timeline">
              {activities.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h4>No Activities</h4>
                  <p>No activities to display. Add some activities to see them here.</p>
                  <button onClick={addSampleActivity} className="btn btn-primary">
                    Add Sample Activity
                  </button>
                </div>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-avatar">
                      {activity.avatar}
                    </div>
                    <div className="activity-content">
                      <div className="activity-header">
                        <span className="activity-user">{activity.user}</span>
                        <span className="activity-time">{activity.time}</span>
                      </div>
                      <p className="activity-action">{activity.action}</p>
                      <span className={`activity-badge ${activity.type}`}>
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="actions-section">
            <div className="actions-header">
              <h3>Quick Actions</h3>
              <p>Manage your activity feed</p>
            </div>
            <div className="actions-grid">
              <button onClick={refreshFeed} className="btn btn-primary">
                🔄 Refresh Feed
              </button>
              <button onClick={exportLogs} className="btn btn-secondary">
                📧 Export Logs
              </button>
              <button onClick={filterActivities} className="btn btn-secondary">
                ⚙️ Filter Activities
              </button>
              <button onClick={addSampleActivity} className="btn btn-success">
                ➕ Add Sample
              </button>
              <button onClick={clearAllActivities} className="btn btn-warning">
                🗑️ Clear All
              </button>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          position: relative;
        }
        
        /* Notification Styles - FIXED DARKER TEXT */
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1000;
          min-width: 300px;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          animation: slideIn 0.3s ease-out;
          background: white;
          border: 2px solid;
        }
        
        .notification.success {
          border-color: #27ae60;
          background: #d4f4e1;
        }
        
        .notification.warning {
          border-color: #f39c12;
          background: #fef5e7;
        }
        
        .notification.info {
          border-color: #3498db;
          background: #e3f2fd;
        }
        
        .notification-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
        }
        
        .notification-message {
          font-weight: 600;
          font-size: 14px;
          flex: 1;
          color: #2c3e50; /* Dark text color */
        }
        
        .notification.success .notification-message {
          color: #155724; /* Dark green for success */
        }
        
        .notification.warning .notification-message {
          color: #856404; /* Dark yellow for warning */
        }
        
        .notification.info .notification-message {
          color: #0c5460; /* Dark blue for info */
        }
        
        .notification-close {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          margin-left: 15px;
          opacity: 0.7;
          transition: opacity 0.2s;
          color: #2c3e50; /* Dark close button */
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
        
        .page-header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        .page-header h2 {
          color: #2c3e50;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .page-subtitle {
          color: #7f8c8d;
          font-size: 16px;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
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
          font-weight: 600;
        }
        
        .metric-change {
          font-size: 12px;
          font-weight: 600;
          margin-top: 5px;
        }
        
        .metric-change.positive {
          color: #27ae60;
        }
        
        /* FIXED TEXT COLOR */
        .dark-text {
          color: #2c3e50 !important;
        }
        
        .activity-section {
          margin-top: 40px;
        }
        
        .section-header {
          text-align: center;
          margin-bottom: 30px;
        }
        
        .section-header h3 {
          color: #2c3e50;
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .subtitle {
          color: #7f8c8d;
          font-size: 14px;
        }
        
        .activity-timeline {
          background: white;
          border-radius: 16px;
          padding: 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e0e6ed;
          min-height: 200px;
        }
        
        .activity-item {
          display: flex;
          align-items: flex-start;
          padding: 20px;
          border-bottom: 1px solid #f1f3f4;
          transition: background-color 0.3s ease;
        }
        
        .activity-item:hover {
          background: #f8f9fa;
        }
        
        .activity-item:last-child {
          border-bottom: none;
        }
        
        .activity-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3498db, #9b59b6);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 14px;
          margin-right: 15px;
          flex-shrink: 0;
        }
        
        .activity-content {
          flex: 1;
        }
        
        .activity-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 5px;
        }
        
        .activity-user {
          color: #2c3e50;
          font-weight: 600;
          font-size: 14px;
        }
        
        .activity-time {
          color: #7f8c8d;
          font-size: 12px;
        }
        
        .activity-action {
          color: #5a6c7d;
          font-size: 14px;
          margin: 0 0 8px 0;
        }
        
        .activity-badge {
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .activity-badge.success {
          background: #d4edda;
          color: #155724;
        }
        
        .activity-badge.info {
          background: #e3f2fd;
          color: #1976d2;
        }
        
        .activity-badge.warning {
          background: #fff3cd;
          color: #856404;
        }
        
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #7f8c8d;
        }
        
        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }
        
        .empty-state h4 {
          color: #2c3e50;
          margin-bottom: 8px;
          font-size: 18px;
        }
        
        .empty-state p {
          margin-bottom: 20px;
          font-size: 14px;
        }
        
        .actions-section {
          background: #f8f9fa;
          border-radius: 16px;
          padding: 30px;
          text-align: center;
          margin-top: 40px;
        }
        
        .actions-header h3 {
          color: #2c3e50;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .actions-header p {
          color: #7f8c8d;
          margin-bottom: 20px;
        }
        
        .actions-grid {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .btn {
          padding: 10px 16px;
          border-radius: 8px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          white-space: nowrap;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #3498db, #2980b9);
          color: white;
        }
        
        .btn-secondary {
          background: linear-gradient(135deg, #95a5a6, #7f8c8d);
          color: white;
        }
        
        .btn-success {
          background: linear-gradient(135deg, #27ae60, #2ecc71);
          color: white;
        }
        
        .btn-warning {
          background: linear-gradient(135deg, #f39c12, #e67e22);
          color: white;
        }
        
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default RecentActivity;