import api from "../services/api";

export const fetchPatients = async () => {
  const res = await api.get("/patients");
  return res.data;
};

export const fetchQueues = async (clinicId = null) => {
  const params = clinicId ? { clinic_id: clinicId } : {};
  const res = await api.get("/queues", { params });
  return res.data;
};

export const createQueue = async (queueName, clinicId, maxNumber = 0, doctorId = null) => {
  const res = await api.post("/queues", { 
    queue_name: queueName,
    clinic_id: clinicId,
    max_number: maxNumber,
    doctor_id: doctorId // Will be automatically set by backend if user is a doctor
  });
  return res.data;
};

export const getQueueById = async (id) => {
  const res = await api.get(`/queues/${id}`);
  return res.data;
};

export const getQueueTickets = async (queueId) => {
  const res = await api.get(`/queues/${queueId}/tickets`);
  return res.data;
};

export const updateQueueStatus = async (queueId, status) => {
  const res = await api.put(`/queues/${queueId}`, { status });
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

export const callNextPatient = async (queueId) => {
  const res = await api.post(`/queues/${queueId}/call-next`);
  return res.data;
};

export const fetchTickets = async () => {
  const res = await api.get("/tickets");
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
