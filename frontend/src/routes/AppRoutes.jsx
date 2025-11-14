import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../components/routes/protectedRoute'
import PublicRoute from '../components/routes/publicRoute'
import RootRedirect from '../components/routes/RootRedirect'
import RoleBasedRoutes from './RoleBasedRoutes'

// Public Pages
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'

// Auth Pages
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Root route - redirects authenticated users to their dashboard */}
      <Route path="/" element={<RootRedirect />} />

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
      <Route
        path="/auth/forgot-password"
        element={
          <PublicRoute>
            <ForgotPasswordPage />
          </PublicRoute>
        }
      />
      <Route
        path="/reset-password"
        element={
          <PublicRoute>
            <ResetPasswordPage />
          </PublicRoute>
        }
      />

      {/* Protected Role-Based Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <RoleBasedRoutes />
          </ProtectedRoute>
        }
      />

      {/* 404 Route - Must be last */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
