import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ListChecks,
  PlusCircle,
  Users,
  BarChart,
  Settings,
  HelpCircle,
  CalendarCheck,
  Building2,
  Stethoscope,
  LogOut,
  Menu,
  X,
  User,
  Search
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout, getDashboardRoute } = useAuth()
  const location = useLocation()
  
  const role = user?.role?.toLowerCase() || 'patient'

  // Role-based navigation configurations
  const navigationConfig = {
    clinic: {
      title: 'Clinic Management Panel',
      logoHref: '/clinic/dashboard',
      items: [
        { name: 'Dashboard', href: '/clinic/dashboard', icon: LayoutDashboard },
        { name: 'My Queues', href: '/clinic/queues', icon: ListChecks },
        { name: 'Patients', href: '/clinic/patients', icon: Users },
        { name: 'Reports', href: '/clinic/reports', icon: BarChart },
        { name: 'Settings', href: '/clinic/settings', icon: Settings },
      ]
    },
    patient: {
      title: 'Patient Portal',
      logoHref: '/patient/dashboard',
      items: [
        { name: 'Dashboard', href: '/patient/dashboard', icon: LayoutDashboard },
        { name: 'Browse Queue', href: '/patient/browse', icon: Search },
        { name: 'Join Queue', href: '/patient/join', icon: PlusCircle },
        { name: 'My Queues', href: '/patient/my-queues', icon: ListChecks },
        { name: 'Profile', href: '/patient/profile', icon: User },
        { name: 'Help', href: '/patient/help', icon: HelpCircle },
      ]
    },
    doctor: {
      title: "Doctor's Workspace",
      logoHref: '/doctor/dashboard',
      items: [
        { name: 'Dashboard', href: '/doctor/dashboard', icon: LayoutDashboard },
        { name: 'Create Queue', href: '/doctor/create-queue', icon: PlusCircle },
        { name: 'Queue Monitor', href: '/doctor/queues', icon: ListChecks },
        { name: 'Appointments', href: '/doctor/appointments', icon: CalendarCheck },
        { name: 'Reports', href: '/doctor/reports', icon: BarChart },
        { name: 'Settings', href: '/doctor/settings', icon: Settings },
      ]
    },
    admin: {
      title: 'System Admin Panel',
      logoHref: '/admin/dashboard',
      items: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Clinics', href: '/admin/clinics', icon: Building2 },
        { name: 'Doctors', href: '/admin/doctors', icon: Stethoscope },
        { name: 'Patients', href: '/admin/patients', icon: Users },
        { name: 'Reports', href: '/admin/reports', icon: BarChart },
        { name: 'System Settings', href: '/admin/settings', icon: Settings },
      ]
    }
  }

  const config = navigationConfig[role] || navigationConfig.patient
  const navItems = config.items

  const handleLogout = () => {
    logout()
  }

  const isActive = (href) => {
    // Exact match for dashboard
    if (href.endsWith('/dashboard')) {
      return location.pathname === href
    }
    // Prefix match for other routes
    return location.pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link to={config.logoHref} className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <ListChecks className="w-5 h-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">Queue Generator</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    active
                      ? 'bg-indigo-50 text-indigo-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center px-4 py-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.fullName || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate capitalize">
                  {user?.role || ''}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-500 hover:text-gray-700"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div className="hidden sm:flex items-center">
                <div className="text-sm text-gray-600">
                  Welcome, <span className="font-medium text-gray-900">{user?.fullName}</span>
                </div>
              </div>
              
              <h1 className="text-lg font-semibold text-gray-900 lg:hidden">
                {config.title}
              </h1>
            </div>

            <div className="hidden lg:block text-lg font-semibold text-gray-900">
              {config.title}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
