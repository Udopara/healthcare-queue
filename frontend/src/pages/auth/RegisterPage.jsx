import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Phone, User, Loader2, Mail, Lock, Eye, EyeOff, Building2, UserCircle2 } from 'lucide-react'
import AuthLayout from '../../layouts/AuthLayout'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
    accountType: 'patient' // 'patient' or 'clinic'
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register, getDashboardRoute } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhoneNumber = (phone) => {
    // Accept format like +250784593206
    const phoneRegex = /^\+\d{10,15}$/
    return phoneRegex.test(phone)
  }

  const validatePassword = (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number
    return password.length >= 8
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (!formData.name.trim()) {
      toast.error('Full name is required')
      setLoading(false)
      return
    }

    if (formData.name.trim().length < 2) {
      toast.error('Full name must be at least 2 characters')
      setLoading(false)
      return
    }

    if (!formData.email.trim()) {
      toast.error('Email is required')
      setLoading(false)
      return
    }

    if (!validateEmail(formData.email)) {
      toast.error('Please enter a valid email address')
      setLoading(false)
      return
    }

    if (!formData.phone_number.trim()) {
      toast.error('Phone number is required')
      setLoading(false)
      return
    }

    if (!validatePhoneNumber(formData.phone_number)) {
      toast.error('Phone number must be in format +250XXXXXXXXX')
      setLoading(false)
      return
    }

    if (!formData.password) {
      toast.error('Password is required')
      setLoading(false)
      return
    }

    if (!validatePassword(formData.password)) {
      toast.error('Password must be at least 8 characters long')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      // Prepare registration data
      const registrationData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone_number: formData.phone_number.trim(),
        password: formData.password,
        role: formData.accountType
      }

      // Call register API
      const response = await register(registrationData)
      
      // Show success message
      toast.success(`Welcome, ${response.user.name}! Your account has been created.`)
      
      // Redirect to appropriate dashboard based on role
      const dashboardRoute = getDashboardRoute(response.user.role)
      
      // Small delay to show the toast
      setTimeout(() => {
        navigate(dashboardRoute)
      }, 1000)
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our healthcare queue management system
          </p>
        </div>

        {/* Account Type Selection */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Account Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, accountType: 'patient' })}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                formData.accountType === 'patient'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <UserCircle2 className={`h-8 w-8 mb-2 ${
                formData.accountType === 'patient' ? 'text-indigo-600' : 'text-gray-400'
              }`} />
              <span className="font-medium text-sm">Patient</span>
              <span className="text-xs text-gray-500 mt-1">Personal Account</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, accountType: 'clinic' })}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                formData.accountType === 'clinic'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
              }`}
            >
              <Building2 className={`h-8 w-8 mb-2 ${
                formData.accountType === 'clinic' ? 'text-indigo-600' : 'text-gray-400'
              }`} />
              <span className="font-medium text-sm">Clinic</span>
              <span className="text-xs text-gray-500 mt-1">Healthcare Provider</span>
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Note: Doctor accounts can only be created by clinics
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                required
                autoComplete="tel"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                placeholder="+250784593206"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Include country code (e.g., +250 for Rwanda)
            </p>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Must be at least 8 characters long
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.01] active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Creating your account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}
