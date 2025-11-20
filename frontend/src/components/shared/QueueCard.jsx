import React from 'react'
import { Clock, Users, ArrowRight } from 'lucide-react'

export default function QueueCard({ queue, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-indigo-300 cursor-pointer transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{queue.name}</h3>
          <p className="text-sm text-gray-500">{queue.department}</p>
        </div>
        <ArrowRight className="h-5 w-5 text-gray-400" />
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Users className="h-4 w-4 mr-2 text-gray-400" />
          <span>{queue.totalPatients} patients in queue</span>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2 text-gray-400" />
          <span>~{queue.estimatedWaitTime} min wait</span>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            queue.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            {queue.status}
          </span>
        </div>
      </div>
    </div>
  )
}

