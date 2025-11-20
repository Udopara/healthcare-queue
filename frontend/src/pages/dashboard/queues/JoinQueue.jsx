import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { joinQueue, getQueueById } from '../../../services/queueService'
import { useAuth } from '../../../context/AuthContext'

export default function JoinQueue() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [queue, setQueue] = useState(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [joined, setJoined] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)

  useEffect(() => {
    loadQueueDetails()
  }, [id])

  const loadQueueDetails = async () => {
    setLoading(true)
    try {
      const data = await getQueueById(id)
      setQueue(data)
    } catch (err) {
      setError(err.message || 'Failed to load queue details')
    } finally {
      setLoading(false)
    }
  }

  const handleJoin = async () => {
    setJoining(true)
    setError('')
    
    try {
      const patientData = {
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        userId: user.id
      }
      
      const response = await joinQueue(id, patientData)
      setResult(response)
      setJoined(true)
    } catch (err) {
      setError(err.message || 'Failed to join queue')
    } finally {
      setJoining(false)
    }
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

  if (error && !queue) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
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
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(`/dashboard/queues/${id}`)}
          className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>

        {joined ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Successfully Joined Queue!</h2>
            <p className="text-gray-600 mb-6">You have been added to the queue</p>

            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Queue</p>
                  <p className="text-lg font-semibold text-gray-900">{queue?.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Your Position</p>
                  <p className="text-lg font-semibold text-gray-900">#{result?.position}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Estimated Wait Time</p>
                  <p className="text-lg font-semibold text-gray-900">{result?.estimatedWaitTime} minutes</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Ticket Number</p>
                  <p className="text-lg font-semibold text-gray-900">{result?.ticketNumber}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/dashboard/queues')}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Browse More Queues
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Queue</h2>
            <p className="text-gray-600 mb-6">Confirm your details and join the queue</p>

            {queue && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{queue.name}</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium text-gray-500">Department:</span> {queue.department}</p>
                  <p><span className="font-medium text-gray-500">Current Position:</span> {queue.currentPosition}</p>
                  <p><span className="font-medium text-gray-500">Estimated Wait:</span> {queue.estimatedWaitTime} minutes</p>
                </div>
              </div>
            )}

            <div className="bg-indigo-50 rounded-lg p-6 mb-6">
              <h3 className="text-sm font-medium text-indigo-900 mb-2">Your Information</h3>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium text-indigo-700">Name:</span> {user?.fullName}</p>
                <p><span className="font-medium text-indigo-700">Phone:</span> {user?.phoneNumber}</p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/dashboard/queues/${id}`)}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleJoin}
                disabled={joining}
                className="flex-1 px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {joining ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5 inline mr-2" />
                    Joining...
                  </>
                ) : (
                  'Confirm & Join'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

