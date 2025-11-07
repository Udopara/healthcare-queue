import { Queue, Ticket } from "../models/index.js";

export const getAllQueues = async (req, res) => {
  const { clinic_id } = req.query;
  try {
    if (clinic_id) {
      const queues = await Queue.findAll({ where: { clinic_id } });
      return res.json(queues);
    } else {
      const queues = await Queue.findAll();
      return res.json(queues);
    }
  } catch (error) {
    console.error("Error fetching queues:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

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

export const createQueue = async (req, res) => {
  try {
    const { queue_name, clinic_id } = req.body;

    if (!queue_name || !clinic_id) {
      return res
        .status(400)
        .json({ message: "queue_name and clinic_id are required." });
    }

    const newQueue = await Queue.create({
      queue_name,
      clinic_id,
    });

    return res.status(201).json(newQueue);
  } catch (error) {
    console.error("Error creating queue:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

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

export const updateQueue = async (req, res) => {
  try {
    const { id } = req.params;
    const { queue_name, clinic_id, status } = req.body;

    const queue = await Queue.findByPk(id);
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    if (queue_name) queue.queue_name = queue_name;
    if (clinic_id) queue.clinic_id = clinic_id;
    if (status) queue.status = status;

    await queue.save();
    return res.json(queue);
  } catch (error) {
    console.error("Error updating queue:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const callNextInQueue = async (req, res) => {
  try {
    const queue_id = req.params.id;
    const result = await Queue.callNext(queue_id, { Ticket });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
