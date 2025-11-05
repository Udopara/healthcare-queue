import React, { createContext, useState, useContext, useEffect } from 'react'
import { getToken, getCurrentUser, setAuth, clearAuth } from '../utils/auth'

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

  const login = async (phoneNumber, fullName) => {
    try {
      // TODO: Replace with actual API call
      // const response = await authService.login({ phoneNumber, fullName })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data
      const mockUser = {
        id: '1',
        phoneNumber,
        fullName,
        role: 'patient'
      }
      
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      setAuth(mockToken, mockUser)
      setUser(mockUser)
      
      return { success: true, user: mockUser }
    } catch (error) {
      throw new Error(error.message || 'Login failed')
    }
  }

  const register = async (phoneNumber, fullName) => {
    try {
      // TODO: Replace with actual API call
      // const response = await authService.register({ phoneNumber, fullName })
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data
      const mockUser = {
        id: '1',
        phoneNumber,
        fullName,
        role: 'patient'
      }
      
      const mockToken = 'mock-jwt-token-' + Date.now()
      
      setAuth(mockToken, mockUser)
      setUser(mockUser)
      
      return { success: true, user: mockUser }
    } catch (error) {
      throw new Error(error.message || 'Registration failed')
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

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: isAuthenticated()
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

