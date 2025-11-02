import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { isAuthenticated } from './utils/auth'

// Route Components
import ProtectedRoute from './components/routes/ProtectedRoute'
import PublicRoute from './components/routes/PublicRoute'

// Pages
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

// TODO: Import other pages as you create them
// import PatientDashboard from './pages/patient/PatientDashboard'
// import AdminDashboard from './pages/admin/DashboardPage'
// import QueueBookingPage from './pages/public/QueueBookingPage'

function App() {
  const authenticated = isAuthenticated()

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={<HomePage />} 
        />
        
        {/* Auth Routes - Only accessible when NOT authenticated */}
        <Route
          path="/auth/login"
          element={
            <PublicRoute isAuthenticated={authenticated}>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/auth/register"
          element={
            <PublicRoute isAuthenticated={authenticated}>
              <RegisterPage />
            </PublicRoute>
          }
        />

        {/* Protected Admin Routes */}
        {/* <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute isAuthenticated={authenticated}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        /> */}

        {/* Protected Clinic Routes */}
        {/* <Route
          path="/clinic/dashboard"
          element={
            <ProtectedRoute isAuthenticated={authenticated}>
              <ClinicDashboard />
            </ProtectedRoute>
          }
        /> */}

        {/* Patient Routes (public, but can be protected later if needed) */}
        {/* <Route
          path="/patient/dashboard"
          element={<PatientDashboard />}
        /> */}

        {/* Public Queue Booking */}
        {/* <Route
          path="/booking"
          element={<QueueBookingPage />}
        /> */}

        {/* 404 Route - Must be last */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
