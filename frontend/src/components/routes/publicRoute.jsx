import React from 'react'
import { Navigate } from 'react-router-dom'

/**
 * PublicRoute - Redirects to dashboard if already authenticated
 * Useful for login/register pages to prevent authenticated users from accessing them
 * @param {Object} props
 * @param {React.Component} props.children - Component to render if not authenticated
 * @param {boolean} props.isAuthenticated - Whether user is authenticated
 * @param {string} props.redirectTo - Path to redirect if authenticated (default: '/admin/dashboard')
 */
export default function PublicRoute({ 
  children, 
  isAuthenticated, 
  redirectTo = '/admin/dashboard' 
}) {
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  return children
}

