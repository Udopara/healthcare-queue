import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const ClinicReports = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedReport, setSelectedReport] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

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

  // NEW: Interactive report data
  const reportTypes = [
    {
      id: 'financial',
      title: 'Financial Report',
      period: 'Q4 2024',
      type: 'financial'
    },
    {
      id: 'patient',
      title: 'Patient Analytics', 
      period: 'Monthly',
      type: 'analytics'
    },
    {
      id: 'staff',
      title: 'Staff Performance',
      period: 'Weekly',
      type: 'performance'
    }
  ];

  const sampleReportData = {
    'financial': {
      title: 'Financial Report - Q4 2024',
      metrics: [
        { label: 'Total Revenue', value: '$45,280', change: '+12.5%' },
        { label: 'Growth Rate', value: '+12.5%', change: '+2.1%' },
        { label: 'Avg. per Patient', value: '$36.52', change: '+3.2%' },
        { label: 'Insurance Claims', value: '89%', change: '+1.5%' }
      ],
      description: 'Comprehensive financial performance analysis for Q4 2024'
    },
    'patient': {
      title: 'Patient Analytics Report - Monthly',
      metrics: [
        { label: 'Total Patients', value: '1,240', change: '+8.7%' },
        { label: 'Satisfaction Rate', value: '94%', change: '+3.2%' },
        { label: 'Return Rate', value: '78%', change: '+2.4%' },
        { label: 'New Patients', value: '156', change: '+12.3%' }
      ],
      description: 'Patient engagement and satisfaction metrics analysis'
    },
    'staff': {
      title: 'Staff Performance Report - Weekly',
      metrics: [
        { label: 'Efficiency Rate', value: '92%', change: '+2.8%' },
        { label: 'Appointments Completed', value: '324', change: '+5.1%' },
        { label: 'Avg. Wait Time', value: '18m', change: '-2m' },
        { label: 'Patient Satisfaction', value: '96%', change: '+1.2%' }
      ],
      description: 'Staff performance and operational efficiency metrics'
    }
  };

  // NEW: Interactive functions
  const handleViewFullReport = (reportId) => {
    setSelectedReport(reportId);
    setIsGenerating(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsGenerating(false);
    }, 1500);
  };

  const handleExportReport = (format, reportId) => {
    const report = sampleReportData[reportId];
    if (!report) return;
    
    // Show alert for the export
    alert(`${format.toUpperCase()} report for "${report.title}" is being prepared for download!`);
    
    // Simulate download after a short delay
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#';
      link.download = `${reportId}-${format}-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1000);
  };

  const closeReportPreview = () => {
    setSelectedReport(null);
  };

  const reportStats = [
    { name: 'Monthly Revenue', value: '$45,280', change: '+12.5%', trend: 'up', color: '#4ECDC4' },
    { name: 'Patient Satisfaction', value: '94%', change: '+3.2%', trend: 'up', color: '#45B7D1' },
    { name: 'Appointment Rate', value: '88%', change: '+5.1%', trend: 'up', color: '#FF6B6B' },
    { name: 'Staff Efficiency', value: '92%', change: '+2.8%', trend: 'up', color: '#98D8C8' }
  ];

  const performanceMetrics = [
    { category: 'Patient Visits', current: 1240, previous: 980, growth: '+26.5%' },
    { category: 'Revenue Growth', current: 45280, previous: 38500, growth: '+17.6%' },
    { category: 'Doctor Efficiency', current: 92, previous: 86, growth: '+7.0%' },
    { category: 'Appointment Completion', current: 88, previous: 82, growth: '+7.3%' }
  ];

  return (
    <div className="dashboard">
      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          <div className="clinic-info">
            <h1>Analytics & Reports</h1>
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

          {/* Report Metrics - Replaced Patient Visit Stats */}
          <div className="stats-section">
            <h3>Performance Overview</h3>
            <div className="visit-stats">
              <div className="overall-stat">
                <div className="stat-value">87%</div>
                <div className="stat-label">Overall Performance</div>
              </div>
              {performanceMetrics.map((metric, index) => (
                <div key={metric.category} className="department-stat">
                  <div className="stat-bar">
                    <div 
                      className="stat-progress" 
                      style={{
                        width: `${Math.min((metric.current / (metric.category === 'Revenue Growth' ? 50000 : 1500)) * 100, 100)}%`,
                        backgroundColor: reportStats[index].color
                      }}
                    ></div>
                  </div>
                  <span className="stat-text">{metric.category} {metric.growth}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="content-area">
          {/* Page Header */}
          <div className="page-header">
            <h2>Performance Analytics</h2>
            <p className="page-subtitle">Comprehensive reports and insights for your clinic</p>
          </div>

          {/* Metrics Cards */}
          <div className="metrics-grid">
            {reportStats.map((stat, index) => (
              <div key={stat.name} className={`metric-card ${index === 0 ? 'primary' : index === 1 ? 'success' : index === 2 ? 'warning' : 'info'}`}>
                <div className="metric-icon">📈</div>
                <div className="metric-content">
                  <div className="metric-value dark-text">{stat.value}</div>
                  <div className="metric-label dark-text">{stat.name}</div>
                  <div className={`metric-change ${stat.trend === 'up' ? 'positive' : 'negative'}`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reports Section - NOW INTERACTIVE */}
          <div className="reports-section">
            <div className="section-header">
              <h3>Detailed Reports</h3>
              <div className="subtitle">Monthly performance breakdown</div>
            </div>
            
            <div className="reports-grid">
              {reportTypes.map((report) => (
                <div key={report.id} className="report-card">
                  <div className="report-header">
                    <h4>{report.title}</h4>
                    <span className="report-badge">{report.period}</span>
                  </div>
                  <div className="report-content">
                    {sampleReportData[report.id]?.metrics.slice(0, 3).map((metric, index) => (
                      <div key={index} className="report-metric">
                        <span className="metric-label">{metric.label}</span>
                        <span className={`metric-value ${metric.change.includes('+') ? 'positive' : ''}`}>
                          {metric.value}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button 
                    className="btn btn-primary report-btn"
                    onClick={() => handleViewFullReport(report.id)}
                    disabled={isGenerating && selectedReport === report.id}
                  >
                    {isGenerating && selectedReport === report.id ? 'Loading...' : 'View Full Report'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Export Section - NOW INTERACTIVE */}
          <div className="export-section">
            <div className="export-header">
              <h3>Export Reports</h3>
              <p>Download comprehensive reports in various formats</p>
            </div>
            <div className="export-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => selectedReport && handleExportReport('pdf', selectedReport)}
                disabled={!selectedReport}
              >
                📊 PDF Report
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => selectedReport && handleExportReport('xlsx', selectedReport)}
                disabled={!selectedReport}
              >
                📄 Excel Sheet
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => selectedReport && handleExportReport('csv', selectedReport)}
                disabled={!selectedReport}
              >
                📋 CSV Data
              </button>
            </div>
            {!selectedReport && (
              <p className="export-note">
                Select a report above to enable export options
              </p>
            )}
          </div>

          {/* Report Preview Modal */}
          {selectedReport && sampleReportData[selectedReport] && (
            <div className="report-preview-modal">
              <div className="modal-overlay" onClick={closeReportPreview}></div>
              <div className="modal-content">
                <div className="modal-header">
                  <h3>{sampleReportData[selectedReport].title}</h3>
                  <button className="close-btn" onClick={closeReportPreview}>×</button>
                </div>
                <div className="modal-body">
                  <p className="report-description">
                    {sampleReportData[selectedReport].description}
                  </p>
                  <div className="preview-metrics">
                    {sampleReportData[selectedReport].metrics.map((metric, index) => (
                      <div key={index} className="preview-metric">
                        <div className="preview-label">{metric.label}</div>
                        <div className="preview-value">{metric.value}</div>
                        {metric.change && (
                          <div className={`preview-change ${metric.change.includes('+') ? 'positive' : 'negative'}`}>
                            {metric.change}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="modal-actions">
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleExportReport('pdf', selectedReport)}
                    >
                      📊 Export PDF
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleExportReport('xlsx', selectedReport)}
                    >
                      📄 Export Excel
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleExportReport('csv', selectedReport)}
                    >
                      📋 Export CSV
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
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
        
        .metric-change.negative {
          color: #e74c3c;
        }
        
        /* FIXED TEXT COLOR */
        .dark-text {
          color: #2c3e50 !important;
        }
        
        .reports-section {
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
        
        .reports-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .report-card {
          background: white;
          border-radius: 16px;
          padding: 25px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e0e6ed;
          transition: all 0.3s ease;
        }
        
        .report-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }
        
        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .report-header h4 {
          color: #2c3e50;
          font-size: 18px;
          font-weight: 700;
          margin: 0;
        }
        
        .report-badge {
          background: #e3f2fd;
          color: #1976d2;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
        }
        
        .report-content {
          margin-bottom: 20px;
        }
        
        .report-metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f1f3f4;
        }
        
        .report-metric:last-child {
          border-bottom: none;
        }
        
        .metric-label {
          color: #7f8c8d;
          font-size: 14px;
        }
        
        .metric-value {
          color: #2c3e50;
          font-size: 16px;
          font-weight: 600;
        }
        
        .metric-value.positive {
          color: #27ae60;
        }
        
        .report-btn {
          width: 100%;
          margin-top: 15px;
        }
        
        .export-section {
          background: #f8f9fa;
          border-radius: 16px;
          padding: 30px;
          text-align: center;
        }
        
        .export-header h3 {
          color: #2c3e50;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        
        .export-header p {
          color: #7f8c8d;
          margin-bottom: 20px;
        }
        
        .export-actions {
          display: flex;
          gap: 15px;
          justify-content: center;
        }
        
        .export-note {
          color: #7f8c8d;
          font-size: 14px;
          margin-top: 15px;
          font-style: italic;
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
          transform: none;
          box-shadow: none;
        }
        
        /* NEW: Report Preview Modal Styles */
        .report-preview-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
        }
        
        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 30px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
          border: 2px solid #e0e6ed;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #e0e6ed;
          padding-bottom: 15px;
        }
        
        .modal-header h3 {
          color: #2c3e50;
          font-size: 24px;
          font-weight: 700;
          margin: 0;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          color: #7f8c8d;
          cursor: pointer;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }
        
        .close-btn:hover {
          color: #2c3e50;
          background: #f8f9fa;
        }
        
        .report-description {
          color: #7f8c8d;
          margin-bottom: 25px;
          line-height: 1.5;
          font-size: 14px;
        }
        
        .preview-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 25px;
        }
        
        .preview-metric {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e0e6ed;
        }
        
        .preview-label {
          color: #7f8c8d;
          font-size: 12px;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .preview-value {
          color: #2c3e50;
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 5px;
        }
        
        .preview-change {
          font-size: 12px;
          font-weight: 600;
        }
        
        .preview-change.positive {
          color: #27ae60;
        }
        
        .preview-change.negative {
          color: #e74c3c;
        }
        
        .modal-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
          padding-top: 20px;
          border-top: 1px solid #e0e6ed;
        }
      `}</style>
    </div>
  );
};

export default ClinicReports;