import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * PublicRoute - Redirects to dashboard if already authenticated
 * Useful for login/register pages to prevent authenticated users from accessing them
 * Uses AuthContext to check authentication status
 * @param {Object} props
 * @param {React.Component} props.children - Component to render if not authenticated
 * @param {string} props.redirectTo - Path to redirect if authenticated (default: '/dashboard/queues')
 */
export default function PublicRoute({ 
  children, 
  redirectTo 
}) {
  const { isAuthenticated, loading, user, getDashboardRoute } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    const dashboardRoute = redirectTo || (user?.role ? getDashboardRoute(user.role) : '/patient/dashboard')
    return <Navigate to={dashboardRoute} replace />
  }

  return children
}

