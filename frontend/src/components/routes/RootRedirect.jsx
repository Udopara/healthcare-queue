import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import HomePage from '../../pages/HomePage'

/**
 * RootRedirect - Redirects authenticated users to their role-based dashboard
 * Shows HomePage for unauthenticated users
 */
export default function RootRedirect() {
  const { isAuthenticated, loading, user, getDashboardRoute } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (isAuthenticated && user?.role) {
    const dashboardRoute = getDashboardRoute(user.role)
    return <Navigate to={dashboardRoute} replace />
  }

  // If not authenticated, show HomePage
  return <HomePage />
}

