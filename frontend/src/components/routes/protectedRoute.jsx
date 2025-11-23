import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * ProtectedRoute - Only allows access if user is authenticated
 * Uses AuthContext to check authentication status
 * @param {Object} props
 * @param {React.Component} props.children - Component to render if authenticated
 * @param {string} props.redirectTo - Path to redirect if not authenticated (default: '/auth/login')
 */
export default function ProtectedRoute({ 
  children, 
  redirectTo = '/auth/login' 
}) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}

