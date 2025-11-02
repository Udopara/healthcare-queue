import React from 'react'
import { Navigate } from 'react-router-dom'

/**
 * ProtectedRoute - Only allows access if user is authenticated
 * @param {Object} props
 * @param {React.Component} props.children - Component to render if authenticated
 * @param {boolean} props.isAuthenticated - Whether user is authenticated
 * @param {string} props.redirectTo - Path to redirect if not authenticated (default: '/auth/login')
 */
export default function ProtectedRoute({ 
  children, 
  isAuthenticated, 
  redirectTo = '/auth/login' 
}) {
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}

