/**
 * Authentication utility functions
 */

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token')
  return !!token
}

/**
 * Get current user from localStorage
 * @returns {Object|null}
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user')
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

/**
 * Save authentication data
 * @param {string} token - JWT token
 * @param {Object} user - User object
 */
export const setAuth = (token, user) => {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

/**
 * Clear authentication data
 */
export const clearAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

/**
 * Get authentication token
 * @returns {string|null}
 */
export const getToken = () => {
  return localStorage.getItem('token')
}

