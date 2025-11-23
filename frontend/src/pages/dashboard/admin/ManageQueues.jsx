import React from 'react'
import DashboardLayout from '../../../layouts/DashboardLayout'
import { List, Plus, Edit, Trash2 } from 'lucide-react'

export default function ManageQueues() {
  // Mock data - replace with actual API calls
  const queues = [
    {
      id: '1',
      name: 'General Consultation',
      department: 'General Medicine',
      status: 'active',
      currentPatients: 12,
      maxCapacity: 50
    },
    {
      id: '2',
      name: 'Pediatrics',
      department: 'Pediatrics',
      status: 'active',
      currentPatients: 8,
      maxCapacity: 30
    }
  ]

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Queues</h1>
            <p className="mt-2 text-gray-600">Create and manage healthcare queues</p>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
            <Plus className="h-5 w-5 mr-2" />
            Create Queue
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Queue Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patients
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {queues.map((queue) => (
                  <tr key={queue.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <List className="h-5 w-5 text-gray-400 mr-3" />
                        <div className="text-sm font-medium text-gray-900">{queue.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{queue.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        queue.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {queue.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {queue.currentPatients} / {queue.maxCapacity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                        <Edit className="h-5 w-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {queues.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <List className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No queues found</h3>
            <p className="mt-2 text-sm text-gray-500">Get started by creating your first queue</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

