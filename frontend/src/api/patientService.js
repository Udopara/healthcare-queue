import api from "../services/api";

/**
 * Patient Service
 * Handles all patient-related API calls
 */

// Get all available queues (for browsing)
export const fetchAvailableQueues = async () => {
  const res = await api.get("/queues");
  return res.data;
};

// Get queue by ID
export const getQueueById = async (queueId) => {
  const res = await api.get(`/queues/${queueId}`);
  return res.data;
};

// Join a queue (create a ticket)
export const joinQueue = async (queueId, notificationContact) => {
  const res = await api.post("/tickets", {
    queue_id: queueId,
    notification_contact: notificationContact,
  });
  return res.data;
};

// Get patient's tickets (queues they've joined)
export const getMyTickets = async () => {
  const res = await api.get("/tickets");
  return res.data;
};

// Get a single ticket by ID
export const getTicketById = async (ticketId) => {
  const res = await api.get(`/tickets/${ticketId}`);
  return res.data;
};

// Cancel a ticket (leave a queue)
export const cancelTicket = async (ticketId) => {
  const res = await api.delete(`/tickets/${ticketId}`);
  return res.data;
};

// Get all tickets for a queue (to calculate position)
export const getQueueTickets = async (queueId) => {
  const res = await api.get(`/queues/${queueId}/tickets`);
  return res.data;
};

