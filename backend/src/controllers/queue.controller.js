import { Queue, Ticket, Doctor, Clinic } from "../models/index.js";

// Gets all queues, optionally filtered by clinic_id if provided
export const getAllQueues = async (req, res) => {
  const { clinic_id } = req.query;
  try {
    console.log("🔍 getAllQueues: Starting fetch, clinic_id:", clinic_id);
    let queues;
    
    // Fetch queues with related Doctor and Clinic data
    // Sequelize uses model names for associations by default
    const includeOptions = [
      {
        model: Doctor,
        attributes: ['full_name'],
        required: false, // Left join - queue can exist without doctor
      },
      {
        model: Clinic,
        attributes: ['clinic_name'],
        required: false, // Left join - queue can exist without clinic (shouldn't happen but safe)
      }
    ];

    try {
      if (clinic_id) {
        queues = await Queue.findAll({ 
          where: { clinic_id },
          include: includeOptions
        });
      } else {
        queues = await Queue.findAll({
          include: includeOptions
        });
      }
    } catch (fetchError) {
      // If error is about missing doctor_id column or associations, try without includes
      if (fetchError.message && (fetchError.message.includes('doctor_id') || fetchError.message.includes('Unknown column') || fetchError.message.includes('association'))) {
        console.warn("⚠️ doctor_id column or associations not found, fetching without includes");
        if (clinic_id) {
          queues = await Queue.findAll({ where: { clinic_id } });
        } else {
          queues = await Queue.findAll();
        }
      } else {
        throw fetchError; // Re-throw if it's a different error
      }
    }
    
    // Transform the data to include creator name
    // If associations didn't load, fetch names manually
    const queuesWithCreator = await Promise.all(queues.map(async (queue) => {
      const queueData = queue.toJSON ? queue.toJSON() : queue;
      
      // Determine creator name
      // Sequelize uses model names for associations - check both possible formats
      const doctorData = queueData.Doctor || queueData.doctor;
      const clinicData = queueData.Clinic || queueData.clinic;
      
      // Determine creator name and role
      if (queueData.doctor_id && doctorData && doctorData.full_name) {
        queueData.created_by_name = doctorData.full_name;
        queueData.created_by_role = 'doctor';
      } else if (queueData.doctor_id) {
        // If we have doctor_id but no doctor data from include, fetch it manually
        try {
          const doctor = await Doctor.findByPk(queueData.doctor_id, { attributes: ['full_name'] });
          queueData.created_by_name = doctor ? doctor.full_name : 'Unknown Doctor';
          queueData.created_by_role = 'doctor';
        } catch (err) {
          queueData.created_by_name = 'Unknown Doctor';
          queueData.created_by_role = 'doctor';
        }
      } else if (clinicData && clinicData.clinic_name) {
        queueData.created_by_name = clinicData.clinic_name;
        queueData.created_by_role = 'clinic';
      } else if (queueData.clinic_id) {
        // If we have clinic_id but no clinic data from include, fetch it manually
        try {
          const clinic = await Clinic.findByPk(queueData.clinic_id, { attributes: ['clinic_name'] });
          queueData.created_by_name = clinic ? clinic.clinic_name : 'Unknown Clinic';
          queueData.created_by_role = 'clinic';
        } catch (err) {
          queueData.created_by_name = 'Unknown Clinic';
          queueData.created_by_role = 'clinic';
        }
      } else {
        queueData.created_by_name = 'Unknown';
        queueData.created_by_role = 'unknown';
      }
      
      // Remove nested objects to keep response clean
      delete queueData.Doctor;
      delete queueData.doctor;
      delete queueData.Clinic;
      delete queueData.clinic;
      
      return queueData;
    }));
    
    console.log("✅ getAllQueues: Successfully fetched", queuesWithCreator?.length || 0, "queues");
    return res.json(queuesWithCreator);
  } catch (error) {
    console.error("❌ Error fetching queues:", error);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      original: error.original
    });
    return res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fetches a single queue by its ID
