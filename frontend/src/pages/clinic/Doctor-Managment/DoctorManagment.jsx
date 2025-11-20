import React, { useState } from 'react';
import DashboardLayout from '../../../layouts/DashboardLayout';

const DoctorManagement = () => {
  const [doctors, setDoctors] = useState([
    {
      id: 'DOC-001',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      email: 'sjohnson@clinic.com',
      phone: '+1 (555) 123-4567',
      status: 'active',
      avatar: 'SJ'
    },
    {
      id: 'DOC-002', 
      name: 'Dr. Michael Chen',
      specialty: 'Pediatrics',
      email: 'm.chen@clinic.com',
      phone: '+1 (555) 123-4002',
      status: 'active',
      avatar: 'MC'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [viewingDoctor, setViewingDoctor] = useState(null);
  const [newDoctor, setNewDoctor] = useState({
    name: '',
    specialty: '',
    email: '',
    phone: ''
  });

  // Generate unique doctor ID
  const generateDoctorId = () => {
    const lastId = doctors.length > 0 
      ? Math.max(...doctors.map(d => parseInt(d.id.replace('DOC-', ''))))
      : 0;
    return `DOC-${String(lastId + 1).padStart(3, '0')}`;
  };

  // Add Doctor Function
  const handleAddDoctor = () => {
    if (newDoctor.name && newDoctor.specialty && newDoctor.email) {
      const doctor = {
        id: generateDoctorId(),
        name: newDoctor.name,
        specialty: newDoctor.specialty,
        email: newDoctor.email,
        phone: newDoctor.phone,
        status: 'active',
        avatar: newDoctor.name.split(' ').map(n => n[0]).join('')
      };
      
      setDoctors([...doctors, doctor]);
      setNewDoctor({ name: '', specialty: '', email: '', phone: '' });
      setShowAddForm(false);
      alert('Doctor added successfully!');
    } else {
      alert('Please fill in all required fields');
    }
  };

  // Remove Doctor Function
  const handleRemoveDoctor = (doctorId) => {
    if (window.confirm('Are you sure you want to remove this doctor?')) {
      setDoctors(doctors.filter(doctor => doctor.id !== doctorId));
      alert('Doctor removed successfully!');
    }
  };

  // Start Editing Doctor
  const handleStartEdit = (doctor) => {
    setEditingDoctor(doctor);
    setNewDoctor({
      name: doctor.name,
      specialty: doctor.specialty,
      email: doctor.email,
      phone: doctor.phone
    });
  };

  // Save Edited Doctor
  const handleSaveEdit = () => {
    if (newDoctor.name && newDoctor.specialty && newDoctor.email) {
      setDoctors(doctors.map(doctor => 
        doctor.id === editingDoctor.id 
          ? { 
              ...doctor, 
              name: newDoctor.name, 
              specialty: newDoctor.specialty,
              email: newDoctor.email,
              phone: newDoctor.phone,
              avatar: newDoctor.name.split(' ').map(n => n[0]).join('')
            }
          : doctor
      ));
      setEditingDoctor(null);
      setNewDoctor({ name: '', specialty: '', email: '', phone: '' });
      alert('Doctor updated successfully!');
    } else {
      alert('Please fill in all required fields');
    }
  };

  // Cancel Edit
  const handleCancelEdit = () => {
    setEditingDoctor(null);
    setNewDoctor({ name: '', specialty: '', email: '', phone: '' });
  };

  // View Doctor Details
  const handleViewDoctor = (doctor) => {
    setViewingDoctor(doctor);
  };

  const clinicData = {
    id: 'CLIN-789123',
    name: 'City Medical Center',
    email: 'admin@citymedical.com',
    phone: '+1 (555) 123-4567'
  };

  const departmentStats = [
    { name: 'Cardiology', visits: 40, color: '#FF6B6B' },
    { name: 'Neurology', visits: 40, color: '#4ECDC4' },
    { name: 'Dermatology', visits: 200, color: '#45B7D1' },
    { name: 'Gynecology', visits: 85, color: '#FFA07A' },
    { name: 'Urology', visits: 60, color: '#98D8C8' }
  ];

  return (
    <DashboardLayout>
      <div className="dashboard">
      {/* Header Section */}
      <header className="header">
        <div className="header-content">
          <div className="clinic-info">
            <h1>Doctor Management</h1>
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
        <main className="content-area">
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
          {/* Page Header */}
          <div className="page-header">
            <h2>Medical Staff</h2>
            <p className="page-subtitle">Manage your clinic's doctors and specialists</p>
          </div>

          {/* Metrics Cards */}
          <div className="metrics-grid">
            <div className="metric-card primary">
              <div className="metric-icon">👨‍⚕️</div>
              <div className="metric-content">
                <div className="metric-value dark-text">{doctors.length}</div>
                <div className="metric-label dark-text">Total Doctors</div>
              </div>
            </div>
            <div className="metric-card success">
              <div className="metric-icon">✅</div>
              <div className="metric-content">
                <div className="metric-value dark-text">{doctors.filter(d => d.status === 'active').length}</div>
                <div className="metric-label dark-text">Active Today</div>
              </div>
            </div>
            <div className="metric-card warning">
              <div className="metric-icon">⏸️</div>
              <div className="metric-content">
                <div className="metric-value dark-text">{doctors.filter(d => d.status === 'on-leave').length}</div>
                <div className="metric-label dark-text">On Leave</div>
              </div>
            </div>
            <div className="metric-card info">
              <div className="metric-icon">📊</div>
              <div className="metric-content">
                <div className="metric-value dark-text">92%</div>
                <div className="metric-label dark-text">Availability</div>
              </div>
            </div>
          </div>

          {/* Add Doctor Form */}
          {showAddForm && (
            <div className="form-card">
              <h3>Add New Doctor</h3>
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Specialty *"
                  value={newDoctor.specialty}
                  onChange={(e) => setNewDoctor({...newDoctor, specialty: e.target.value})}
                  className="form-input"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={newDoctor.email}
                  onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
                  className="form-input"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={newDoctor.phone}
                  onChange={(e) => setNewDoctor({...newDoctor, phone: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="form-info">
                <small>Doctor ID will be auto-generated: {generateDoctorId()}</small>
              </div>
              <div className="form-actions">
                <button onClick={handleAddDoctor} className="btn btn-primary">
                  Add Doctor
                </button>
                <button onClick={() => setShowAddForm(false)} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Edit Doctor Form */}
          {editingDoctor && (
            <div className="form-card">
              <h3>Edit Doctor - {editingDoctor.id}</h3>
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({...newDoctor, name: e.target.value})}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Specialty *"
                  value={newDoctor.specialty}
                  onChange={(e) => setNewDoctor({...newDoctor, specialty: e.target.value})}
                  className="form-input"
                />
                <input
                  type="email"
                  placeholder="Email *"
                  value={newDoctor.email}
                  onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})}
                  className="form-input"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={newDoctor.phone}
                  onChange={(e) => setNewDoctor({...newDoctor, phone: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="form-actions">
                <button onClick={handleSaveEdit} className="btn btn-primary">
                  Save Changes
                </button>
                <button onClick={handleCancelEdit} className="btn btn-secondary">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* View Doctor Modal */}
          {viewingDoctor && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Doctor Details</h3>
                  <button 
                    onClick={() => setViewingDoctor(null)}
                    className="close-btn"
                  >
                    ✕
                  </button>
                </div>
                <div className="doctor-profile">
                  <div className="profile-avatar">
                    {viewingDoctor.avatar}
                  </div>
                  <div className="profile-info">
                    <h4>{viewingDoctor.name}</h4>
                    <p className="specialty">{viewingDoctor.specialty}</p>
                    <div className="profile-details">
                      <div className="detail-row">
                        <span className="detail-label">Doctor ID:</span>
                        <span className="detail-value">{viewingDoctor.id}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Email:</span>
                        <span className="detail-value">{viewingDoctor.email}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Phone:</span>
                        <span className="detail-value">{viewingDoctor.phone}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Status:</span>
                        <span className={`status-badge ${viewingDoctor.status === 'active' ? 'active' : 'inactive'}`}>
                          {viewingDoctor.status === 'active' ? 'ACTIVE' : 'ON LEAVE'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-actions">
                  <button 
                    onClick={() => {
                      handleStartEdit(viewingDoctor);
                      setViewingDoctor(null);
                    }}
                    className="btn btn-primary"
                  >
                    Edit Doctor
                  </button>
                  <button 
                    onClick={() => setViewingDoctor(null)}
                    className="btn btn-secondary"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Doctor List Section */}
          <div className="doctor-list-section">
            <div className="section-header">
              <h3>Medical Staff Directory</h3>
              <div className="subtitle">All registered doctors and specialists</div>
            </div>
            
            <div className="doctors-grid">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="doctor-card">
                  <div className="doctor-header">
                    <div className="doctor-avatar">
                      {doctor.avatar}
                    </div>
                    <div className="doctor-info">
                      <h4 className="doctor-name">{doctor.name}</h4>
                      <p className="doctor-specialty">{doctor.specialty}</p>
                      <p className="doctor-id">ID: {doctor.id}</p>
                    </div>
                    <span className={`status-badge ${doctor.status === 'active' ? 'active' : 'inactive'}`}>
                      {doctor.status === 'active' ? 'ACTIVE' : 'ON LEAVE'}
                    </span>
                  </div>

                  <div className="doctor-details">
                    <div className="detail-item">
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{doctor.email}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{doctor.phone}</span>
                    </div>
                  </div>

                  <div className="doctor-actions">
                    <button 
                      onClick={() => handleStartEdit(doctor)}
                      className="btn-action edit"
                    >
                      <span>✏️</span>
                      Edit
                    </button>
                    <button 
                      onClick={() => handleRemoveDoctor(doctor.id)}
                      className="btn-action remove"
                    >
                      <span>🗑️</span>
                      Remove
                    </button>
                    <button 
                      onClick={() => handleViewDoctor(doctor)}
                      className="btn-action view"
                    >
                      <span>👁️</span>
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Doctor Button */}
          {!showAddForm && !editingDoctor && (
            <div className="add-doctor-section">
              <button 
                onClick={() => setShowAddForm(true)}
                className="btn btn-primary add-doctor-btn"
              >
                + Add New Doctor
              </button>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
          font-family: 'Inter', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
          color: #4b5563;
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
          background: linear-gradient(135deg, #4f46e5, #9333ea);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
        }
        
        .user-status {
          color: #10b981;
          font-weight: 500;
        }
        
        .main-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 30px;
        }
        
        .stats-section {
          margin-top: 40px;
        }
        
        .stats-section h3 {
          color: #111827;
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
          color: #4f46e5;
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
          color: #111827;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .page-subtitle {
          color: #4b5563;
          font-size: 16px;
        }
        
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .metric-card {
          padding: 24px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 15px;
          box-shadow: 0 6px 18px rgba(79, 70, 229, 0.08);
          background: linear-gradient(135deg, #eef2ff, #e0e7ff);
          border: 1px solid #e0e7ff;
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
          color: #4b5563;
        }
        
        /* FIXED TEXT COLOR */
        .dark-text {
          color: #2c3e50 !important;
        }
        
        /* Form Styles */
        .form-card {
          background: white;
          border-radius: 16px;
          padding: 25px;
          margin-bottom: 30px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e0e6ed;
        }
        
        .form-card h3 {
          color: #2c3e50;
          font-size: 20px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 15px;
        }
        
        .form-input {
          padding: 12px 15px;
          border: 1px solid #e0e6ed;
          border-radius: 8px;
          font-size: 14px;
          transition: border-color 0.3s ease;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
        }
        
        .form-info {
          margin-bottom: 20px;
          color: #7f8c8d;
          font-size: 12px;
        }
        
        .form-actions {
          display: flex;
          gap: 10px;
        }
        
        /* Modal Styles - FIXED TRANSPARENCY */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background: white;
          border-radius: 16px;
          padding: 30px;
          width: 90%;
          max-width: 500px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          border: 1px solid #e0e6ed;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .modal-header h3 {
          color: #2c3e50;
          font-size: 24px;
          font-weight: 600;
          margin: 0;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #7f8c8d;
          padding: 5px;
        }
        
        .close-btn:hover {
          color: #2c3e50;
        }
        
        .doctor-profile {
          display: flex;
          gap: 20px;
          margin-bottom: 25px;
        }
        
        .profile-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #9333ea);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 24px;
          flex-shrink: 0;
        }
        
        .profile-info {
          flex: 1;
        }
        
        .profile-info h4 {
          color: #111827;
          font-size: 20px;
          font-weight: 700;
          margin: 0 0 5px 0;
        }
        
        .specialty {
          color: #4f46e5;
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 15px 0;
        }
        
        .profile-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 5px 0;
        }
        
        .detail-label {
          color: #6b7280;
          font-size: 14px;
          font-weight: 500;
        }
        
        .detail-value {
          color: #111827;
          font-size: 14px;
          font-weight: 600;
        }
        
        .modal-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
        }
        
        .doctor-list-section {
          margin-top: 30px;
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
        
        .doctors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 20px;
        }
        
        .doctor-card {
          background: white;
          border-radius: 16px;
          padding: 25px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          border: 1px solid #e0e6ed;
          transition: all 0.3s ease;
        }
        
        .doctor-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }
        
        .doctor-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          gap: 15px;
        }
        
        .doctor-avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4f46e5, #9333ea);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: 18px;
        }
        
        .doctor-info {
          flex: 1;
        }
        
        .doctor-name {
          color: #111827;
          font-size: 18px;
          font-weight: 700;
          margin: 0 0 4px 0;
        }
        
        .doctor-specialty {
          color: #4f46e5;
          font-size: 14px;
          font-weight: 600;
          margin: 0 0 2px 0;
        }
        
        .doctor-id {
          color: #7f8c8d;
          font-size: 12px;
          margin: 0;
        }
        
        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
        }
        
        .status-badge.active {
          background: #d4edda;
          color: #155724;
        }
        
        .status-badge.inactive {
          background: #fff3cd;
          color: #856404;
        }
        
        .doctor-details {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 15px;
          margin-bottom: 20px;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #e9ecef;
        }
        
        .detail-item:last-child {
          border-bottom: none;
        }
        
        .detail-label {
          color: #7f8c8d;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .detail-value {
          color: #2c3e50;
          font-size: 13px;
          font-weight: 500;
        }
        
        .doctor-actions {
          display: flex;
          gap: 10px;
          justify-content: space-between;
        }
        
        .btn-action {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border: none;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
          justify-content: center;
        }
        
        .btn-action.edit {
          background: #eef2ff;
          color: #4f46e5;
        }
        
        .btn-action.remove {
          background: #fee2e2;
          color: #b91c1c;
        }
        
        .btn-action.view {
          background: #ede9fe;
          color: #7c3aed;
        }
        
        .btn-action:hover {
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        .add-doctor-section {
          text-align: center;
          margin-top: 40px;
        }
        
        .add-doctor-btn {
          padding: 15px 30px;
          font-size: 16px;
          font-weight: 600;
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
          background: linear-gradient(135deg, #4338ca, #4f46e5);
          color: white;
        }
        
        .btn-secondary {
          background: #1f2937;
          color: white;
        }
        
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
      `}</style>
      </div>
    </DashboardLayout>
  );
};

export default DoctorManagement;