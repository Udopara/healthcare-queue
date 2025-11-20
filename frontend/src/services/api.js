import axios from 'axios'
import { getToken } from '../utils/auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token and log requests
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Log request
    console.log('🚀 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data,
      params: config.params
    })
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors and log responses
api.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log('✅ API Response Success:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      fullURL: `${response.config.baseURL}${response.config.url}`,
      data: response.data,
      headers: response.headers
    })
    return response
  },
  (error) => {
    // Log error response
    console.error('❌ API Response Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : 'N/A',
      data: error.response?.data,
      headers: error.response?.headers,
      request: error.request,
      isNetworkError: !error.response && error.request,
      isRequestError: error.request && !error.response
    })
    
    if (error.response?.status === 401) {
      // Only auto-logout/redirect if there WAS a token (i.e. user was logged in)
      // This prevents the login page from refreshing immediately on bad credentials.
      const token = getToken()

      if (token) {
        // Unauthorized with existing session - clear auth and redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        if (window.location.pathname !== '/auth/login') {
          window.location.href = '/auth/login'
        }
      }
    }
    return Promise.reject(error)
  }
)

export default api

