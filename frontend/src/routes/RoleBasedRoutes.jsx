import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Clinic Pages
import ClinicDashboard from "../pages/clinic/ClinicDashboard";
import ClinicQueues from '../pages/clinic/Queues'
import ClinicDoctors from '../pages/clinic/ClinicDoctors'
import ClinicReports from '../pages/clinic/ClinicReports'
import ClinicSettings from '../pages/clinic/RecentActivity'
import ClinicNotFound from '../pages/clinic/NotFound'

// Patient Pages
import PatientDashboard from '../pages/patient/Dashboard'
import BrowseQueue from '../pages/patient/BrowseQueue'
import JoinQueue from '../pages/patient/JoinQueue'
import MyQueues from '../pages/patient/MyQueues'
import PatientProfile from '../pages/patient/Profile'
import PatientHelp from '../pages/patient/Help'
import PatientNotFound from '../pages/patient/NotFound'

// Doctor Pages
import DoctorDashboard from '../pages/doctor/Dashboard'
import DoctorQueues from '../pages/doctor/Queues'
import QueueMonitor from '../pages/doctor/QueueMonitor'
import DoctorSettings from '../pages/doctor/Settings'
import DoctorNotFound from '../pages/doctor/NotFound'

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard'
import AdminClinics from '../pages/admin/Clinics'
import AdminDoctors from '../pages/admin/Doctors'
import AdminPatients from '../pages/admin/Patients'
import AdminReports from '../pages/admin/Reports'
import AdminSettings from '../pages/admin/Settings'
import AdminManageUsers from '../pages/admin/ManageUsers'
import AdminNotFound from '../pages/admin/NotFound'

export default function RoleBasedRoutes() {
  const { user } = useAuth()

  if (!user || !user.role) {
    return <Navigate to="/auth/login" replace />
  }

  const role = user.role.toLowerCase()
  
  // Get the dashboard route for this role
  const dashboardRoutes = {
    clinic: '/clinic/dashboard',
    patient: '/patient/dashboard',
    doctor: '/doctor/dashboard',
    admin: '/admin/dashboard'
  }
  
  const dashboardRoute = dashboardRoutes[role] || '/patient/dashboard'

  // Clinic Routes
  if (role === 'clinic') {
    return (
      <Routes>
        <Route path="/clinic/dashboard" element={<ClinicDashboard />} />
        <Route path="/clinic/queues" element={<ClinicQueues />} />
        <Route path="/clinic/doctors" element={<ClinicDoctors />} />
        <Route path="/clinic/reports" element={<ClinicReports />} />
        <Route path="/clinic/settings" element={<ClinicSettings />} />
        <Route path="/clinic/*" element={<ClinicNotFound />} />
        <Route path="*" element={<Navigate to={dashboardRoute} replace />} />
      </Routes>
    )
  }
  // Patient Routes
  if (role === 'patient') {
    return (
      <Routes>
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/patient/browse" element={<BrowseQueue />} />
        <Route path="/patient/join" element={<JoinQueue />} />
        <Route path="/patient/my-queues" element={<MyQueues />} />
        <Route path="/patient/profile" element={<PatientProfile />} />
        <Route path="/patient/help" element={<PatientHelp />} />
        <Route path="/patient/*" element={<PatientNotFound />} />
        <Route path="*" element={<Navigate to={dashboardRoute} replace />} />
      </Routes>
    )
  }

  // Doctor Routes
 if (role === 'doctor') {
  return (
    <Routes>
      <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor/queues" element={<DoctorQueues />} />
      <Route path="/doctor/queues/:queueId" element={<QueueMonitor />} />
      <Route path="/doctor/settings" element={<DoctorSettings />} />
      <Route path="/doctor/*" element={<DoctorNotFound />} />
      <Route path="*" element={<Navigate to={dashboardRoute} replace />} />
    </Routes>
  )
}

  // Admin Routes
  if (role === 'admin') {
    return (
      <Routes>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/clinics" element={<AdminClinics />} />
        <Route path="/admin/doctors" element={<AdminDoctors />} />
        <Route path="/admin/users" element={<AdminManageUsers />} />
        <Route path="/admin/patients" element={<AdminPatients />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/*" element={<AdminNotFound />} />
        <Route path="*" element={<Navigate to={dashboardRoute} replace />} />
      </Routes>
    )
  }

  // Fallback - redirect to login if role is not recognized
  return <Navigate to="/auth/login" replace />
}

