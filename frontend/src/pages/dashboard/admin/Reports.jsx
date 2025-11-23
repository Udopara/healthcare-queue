import React from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react'

export default function Reports() {
  // Mock data - replace with actual API calls
  const stats = [
    {
      name: 'Total Queues',
      value: '12',
      change: '+2',
      icon: BarChart3,
      color: 'bg-indigo-500'
    },
    {
      name: 'Total Patients',
      value: '1,234',
      change: '+15%',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      name: 'Avg Wait Time',
      value: '15 min',
      change: '-5%',
      icon: Clock,
      color: 'bg-purple-500'
    },
    {
      name: 'Satisfaction Rate',
      value: '94%',
      change: '+2%',
      icon: TrendingUp,
      color: 'bg-blue-500'
    }
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-2 text-gray-600">View insights and statistics about queue management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.name}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center">
                  <div className={`${stat.color} rounded-lg p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <span className={`ml-2 text-sm font-medium ${
                        stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Queue Performance</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Chart visualization coming soon</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">New queue created</p>
                <p className="text-xs text-gray-500">General Consultation - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="text-sm font-medium text-gray-900">Queue capacity reached</p>
                <p className="text-xs text-gray-500">Pediatrics - 5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-gray-900">System update completed</p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

