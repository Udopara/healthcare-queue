import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, Users, MapPin, Loader2 } from 'lucide-react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { getQueueById } from '../../../services/queueService'

export default function QueueDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [queue, setQueue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadQueueDetails()
  }, [id])

  const loadQueueDetails = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getQueueById(id)
      setQueue(data)
    } catch (err) {
      setError(err.message || 'Failed to load queue details')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinQueue = () => {
    navigate(`/dashboard/queues/${id}/join`)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin h-12 w-12 text-indigo-600" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !queue) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">{error || 'Queue not found'}</p>
            <button
              onClick={() => navigate('/dashboard/queues')}
              className="mt-4 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Back to Queues
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/dashboard/queues')}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Queues
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white mb-2">{queue.name}</h1>
            <p className="text-indigo-100">{queue.department}</p>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {queue.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <p className="text-gray-900">{queue.description}</p>
              </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Current Position</p>
                    <p className="text-2xl font-bold text-gray-900">{queue.currentPosition}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Estimated Wait</p>
                    <p className="text-2xl font-bold text-gray-900">{queue.estimatedWaitTime} min</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">Total Patients</p>
                    <p className="text-2xl font-bold text-gray-900">{queue.totalPatients}</p>
                  </div>
                </div>
              </div>
            </div>

            {queue.location && (
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Location</p>
                  <p className="text-gray-900">{queue.location}</p>
                </div>
              </div>
            )}

            {/* Join Button */}
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleJoinQueue}
                className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Join Queue
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

