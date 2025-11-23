import api from './api'

/**
 * Queue Service
 * Handles all queue-related API calls
 */

// Get all queues
export const getQueues = async (filters = {}) => {
  try {
    // TODO: Replace with actual API call
    // const response = await api.get('/queues', { params: filters })
    // return response.data
    
    // Mock data for now
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const mockQueues = [
      {
        id: '1',
        name: 'General Consultation',
        department: 'General Medicine',
        currentPosition: 5,
        estimatedWaitTime: 15,
        status: 'active',
        totalPatients: 12
      },
      {
        id: '2',
        name: 'Pediatrics',
        department: 'Pediatrics',
        currentPosition: 2,
        estimatedWaitTime: 10,
        status: 'active',
        totalPatients: 8
      },
      {
        id: '3',
        name: 'Cardiology',
        department: 'Cardiology',
        currentPosition: 8,
        estimatedWaitTime: 30,
        status: 'active',
        totalPatients: 15
      },
      {
        id: '4',
        name: 'Dermatology',
        department: 'Dermatology',
        currentPosition: 3,
        estimatedWaitTime: 12,
        status: 'active',
        totalPatients: 6
      }
    ]
    
    // Apply filters
    let filtered = mockQueues
    if (filters.department) {
      filtered = filtered.filter(q => 
        q.department.toLowerCase().includes(filters.department.toLowerCase())
      )
    }
    if (filters.search) {
      filtered = filtered.filter(q => 
        q.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        q.department.toLowerCase().includes(filters.search.toLowerCase())
      )
    }
    
    return filtered
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch queues')
  }
}

// Get queue by ID
export const getQueueById = async (id) => {
  try {
    // TODO: Replace with actual API call
    // const response = await api.get(`/queues/${id}`)
    // return response.data
    
    // Mock data
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      id,
      name: 'General Consultation',
      department: 'General Medicine',
      description: 'General medical consultation and check-up',
      currentPosition: 5,
      estimatedWaitTime: 15,
      status: 'active',
      totalPatients: 12,
      averageWaitTime: 10,
      location: 'Room 101, Floor 1'
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch queue details')
  }
}

// Join a queue
export const joinQueue = async (queueId, patientData) => {
  try {
    // TODO: Replace with actual API call
    // const response = await api.post(`/queues/${queueId}/join`, patientData)
    // return response.data
    
    // Mock data
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      queueId,
      position: 13,
      estimatedWaitTime: 20,
      ticketNumber: 'T-' + Date.now()
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to join queue')
  }
}

// Get user's queue position
export const getMyQueuePosition = async (queueId) => {
  try {
    // TODO: Replace with actual API call
    // const response = await api.get(`/queues/${queueId}/my-position`)
    // return response.data
    
    // Mock data
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return {
      queueId,
      position: 3,
      estimatedWaitTime: 10,
      ticketNumber: 'T-123456'
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch queue position')
  }
}

// Leave a queue
export const leaveQueue = async (queueId) => {
  try {
    // TODO: Replace with actual API call
    // const response = await api.delete(`/queues/${queueId}/leave`)
    // return response.data
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return { success: true }
  } catch (error) {
    throw new Error(error.message || 'Failed to leave queue')
  }
}

// Search queues
export const searchQueues = async (searchTerm) => {
  try {
    // TODO: Replace with actual API call
    // const response = await api.get('/queues/search', { params: { q: searchTerm } })
    // return response.data
    
    return await getQueues({ search: searchTerm })
  } catch (error) {
    throw new Error(error.message || 'Failed to search queues')
  }
}

