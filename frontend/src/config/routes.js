/**
 * Route path constants
 * Use these constants instead of hardcoding route paths
 */

export const ROUTES = {
  // Public routes
  HOME: '/',
  BOOKING: '/booking',
  
  // Auth routes
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // Patient routes
  PATIENT_DASHBOARD: '/patient/dashboard',
  PATIENT_TICKETS: '/patient/tickets',
  PATIENT_HISTORY: '/patient/history',
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_CLINICS: '/admin/clinics',
  ADMIN_QUEUES: '/admin/queues',
  ADMIN_TICKETS: '/admin/tickets',
  
  // Clinic routes
  CLINIC_DASHBOARD: '/clinic/dashboard',
  CLINIC_QUEUES: '/clinic/queues',
}

