import api from './api';

// Admin dashboard statistics
export const getDashboardStats = async () => {
  try {
    // Fetch all data in parallel
    const [clinics, patients, users, queues, tickets] = await Promise.all([
      api.get('/clinics'),
      api.get('/patients'),
      api.get('/users'),
      api.get('/queues'),
      api.get('/tickets')
    ]);

    const stats = {
      totalClinics: clinics.data.length,
      totalDoctors: users.data.filter(u => u.role === 'doctor').length,
      totalPatients: patients.data.length,
      totalQueues: queues.data.length,
      totalTickets: tickets.data.length,
      activeTickets: tickets.data.filter(t => t.status === 'waiting' || t.status === 'serving').length,
      completedTickets: tickets.data.filter(t => t.status === 'completed').length,
      waitingTickets: tickets.data.filter(t => t.status === 'waiting').length,
      servingTickets: tickets.data.filter(t => t.status === 'serving').length,
      cancelledTickets: tickets.data.filter(t => t.status === 'cancelled').length,
    };

    return stats;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Get all clinics
export const getAllClinics = async () => {
  try {
    const response = await api.get('/clinics');
    return response.data;
  } catch (error) {
    console.error('Error fetching clinics:', error);
    throw error;
  }
};

// Update a clinic
export const updateClinic = async (id, clinicData) => {
  try {
    const response = await api.put(`/clinics/${id}`, clinicData);
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          throw new Error(data.message || 'Invalid clinic data. Please check your input.');
        case 404:
          throw new Error('Clinic not found.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(data.message || 'Failed to update clinic. Please try again.');
      }
    } else if (error.request) {
      throw new Error('Cannot connect to server. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};

// Delete a clinic
export const deleteClinic = async (id) => {
  try {
    const response = await api.delete(`/clinics/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 404:
          throw new Error('Clinic not found.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(data.message || 'Failed to delete clinic. Please try again.');
      }
    } else if (error.request) {
      throw new Error('Cannot connect to server. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};

// Get all patients
export const getAllPatients = async () => {
  try {
    const response = await api.get('/patients');
    return response.data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
  }
};

// Get all users
export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Update a user
export const updateUser = async (id, userData) => {
  try {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          throw new Error(data.message || 'Invalid user data. Please review the fields.');
        case 404:
          throw new Error('User not found.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(data.message || 'Failed to update user. Please try again.');
      }
    } else if (error.request) {
      throw new Error('Cannot connect to server. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};

// Delete a user
export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 404:
          throw new Error('User not found.');
        case 500:
          throw new Error('Server error. Please try again later.');
        default:
          throw new Error(data.message || 'Failed to delete user. Please try again.');
      }
    } else if (error.request) {
      throw new Error('Cannot connect to server. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
};

// Get all queues
export const getAllQueues = async () => {
  try {
    const response = await api.get('/queues');
    return response.data;
  } catch (error) {
    console.error('Error fetching queues:', error);
    throw error;
  }
};

// Get all tickets
export const getAllTickets = async () => {
  try {
    const response = await api.get('/tickets');
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    throw error;
  }
};

// Get ticket time series data
export const getTicketTimeSeries = async (days = 30) => {
  try {
    const tickets = await getAllTickets();
    
    // Group tickets by date
    const dateMap = {};
    const today = new Date();
    
    // Initialize all dates
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap[dateStr] = {
        date: dateStr,
        completed: 0,
        waiting: 0,
        serving: 0,
        cancelled: 0
      };
    }
    
    // Count tickets by date and status
    tickets.forEach(ticket => {
      if (ticket.issued_at) {
        const dateStr = ticket.issued_at.split('T')[0];
        if (dateMap[dateStr]) {
          const status = ticket.status || 'waiting';
          if (dateMap[dateStr][status] !== undefined) {
            dateMap[dateStr][status]++;
          }
        }
      }
    });
    
    return Object.values(dateMap);
  } catch (error) {
    console.error('Error generating ticket time series:', error);
    throw error;
  }
};

// Get queue status distribution
export const getQueueStatusDistribution = async () => {
  try {
    const queues = await getAllQueues();
    
    const statusCounts = {
      open: 0,
      paused: 0,
      closed: 0
    };
    
    queues.forEach(queue => {
      const status = queue.status || 'open';
      if (statusCounts[status] !== undefined) {
        statusCounts[status]++;
      }
    });
    
    return [
      { name: 'Open', value: statusCounts.open, color: '#10b981' },
      { name: 'Paused', value: statusCounts.paused, color: '#f59e0b' },
      { name: 'Closed', value: statusCounts.closed, color: '#ef4444' }
    ];
  } catch (error) {
    console.error('Error getting queue status distribution:', error);
    throw error;
  }
};

// Get ticket status distribution
export const getTicketStatusDistribution = async () => {
  try {
    const tickets = await getAllTickets();
    
    const statusCounts = {
      completed: 0,
      waiting: 0,
      serving: 0,
      cancelled: 0
    };
    
    tickets.forEach(ticket => {
      const status = ticket.status || 'waiting';
      if (statusCounts[status] !== undefined) {
        statusCounts[status]++;
      }
    });
    
    return [
      { name: 'Completed', value: statusCounts.completed, color: '#10b981' },
      { name: 'Waiting', value: statusCounts.waiting, color: '#3b82f6' },
      { name: 'Serving', value: statusCounts.serving, color: '#f59e0b' },
      { name: 'Cancelled', value: statusCounts.cancelled, color: '#ef4444' }
    ];
  } catch (error) {
    console.error('Error getting ticket status distribution:', error);
    throw error;
  }
};

// Get clinic performance data
export const getClinicPerformance = async () => {
  try {
    const [clinics, queues, tickets] = await Promise.all([
      getAllClinics(),
      getAllQueues(),
      getAllTickets()
    ]);
    
    return clinics.map(clinic => {
      const clinicQueues = queues.filter(q => q.clinic_id === clinic.id);
      const clinicTickets = tickets.filter(t => 
        clinicQueues.some(q => q.queue_id === t.queue_id)
      );
      
      const completedTickets = clinicTickets.filter(t => t.status === 'completed');
      const activeTickets = clinicTickets.filter(t => 
        t.status === 'waiting' || t.status === 'serving'
      );
      
      // Calculate average wait time (if served_at and issued_at exist)
      const servedTickets = clinicTickets.filter(t => t.served_at && t.issued_at);
      let avgWaitTime = 0;
      if (servedTickets.length > 0) {
        const totalWait = servedTickets.reduce((sum, t) => {
          const wait = new Date(t.served_at) - new Date(t.issued_at);
          return sum + (wait / 1000 / 60); // Convert to minutes
        }, 0);
        avgWaitTime = Math.round(totalWait / servedTickets.length);
      }
      
      return {
        clinic_name: clinic.clinic_name,
        total_queues: clinicQueues.length,
        total_tickets: clinicTickets.length,
        completed_tickets: completedTickets.length,
        active_tickets: activeTickets.length,
        avg_wait_time: avgWaitTime
      };
    });
  } catch (error) {
    console.error('Error getting clinic performance:', error);
    throw error;
  }
};

