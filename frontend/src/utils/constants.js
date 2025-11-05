/**
 * Application constants
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  
  // Auth routes
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Dashboard routes
  DASHBOARD: '/dashboard',
  QUEUES: '/dashboard/queues',
  QUEUE_DETAIL: (id) => `/dashboard/queues/${id}`,
  JOIN_QUEUE: (id) => `/dashboard/queues/${id}/join`,
  PROFILE: '/dashboard/profile',
  
  // Admin routes
  ADMIN: '/dashboard/admin',
  ADMIN_REPORTS: '/dashboard/admin/reports',
}

export const QUEUE_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  CLOSED: 'closed',
}

export const USER_ROLES = {
  PATIENT: 'patient',
  ADMIN: 'admin',
  CLINIC: 'clinic',
}

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  QUEUES: '/queues',
  QUEUE_BY_ID: (id) => `/queues/${id}`,
  JOIN_QUEUE: (id) => `/queues/${id}/join`,
  LEAVE_QUEUE: (id) => `/queues/${id}/leave`,
}

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
}

