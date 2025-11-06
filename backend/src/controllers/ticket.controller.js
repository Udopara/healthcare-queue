import { Ticket, Queue, User } from "../models/index.js";

const mapTicketResponse = (ticket) => ({
  id: ticket.ticket_id,
  ticket_number: ticket.ticket_number,
  queue_id: ticket.queue_id,
  status: ticket.status,
  notification_contact: ticket.notification_contact,
  issued_at: ticket.issued_at,
  served_at: ticket.served_at,
  estimated_wait_time: ticket.estimated_wait_time,
});

const getPatientId = async (userId) => {
  const user = await User.findByPk(userId);
  return user?.linked_entity_id || null;
};

const ensureAuthenticatedUser = (req, res) => {
  if (!req.user?.id) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }
  return req.user.id;
};

export const createTicket = async (req, res) => {
  const userId = ensureAuthenticatedUser(req, res);
  if (userId === null) return;

  if (req.user.role !== "patient") {
    return res
      .status(403)
      .json({ message: "Forbidden: Only patients can create tickets" });
  }

  const patientId = await getPatientId(userId);
  const { queue_id, notification_contact } = req.body;

  if (!queue_id || !notification_contact) {
    return res
      .status(400)
      .json({ message: "queue_id and notification_contact are required." });
  }

  try {
    const queue = await Queue.findByPk(queue_id);
    if (!queue) {
      return res.status(404).json({ message: "Queue not found" });
    }

    let ticket = null;
    let attempts = 0;

    while (!ticket && attempts < 3) {
      attempts += 1;
      try {
        ticket = await Ticket.create({
          queue_id,
          patient_id: patientId,
          notification_contact,
        });
      } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError" && attempts < 3) {
          continue;
        }
        throw error;
      }
    }

    if (!ticket) {
      return res.status(500).json({ message: "Unable to create ticket" });
    }

    return res.status(201).json({
      message: "Ticket created successfully",
      ticket: mapTicketResponse(ticket),
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTickets = async (req, res) => {
  const { role } = req.user;
  const userId = ensureAuthenticatedUser(req, res);
  if (userId === null) return;

  const patientId = await getPatientId(userId);

  if (["doctor", "clinic"].includes(role)) {
    return res
      .status(403)
      .json({ message: "Forbidden: Access is denied for this role" });
  }

  if (role === "admin") {
    try {
      const tickets = await Ticket.findAll({
        order: [["issued_at", "DESC"]],
      });

      return res.json(tickets.map(mapTicketResponse));
    } catch (error) {
      console.error("Error fetching tickets for admin:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (role === "patient") {
    try {
      const tickets = await Ticket.findAll({
        where: { patient_id: patientId },
        order: [["issued_at", "DESC"]],
      });

      return res.json(tickets.map(mapTicketResponse));
    } catch (error) {
      console.error("Error fetching tickets:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const getTicketById = async (req, res) => {
  const { role } = req.user;
  const userId = ensureAuthenticatedUser(req, res);
  if (userId === null) {
    return;
  }

  if (["doctor", "clinic"].includes(role)) {
    return res
      .status(403)
      .json({ message: "Forbidden: Access is denied for this role" });
  }

  if (role === "admin") {
    try {
      const { id } = req.params;
      const ticket = await Ticket.findByPk(id);

      if (!ticket) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      return res.json(mapTicketResponse(ticket));
    } catch (error) {
      console.error("Error fetching ticket for admin:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  if (role === "patient") {
    try {
      const { id } = req.params;
      const ticket = await Ticket.findByPk(id);

      if (!ticket || ticket.patient_id !== patientId) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      return res.json(mapTicketResponse(ticket));
    } catch (error) {
      console.error("Error fetching ticket:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};

export const cancelTicket = async (req, res) => {
  const { role } = req.user;
  const userId = ensureAuthenticatedUser(req, res);
  const patientId = await getPatientId(userId);
  if (userId === null) {
    return;
  }

  if (["doctor", "clinic"].includes(role)) {
    return res
      .status(403)
      .json({ message: "Forbidden: Only patients can cancel tickets" });
  }

  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    
    if (ticket.patient_id !== patientId) {
      return res
        .status(403)
        .json({ message: "Forbidden: You can only cancel your own tickets" });
    }

    if (ticket.status === "completed") {
      return res
        .status(400)
        .json({ message: "Completed tickets cannot be cancelled" });
    }

    ticket.status = "cancelled";
    await ticket.save();

    return res.json({
      message: "Ticket cancelled successfully",
      ticket: mapTicketResponse(ticket),
    });
  } catch (error) {
    console.error("Error cancelling ticket:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
