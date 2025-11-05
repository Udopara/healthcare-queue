import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Clinic Pages
import ClinicDashboard from '../pages/clinic/Dashboard'
import ClinicQueues from '../pages/clinic/Queues'
import ClinicPatients from '../pages/clinic/Patients'
import ClinicReports from '../pages/clinic/Reports'
import ClinicSettings from '../pages/clinic/Settings'

// Patient Pages
import PatientDashboard from '../pages/patient/Dashboard'
import BrowseQueue from '../pages/patient/BrowseQueue'
import JoinQueue from '../pages/patient/JoinQueue'
import MyQueues from '../pages/patient/MyQueues'
import PatientProfile from '../pages/patient/Profile'
import PatientHelp from '../pages/patient/Help'

// Doctor Pages
import DoctorDashboard from '../pages/doctor/Dashboard'
import CreateQueue from '../pages/doctor/CreateQueue'
import DoctorQueues from '../pages/doctor/Queues'
import DoctorAppointments from '../pages/doctor/Appointments'
import DoctorReports from '../pages/doctor/Reports'
import DoctorSettings from '../pages/doctor/Settings'

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard'
import AdminClinics from '../pages/admin/Clinics'
import AdminDoctors from '../pages/admin/Doctors'
import AdminPatients from '../pages/admin/Patients'
import AdminReports from '../pages/admin/Reports'
import AdminSettings from '../pages/admin/Settings'

export default function RoleBasedRoutes() {
  const { user } = useAuth()

  if (!user || !user.role) {
    return <Navigate to="/auth/login" replace />
  }

  const role = user.role.toLowerCase()

  // Clinic Routes
  if (role === 'clinic') {
    return (
      <Routes>
        <Route path="/clinic/dashboard" element={<ClinicDashboard />} />
        <Route path="/clinic/queues" element={<ClinicQueues />} />
        <Route path="/clinic/patients" element={<ClinicPatients />} />
        <Route path="/clinic/reports" element={<ClinicReports />} />
        <Route path="/clinic/settings" element={<ClinicSettings />} />
        <Route path="/clinic/*" element={<Navigate to="/clinic/dashboard" replace />} />
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
        <Route path="/patient/*" element={<Navigate to="/patient/dashboard" replace />} />
      </Routes>
    )
  }

  // Doctor Routes
  if (role === 'doctor') {
    return (
      <Routes>
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/create-queue" element={<CreateQueue />} />
        <Route path="/doctor/queues" element={<DoctorQueues />} />
        <Route path="/doctor/appointments" element={<DoctorAppointments />} />
        <Route path="/doctor/reports" element={<DoctorReports />} />
        <Route path="/doctor/settings" element={<DoctorSettings />} />
        <Route path="/doctor/*" element={<Navigate to="/doctor/dashboard" replace />} />
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
        <Route path="/admin/patients" element={<AdminPatients />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    )
  }

  // Fallback - redirect to login if role is not recognized
  return <Navigate to="/auth/login" replace />
}

