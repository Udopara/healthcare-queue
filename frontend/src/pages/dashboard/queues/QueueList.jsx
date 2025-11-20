import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, List as ListIcon } from 'lucide-react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { getQueues } from '../../../services/queueService'
import QueueCard from '../../../components/shared/QueueCard'
import SearchBar from '../../../components/shared/SearchBar'

export default function QueueList() {
  const [queues, setQueues] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const navigate = useNavigate()

  const departments = ['General Medicine', 'Pediatrics', 'Cardiology', 'Dermatology']

  useEffect(() => {
    loadQueues()
  }, [searchTerm, selectedDepartment])

  const loadQueues = async () => {
    setLoading(true)
    try {
      const filters = {
        search: searchTerm,
        department: selectedDepartment
      }
      const data = await getQueues(filters)
      setQueues(data)
    } catch (error) {
      console.error('Failed to load queues:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQueueClick = (queueId) => {
    navigate(`/dashboard/queues/${queueId}`)
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Available Queues</h1>
          <p className="mt-2 text-gray-600">Browse and join available queues</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Search */}
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search queues by name or department..."
            />

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Department
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Queues Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : queues.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <ListIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No queues found</h3>
            <p className="mt-2 text-sm text-gray-500">
              {searchTerm || selectedDepartment
                ? 'Try adjusting your filters'
                : 'No queues are currently available'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {queues.map((queue) => (
              <QueueCard
                key={queue.id}
                queue={queue}
                onClick={() => handleQueueClick(queue.id)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

