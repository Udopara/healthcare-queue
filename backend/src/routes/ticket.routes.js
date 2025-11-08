import express from "express";
import {
  cancelTicket,
  createTicket,
  getTicketById,
  getTickets,
  updateTicketStatusByClinic,
} from "../controllers/ticket.controller.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Manage queue tickets for authenticated users (patients can manage their own tickets, admins can view all tickets).
 *
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       properties:
 *         ticket_id:
 *           type: string
 *         queue_id:
 *           type: integer
 *         patient_id:
 *           type: integer
 *         status:
 *           type: string
 *           enum: [waiting, serving, completed, cancelled]
 *         notification_contact:
 *           type: string
 *         issued_at:
 *           type: string
 *           format: date-time
 *         served_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         estimated_wait_time:
 *           type: integer
 *           nullable: true
 *     TicketInput:
 *       type: object
 *       required:
 *         - queue_id
 *         - notification_contact
 *       properties:
 *         queue_id:
 *           type: integer
 *         notification_contact:
 *           type: string
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *   responses:
 *     Unauthorized:
 *       description: Missing or invalid token.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/MessageResponse"
 *     Forbidden:
 *       description: Action is not allowed for the authenticated role.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/MessageResponse"
 *     TicketNotFound:
 *       description: Ticket not found.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/MessageResponse"
 *     ServerError:
 *       description: Unexpected server error.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/MessageResponse"
 */

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get tickets for the authenticated user
 *     description: Patients receive only their tickets; admins receive all tickets.
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tickets retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Ticket"
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/", getTickets);

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get a ticket by ID
 *     description: Admins can access any ticket; patients can only access their own tickets.
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Ticket"
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 *       404:
 *         $ref: "#/components/responses/TicketNotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/:id", getTicketById);

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create a new ticket
 *     description: Only patient accounts may create tickets for themselves.
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/TicketInput"
 *     responses:
 *       201:
 *         description: Ticket created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Ticket"
 *       400:
 *         description: queue_id or notification_contact missing.
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 *       403:
 *         $ref: "#/components/responses/Forbidden"
 *       404:
 *         description: Queue not found.
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.post("/", createTicket);

/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     summary: Cancel a ticket
 *     description: Only patient accounts may cancel their own tickets.
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket cancelled successfully.
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 *       403:
 *         $ref: "#/components/responses/Forbidden"
 *       404:
 *         $ref: "#/components/responses/TicketNotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.delete("/:id", cancelTicket);

/**
 * @swagger
 * /api/tickets/{id}/status:
 *   put:
 *     summary: Update ticket status (clinic only)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [waiting, serving, completed, cancelled]
 *     responses:
 *       200:
 *         description: Ticket status updated.
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 *       403:
 *         description: Only clinics can update ticket status
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.put("/:id/status", authenticateToken, updateTicketStatusByClinic);

export default router;
