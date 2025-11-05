import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../components/routes/ProtectedRoute'
import PublicRoute from '../components/routes/PublicRoute'

// Public Pages
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'

// Auth Pages
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

// Dashboard Pages
import Dashboard from '../pages/dashboard/index'
import QueueList from '../pages/dashboard/queues/QueueList'
import QueueDetail from '../pages/dashboard/queues/QueueDetail'
import JoinQueue from '../pages/dashboard/queues/JoinQueue'
import Profile from '../pages/dashboard/profile/Profile'

// Admin Pages
import ManageQueues from '../pages/dashboard/admin/ManageQueues'
import Reports from '../pages/dashboard/admin/Reports'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />

      {/* Auth Routes - Public, but redirect if authenticated */}
      <Route
        path="/auth/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/auth/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      {/* Protected Dashboard Routes - Pages already include DashboardLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/queues"
        element={
          <ProtectedRoute>
            <QueueList />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/queues/:id"
        element={
          <ProtectedRoute>
            <QueueDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/queues/:id/join"
        element={
          <ProtectedRoute>
            <JoinQueue />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/dashboard/admin"
        element={
          <ProtectedRoute>
            <ManageQueues />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/admin/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      {/* 404 Route - Must be last */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

