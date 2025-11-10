import React, { createContext, useState, useContext, useEffect } from 'react'
import { getToken, getCurrentUser, setAuth, clearAuth } from '../utils/auth'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const token = getToken()
      const currentUser = getCurrentUser()
      
      if (token && currentUser) {
        setUser(currentUser)
      }
      setLoading(false)
    }

    initAuth()
  }, [])

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

  const value = {
    user,
    loading,
    login,
    register,
    logout,
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

