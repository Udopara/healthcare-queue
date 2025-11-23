import api from '../services/api';

// Fetch all queues for a clinic
export const fetchQueues = async (clinicId) => {
  const res = await api.get("/queues", { params: { clinic_id: clinicId } });
  return res.data;
};

// Get a specific queue by ID
export const getQueueById = async (queueId) => {
  const res = await api.get(`/queues/${queueId}`);
  return res.data;
};

// Get all tickets for a queue
export const getQueueTickets = async (queueId) => {
  const res = await api.get(`/queues/${queueId}/tickets`);
  return res.data;
};

// Get all doctors for a clinic
export const getDoctorsByClinic = async (clinicId) => {
  const res = await api.get(`/clinics/${clinicId}/doctors`);
  return res.data;
};

// Create a doctor (register a new doctor user)
export const createDoctor = async (name, email, phone_number, password, clinicId) => {
  const res = await api.post("/auth/register", {
    name,
    email,
    phone_number,
    password,
    role: "doctor",
    clinicId,
  });
  return res.data;
};

// Get clinic by ID
export const getClinicById = async (clinicId) => {
  const res = await api.get(`/clinics/${clinicId}`);
  return res.data;
};

// Update clinic
export const updateClinic = async (clinicId, data) => {
  const res = await api.put(`/clinics/${clinicId}`, data);
  return res.data;
};

