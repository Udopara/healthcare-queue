import React from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { User, Phone, Mail } from 'lucide-react'
import { useAuth } from '../../../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">View and manage your profile information</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
            <div className="flex items-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <User className="h-10 w-10 text-indigo-600" />
              </div>
              <div className="ml-6">
                <h2 className="text-2xl font-bold text-white">{user?.fullName || 'User'}</h2>
                <p className="text-indigo-100 mt-1">Patient Account</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Full Name
                </label>
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <p className="text-lg text-gray-900">{user?.fullName || 'Not provided'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Phone Number
                </label>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-gray-400 mr-3" />
                  <p className="text-lg text-gray-900">{user?.phoneNumber || 'Not provided'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Account Type
                </label>
                <div className="flex items-center">
                  <div className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                    {user?.role || 'patient'}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <button
                  className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  disabled
                >
                  Edit Profile (Coming Soon)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

