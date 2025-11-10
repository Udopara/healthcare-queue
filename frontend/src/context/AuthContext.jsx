import React, { createContext, useState, useContext, useEffect } from 'react'
import { getToken, getCurrentUser, setAuth, clearAuth } from '../utils/auth'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state and verify with server on every page reload
  // This useEffect runs once on mount (which happens on every page reload)
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken()
      
      // Always verify token with server on reload if token exists
      if (token) {
        try {
          // Call /api/auth/me to verify token and get fresh user data
          const response = await authService.verifyUser()
          
          if (response.user) {
            // Store fresh user data from server
            const userData = {
              id: response.user.id,
              name: response.user.name,
              email: response.user.email,
              phone_number: response.user.phone_number,
              role: response.user.role,
              linked_entity_id: response.user.linked_entity_id
            }
            
            // Update localStorage with fresh data from server
            setAuth(token, userData)
            setUser(userData)
          }
        } catch (error) {
          // Token is invalid or expired, clear auth
          console.log('Token verification failed on reload:', error.message)
          clearAuth()
          setUser(null)
        }
      } else {
        // No token found, ensure user is null
        setUser(null)
      }
      
      setLoading(false)
    }

    // Always call on mount (every page reload)
    initAuth()
  }, []) // Empty dependency array ensures this runs once on mount (every reload)

  const login = async (email, password) => {
    try {
      const response = await authService.login({ email, password })
      
      // Store token and user data
      const userData = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        phone_number: response.user.phone_number,
        role: response.user.role,
        linked_entity_id: response.user.linked_entity_id
      }
      
      setAuth(response.token, userData)
      setUser(userData)
      
      return { success: true, user: userData }
    } catch (error) {
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await authService.register(userData)
      
      // Store token and user data
      const user = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        phone_number: response.user.phone_number,
        role: response.user.role,
        linked_entity_id: response.user.linked_entity_id
      }
      
      setAuth(response.token, user)
      setUser(user)
      
      return { success: true, user }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    clearAuth()
    setUser(null)
    // Navigate will be handled by the component calling logout
    window.location.href = '/auth/login'
  }

  const isAuthenticated = () => {
    return !!user && !!getToken()
  }

  const getDashboardRoute = (userRole) => {
    const roleRoutes = {
      clinic: '/clinic/dashboard',
      patient: '/patient/dashboard',
      doctor: '/doctor/dashboard',
      admin: '/admin/dashboard'
    }
    return roleRoutes[userRole] || '/patient/dashboard'
  }

  const refreshUser = async () => {
    const token = getToken()
    if (!token) {
      setUser(null)
      return null
    }

    try {
      const response = await authService.verifyUser()
      if (response.user) {
        const userData = {
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          phone_number: response.user.phone_number,
          role: response.user.role,
          linked_entity_id: response.user.linked_entity_id
        }
        setAuth(token, userData)
        setUser(userData)
        return userData
      }
    } catch (error) {
      clearAuth()
      setUser(null)
      throw error
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
    isAuthenticated: isAuthenticated(),
    getDashboardRoute
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext

