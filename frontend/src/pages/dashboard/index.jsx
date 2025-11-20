import React from 'react'
import { Link } from 'react-router-dom'
import { List, Clock, Users, ArrowRight } from 'lucide-react'
import DashboardLayout from '../../layouts/DashboardLayout'

export default function Dashboard() {
  const stats = [
    {
      name: 'Active Queues',
      value: '12',
      icon: List,
      color: 'bg-indigo-500',
      link: '/dashboard/queues'
    },
    {
      name: 'Average Wait Time',
      value: '15 min',
      icon: Clock,
      color: 'bg-green-500',
      link: '/dashboard/queues'
    },
    {
      name: 'Total Patients',
      value: '124',
      icon: Users,
      color: 'bg-purple-500',
      link: '/dashboard/queues'
    }
  ]

  const quickActions = [
    {
      title: 'Browse Queues',
      description: 'View all available queues and join one',
      link: '/dashboard/queues',
      icon: List
    },
    {
      title: 'My Profile',
      description: 'View and update your profile information',
      link: '/dashboard/profile',
      icon: Users
    }
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome to Queue Generator</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Link
                key={stat.name}
                to={stat.link}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className={`${stat.color} rounded-lg p-3`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link
                  key={action.title}
                  to={action.link}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                      <Icon className="h-5 w-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900">{action.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{action.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

