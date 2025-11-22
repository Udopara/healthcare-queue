import api from "../services/api";

export const fetchPatients = async () => {
  const res = await api.get("/patients");
  return res.data;
};

export const fetchQueues = async () => {
  const res = await api.get("/queues");
  return res.data;
};

export const createQueue = async ({ queue_name, max_number, clinic_id, status }) => {
  const res = await api.post("/queues", { queue_name, max_number, clinic_id, status });
  return res.data;
};

export const getQueueById = async (id) => {
  const res = await api.get(`/queues/${id}`);
  return res.data;
};

export const updateQueue = async (id, updates) => {
  const res = await api.put(`/queues/${id}`, updates);
  return res.data;
};

export const deleteQueue = async (id) => {
  const res = await api.delete(`/queues/${id}`);
  return res.data;
};

export const callNextPatient = async (id) => {
  const res = await api.post(`/queues/${id}/call-next`);
  return res.data;
};

export const fetchTickets = async (queue_id) => {
  const res = await api.get(`/queues/${queue_id}/tickets`);
  return res.data;
};

export const createTicket = async (ticketData) => {
  const res = await api.post("/tickets", ticketData);
  return res.data;
};

export const getTicketById = async (id) => {
  const res = await api.get(`/tickets/${id}`);
  return res.data;
};

export const deleteTicket = async (id) => {
  const res = await api.delete(`/tickets/${id}`);
  return res.data;
};
