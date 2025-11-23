import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import Modal from '../../components/ui/Modal'
import { useAuth } from '../../context/AuthContext'
import { 
  getQueueById, 
  getQueueTickets, 
  updateQueueStatus, 
  callNextPatient 
} from '../../api/doctorService'
import toast from 'react-hot-toast'
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  Square, 
  Phone, 
  Users, 
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react'

export default function QueueMonitor() {
  const { queueId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [queue, setQueue] = useState(null)
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showCloseModal, setShowCloseModal] = useState(false)
  const itemsPerPage = 10

  // Fetch queue details and tickets
  const loadQueueData = async () => {
    try {
      setLoading(true)
      const [queueData, ticketsData] = await Promise.all([
        getQueueById(queueId),
        getQueueTickets(queueId)
      ])
      
      // Verify this queue belongs to the logged-in doctor
      // Handle type mismatches (string vs number) by converting both to numbers
      if (user?.role === 'doctor') {
        const queueDoctorId = queueData.doctor_id != null ? Number(queueData.doctor_id) : null;
        const userDoctorId = user.linked_entity_id != null ? Number(user.linked_entity_id) : null;
        
        // If queue has no doctor_id, deny access (queue wasn't created by a doctor)
        if (queueDoctorId === null) {
          toast.error('This queue was not created by a doctor')
          navigate('/doctor/queues')
          return
        }
        
        // If user has no linked_entity_id, deny access
        if (userDoctorId === null) {
          toast.error('Unable to verify doctor identity')
          navigate('/doctor/queues')
          return
        }
        
        // Check if the queue belongs to this doctor
        if (queueDoctorId !== userDoctorId) {
          toast.error('You do not have access to this queue')
          navigate('/doctor/queues')
          return
        }
      }
      
      setQueue(queueData)
      setTickets(ticketsData || [])
    } catch (error) {
      console.error('Error loading queue data:', error)
      toast.error(error.response?.data?.message || 'Failed to load queue data')
      navigate('/doctor/queues')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (queueId) {
      loadQueueData()
    }
  }, [queueId])

  // Pagination calculations
  const totalPages = Math.ceil(tickets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedTickets = tickets.slice(startIndex, endIndex)

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      waiting: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', label: 'Waiting' },
      serving: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', label: 'Serving' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', label: 'Completed' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', label: 'Cancelled' }
    }
    const config = statusConfig[status] || statusConfig.waiting
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.text} ${config.border}`}>
        {config.label}
      </span>
    )
  }

  // Queue status badge
  const QueueStatusBadge = ({ status }) => {
    const statusConfig = {
      open: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', label: 'Open' },
      paused: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', label: 'Paused' },
      closed: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', label: 'Closed' }
    }
    const config = statusConfig[status] || statusConfig.open
    return (
      <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-semibold border ${config.bg} ${config.text} ${config.border}`}>
        {config.label}
      </span>
    )
  }

  // Handle call next patient
  const handleCallNext = async () => {
    if (queue?.status !== 'open') {
      toast.error('Queue must be open to call next patient')
      return
    }

    setActionLoading(true)
    try {
      const result = await callNextPatient(queueId)
      toast.success(result.message || 'Next patient called')
      await loadQueueData() // Refresh data
    } catch (error) {
      console.error('Error calling next patient:', error)
      toast.error(error.response?.data?.error || error.response?.data?.message || 'Failed to call next patient')
    } finally {
      setActionLoading(false)
    }
  }

  // Handle pause queue
  const handlePause = async () => {
    setActionLoading(true)
    try {
      await updateQueueStatus(queueId, 'paused')
      toast.success('Queue paused')
      await loadQueueData()
    } catch (error) {
      console.error('Error pausing queue:', error)
      toast.error(error.response?.data?.message || 'Failed to pause queue')
    } finally {
      setActionLoading(false)
    }
  }

  // Handle resume queue
  const handleResume = async () => {
    setActionLoading(true)
    try {
      await updateQueueStatus(queueId, 'open')
      toast.success('Queue resumed')
      await loadQueueData()
    } catch (error) {
      console.error('Error resuming queue:', error)
      toast.error(error.response?.data?.message || 'Failed to resume queue')
    } finally {
      setActionLoading(false)
    }
  }

  // Handle close queue
  const handleCloseConfirm = async () => {
    setShowCloseModal(false)
    setActionLoading(true)
    try {
      await updateQueueStatus(queueId, 'closed')
      toast.success('Queue closed')
      await loadQueueData()
    } catch (error) {
      console.error('Error closing queue:', error)
      toast.error(error.response?.data?.message || 'Failed to close queue')
    } finally {
      setActionLoading(false)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Calculate wait time
  const calculateWaitTime = (issuedAt) => {
    if (!issuedAt) return 'N/A'
    const issued = new Date(issuedAt)
    const now = new Date()
    const diffMinutes = Math.floor((now - issued) / 60000)
    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    const hours = Math.floor(diffMinutes / 60)
    return `${hours}h ${diffMinutes % 60}m ago`
  }

  // Statistics
  const stats = useMemo(() => {
    const waiting = tickets.filter(t => t.status === 'waiting').length
    const serving = tickets.filter(t => t.status === 'serving').length
    const completed = tickets.filter(t => t.status === 'completed').length
    const total = tickets.length

    return { waiting, serving, completed, total }
  }, [tickets])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading queue data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!queue) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">Queue not found</p>
          <button
            onClick={() => navigate('/doctor/queues')}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Back to Queues
          </button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/doctor/queues')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{queue.queue_name}</h1>
              <p className="text-sm text-gray-600 mt-1">Queue ID: {queue.queue_id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <QueueStatusBadge status={queue.status} />
            <button
              onClick={loadQueueData}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Waiting</p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.waiting}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Serving</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">{stats.serving}</p>
              </div>
              <Phone className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
              </div>
              <Users className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Queue Controls</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCallNext}
              disabled={actionLoading || queue.status !== 'open' || stats.waiting === 0}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <Phone className="w-4 h-4" />
              Call Next Patient
            </button>
            {queue.status === 'open' ? (
              <button
                onClick={handlePause}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <Pause className="w-4 h-4" />
                Pause Queue
              </button>
            ) : queue.status === 'paused' ? (
              <button
                onClick={handleResume}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <Play className="w-4 h-4" />
                Resume Queue
              </button>
            ) : null}
            {queue.status !== 'closed' && (
              <button
                onClick={() => setShowCloseModal(true)}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                <Square className="w-4 h-4" />
                Close Queue
              </button>
            )}
          </div>
        </div>

        {/* Patients Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Patients in Queue</h2>
            <span className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, tickets.length)} of {tickets.length}
            </span>
          </div>

          {tickets.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No patients in this queue yet</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Ticket ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Issued At
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Wait Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedTickets.map((ticket) => (
                      <tr key={ticket.ticket_id} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {ticket.ticket_id}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <StatusBadge status={ticket.status} />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {ticket.notification_contact}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(ticket.issued_at)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {calculateWaitTime(ticket.issued_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => {
                          // Show first page, last page, current page, and pages around current
                          return (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          )
                        })
                        .map((page, index, array) => {
                          // Add ellipsis if there's a gap
                          const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1
                          return (
                            <React.Fragment key={page}>
                              {showEllipsisBefore && (
                                <span className="px-2 text-gray-400">...</span>
                              )}
                              <button
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                  currentPage === page
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                {page}
                              </button>
                            </React.Fragment>
                          )
                        })}
                    </div>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Close Queue Confirmation Modal */}
        <Modal
          isOpen={showCloseModal}
          onClose={() => setShowCloseModal(false)}
          title="Close Queue"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Are you sure you want to close this queue?
                </h3>
                <p className="text-sm text-gray-600">
                  Closing this queue will prevent new patients from joining. Patients currently waiting will remain in the queue, but no new tickets can be issued.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleCloseConfirm}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {actionLoading ? 'Closing...' : 'Yes, Close Queue'}
              </button>
              <button
                onClick={() => setShowCloseModal(false)}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </DashboardLayout>
  )
}