export const getQueueById = async (req, res) => {
  try {
    const { id } = req.params;
    const queue = await Queue.findByPk(id);

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    return res.json(queue);
  } catch (error) {
    console.error("Error fetching queue:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Creates a new queue for a clinic
// If created by a doctor, tracks the doctor_id
export const createQueue = async (req, res) => {
  try {
    const { queue_name, clinic_id, max_number, doctor_id } = req.body;
    const userRole = req.user?.role;
    const userLinkedEntityId = req.user?.linked_entity_id;

    if (!queue_name || !clinic_id) {
      return res
        .status(400)
        .json({ message: "queue_name and clinic_id are required." });
    }

    // If user is a doctor, use their doctor_id (from linked_entity_id)
    // Otherwise, use doctor_id from request body if provided (for clinic admins assigning to specific doctor)
    let finalDoctorId = null;
    if (userRole === "doctor" && userLinkedEntityId) {
      finalDoctorId = userLinkedEntityId; // linked_entity_id is the doctor_id for doctors
    } else if (doctor_id) {
      finalDoctorId = doctor_id; // Allow clinics to specify which doctor the queue belongs to
    }

    // Build queue data object
    const queueData = {
      queue_name,
      clinic_id,
      max_number: max_number || 0,
    };
    
    // Try to include doctor_id if we have a value
    // If the column doesn't exist in DB yet, this will be ignored
    if (finalDoctorId !== null && finalDoctorId !== undefined) {
      queueData.doctor_id = finalDoctorId;
    }

    let newQueue;
    try {
      newQueue = await Queue.create(queueData);
    } catch (createError) {
      // If error is about missing doctor_id column, try creating without it
      if (createError.message && createError.message.includes('doctor_id')) {
        console.warn("⚠️ doctor_id column not found, creating queue without it");
        delete queueData.doctor_id;
        newQueue = await Queue.create(queueData);
      } else {
        throw createError; // Re-throw if it's a different error
      }
    }

    // Format the response to include created_by info (like getAllQueues does)
    const queueResponse = newQueue.toJSON ? newQueue.toJSON() : newQueue;
    
    // Ensure doctor_id is in the response (it should be set if user is a doctor)
    if (finalDoctorId !== null && finalDoctorId !== undefined) {
      queueResponse.doctor_id = finalDoctorId;
    }
    
    // Add created_by_name and created_by_role
    if (queueResponse.doctor_id) {
      try {
        const doctor = await Doctor.findByPk(queueResponse.doctor_id, { attributes: ['full_name'] });
        queueResponse.created_by_name = doctor ? doctor.full_name : 'Unknown Doctor';
        queueResponse.created_by_role = 'doctor';
      } catch (err) {
        console.warn('Error fetching doctor name:', err);
        queueResponse.created_by_name = 'Unknown Doctor';
        queueResponse.created_by_role = 'doctor';
      }
    } else if (queueResponse.clinic_id) {
      try {
        const clinic = await Clinic.findByPk(queueResponse.clinic_id, { attributes: ['clinic_name'] });
        queueResponse.created_by_name = clinic ? clinic.clinic_name : 'Unknown Clinic';
        queueResponse.created_by_role = 'clinic';
      } catch (err) {
        console.warn('Error fetching clinic name:', err);
        queueResponse.created_by_name = 'Unknown Clinic';
        queueResponse.created_by_role = 'clinic';
      }
    } else {
      queueResponse.created_by_name = 'Unknown';
      queueResponse.created_by_role = 'unknown';
    }

    return res.status(201).json(queueResponse);
  } catch (error) {
    console.error("Error creating queue:", error);
    console.error("Error details:", {
      message: error.message,
      name: error.name,
      stack: error.stack,
      original: error.original
    });
    return res.status(500).json({ 
      message: "Internal server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Deletes a queue from the system
export const deleteQueue = async (req, res) => {
  try {
    const { id } = req.params;
    const queue = await Queue.findByPk(id);

    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    await queue.destroy();
    return res.json({ message: "Queue deleted successfully." });
  } catch (error) {
    console.error("Error deleting queue:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Updates queue properties like name, clinic, max capacity, or status
export const updateQueue = async (req, res) => {
  try {
    const { id } = req.params;
    const { queue_name, clinic_id, max_number, status } = req.body;

    const queue = await Queue.findByPk(id);
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    if (queue_name) queue.queue_name = queue_name;
    if (clinic_id) queue.clinic_id = clinic_id;
    if (status) queue.status = status;
    if (max_number) queue.max_number = max_number;

    await queue.save();
    return res.json(queue);
  } catch (error) {
    console.error("Error updating queue:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Returns all tickets for a specific queue
// Doctors, clinics, and admins can access all tickets
// Patients can access to calculate their position in the queue
export const getQueueTickets = async (req, res) => {
  const {role} = req.user;
  if (!["doctor", "clinic", "admin", "patient"].includes(role)) {
    return res
      .status(403)
      .json({ message: "Access denied. Insufficient permissions." });
  }

  try {
    const { queue_id } = req.params;
    const tickets = await Ticket.findAll({ where: { queue_id } });
    return res.json(tickets);
  } catch (error) {
    console.error("Error fetching tickets for queue:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Calls the next person in the queue (moves to serving status)
export const callNextInQueue = async (req, res) => {
  try {
    const queue_id = req.params.id;
    const result = await Queue.callNext(queue_id, { Ticket });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
