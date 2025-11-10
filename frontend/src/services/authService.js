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
 * Logout a user (client-side only for now)
 */
export const logout = () => {
  // Clear local storage
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

