import api from './api'

/**
 * Auth Service - Handles authentication API calls
 */

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email
 * @param {string} userData.phone_number - User's phone number (format: +250...)
 * @param {string} userData.role - User's role (patient or clinic)
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} Response with token and user data
 */
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData)
    return response.data
  } catch (error) {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          throw new Error(data.message || 'Missing or invalid fields. Please check your input.')
        case 409:
          throw new Error(data.message || 'Email already registered')
        case 500:
          throw new Error('Server error. Please try again later.')
        default:
          throw new Error(data.message || 'Registration failed. Please try again.')
      }
    } else if (error.request) {
      // Request made but no response
      throw new Error('Cannot connect to server. Please check your connection.')
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred. Please try again.')
    }
  }
}

/**
 * Login a user
 * @param {Object} credentials - Login credentials
 * @param {string} credentials.email - User's email
 * @param {string} credentials.password - User's password
 * @returns {Promise<Object>} Response with token and user data
 */
export const login = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials)
    return response.data
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          throw new Error(data.message || 'Missing email or password.')
        case 401:
          throw new Error(data.message || 'Invalid email or password.')
        case 500:
          throw new Error('Server error. Please try again later.')
        default:
          throw new Error(data.message || 'Login failed. Please try again.')
      }
    } else if (error.request) {
      throw new Error('Cannot connect to server. Please check your connection.')
    } else {
      throw new Error('An unexpected error occurred. Please try again.')
    }
  }
}

/**
 * Verify current authenticated user with server
 * Calls /api/auth/me to check if token is still valid
 * @returns {Promise<Object>} Current user data from server
 */
export const verifyUser = async () => {
  try {
    const response = await api.get('/auth/me')
    return response.data
  } catch (error) {
    if (error.response) {
      const { status } = error.response
      
      if (status === 401) {
        // Token is invalid or expired
        throw new Error('Session expired. Please login again.')
      } else if (status === 500) {
        throw new Error('Server error. Please try again later.')
      } else {
        throw new Error('Failed to verify user session.')
      }
    } else if (error.request) {
      throw new Error('Cannot connect to server. Please check your connection.')
    } else {
      throw new Error('An unexpected error occurred. Please try again.')
    }
  }
}

/**
 * Request password reset email
 * @param {string} email - User's email address
 * @returns {Promise<Object>} Response message
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/password/forgot', { email })
    return response.data
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          throw new Error(data.message || 'Invalid email address.')
        case 500:
          throw new Error('Server error. Please try again later.')
        default:
          throw new Error(data.message || 'Failed to send reset email. Please try again.')
      }
    } else if (error.request) {
      throw new Error('Cannot connect to server. Please check your connection.')
    } else {
      throw new Error('An unexpected error occurred. Please try again.')
    }
  }
}

/**
 * Reset password with token
 * @param {string} token - Reset token from email
 * @param {string} password - New password
 * @returns {Promise<Object>} Response message
 */
export const resetPassword = async (token, password) => {
  try {
    const response = await api.post('/auth/password/reset', { token, password })
    return response.data
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          throw new Error(data.message || 'Invalid or expired reset token.')
        case 500:
          throw new Error('Server error. Please try again later.')
        default:
          throw new Error(data.message || 'Failed to reset password. Please try again.')
      }
    } else if (error.request) {
      throw new Error('Cannot connect to server. Please check your connection.')
    } else {
      throw new Error('An unexpected error occurred. Please try again.')
    }
  }
}

/**
 * Logout a user (client-side only for now)
 */
export const logout = () => {
  // Clear local storage
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

