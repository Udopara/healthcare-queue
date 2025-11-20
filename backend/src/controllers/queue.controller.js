import { Queue, Ticket } from "../models/index.js";

// Gets all queues, optionally filtered by clinic_id if provided
export const getAllQueues = async (req, res) => {
  const { clinic_id } = req.query;
  try {
    console.log("🔍 getAllQueues: Starting fetch, clinic_id:", clinic_id);
    let queues;
    if (clinic_id) {
      queues = await Queue.findAll({ where: { clinic_id } });
    } else {
      queues = await Queue.findAll();
    }
    console.log("✅ getAllQueues: Successfully fetched", queues?.length || 0, "queues");
    return res.json(queues);
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
export const createQueue = async (req, res) => {
  try {
    const { queue_name, clinic_id, max_number } = req.body;

    if (!queue_name || !clinic_id) {
      return res
        .status(400)
        .json({ message: "queue_name and clinic_id are required." });
    }

    const newQueue = await Queue.create({
      queue_name,
      clinic_id,
      max_number,
    });

    return res.status(201).json(newQueue);
  } catch (error) {
    console.error("Error creating queue:", error);
    return res.status(500).json({ message: "Internal server error" });
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

// Returns all tickets for a specific queue - only doctors, clinics, and admins can access
export const getQueueTickets = async (req, res) => {
  const {role} = req.user;
  if (!["doctor", "clinic", "admin"].includes(role)) {
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
