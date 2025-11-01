import express from "express";
import {
  cancelTicket,
  createTicket,
  getTicketByIdForUser,
  getTicketsForUser,
} from "../controllers/ticket.controller.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Tickets
 *   description: Manage queue tickets for authenticated customers
 *
 * components:
 *   schemas:
 *     Ticket:
 *       type: object
 *       properties:
 *         ticket_id:
 *           type: integer
 *           example: 12
 *         ticket_number:
 *           type: string
 *           example: T-1717324000000-ABCD
 *         queue_id:
 *           type: integer
 *           example: 5
 *         status:
 *           type: string
 *           enum: [waiting, serving, completed, cancelled]
 *           example: waiting
 *         notification_contact:
 *           type: string
 *           example: "+250788001122"
 *         issued_at:
 *           type: string
 *           format: date-time
 *           example: "2024-06-02T08:45:00.000Z"
 *         served_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         estimated_wait_time:
 *           type: integer
 *           description: Estimated wait time in minutes.
 *           example: 15
 *     TicketPayload:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 12
 *         ticket_number:
 *           type: string
 *           example: T-1717324000000-ABCD
 *         queue_id:
 *           type: integer
 *           example: 5
 *         status:
 *           type: string
 *           example: waiting
 *         notification_contact:
 *           type: string
 *           example: "+250788001122"
 *         issued_at:
 *           type: string
 *           format: date-time
 *         served_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         estimated_wait_time:
 *           type: integer
 *           example: 15
 *     TicketInput:
 *       type: object
 *       required:
 *         - queue_id
 *         - notification_contact
 *       properties:
 *         queue_id:
 *           type: integer
 *           example: 5
 *         notification_contact:
 *           type: string
 *           example: "+250788001122"
 *     TicketResult:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Ticket created successfully
 *         ticket:
 *           $ref: "#/components/schemas/TicketPayload"
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Ticket cancelled successfully
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   responses:
 *     Unauthorized:
 *       description: Missing or invalid authorization token.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: No token provided
 *     Forbidden:
 *       description: Access denied.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Invalid or expired token
 *     NotFound:
 *       description: The requested ticket was not found.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Ticket not found
 *     ServerError:
 *       description: Unexpected server error.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Internal server error
 */

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get tickets for the authenticated customer
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tickets belonging to the authenticated customer.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/TicketPayload"
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/", getTicketsForUser);

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get a ticket by ID (authenticated customer only)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ticket identifier.
 *     responses:
 *       200:
 *         description: Ticket retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TicketPayload"
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/:id", getTicketByIdForUser);

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create a new ticket for the authenticated customer
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
 *               $ref: "#/components/schemas/TicketResult"
 *       400:
 *         description: Missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: queue_id and notification_contact are required.
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 *       404:
 *         description: Queue not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Queue not found
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.post("/", createTicket);

/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     summary: Cancel a ticket belonging to the authenticated customer
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ticket identifier.
 *     responses:
 *       200:
 *         description: Ticket cancelled successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TicketResult"
 *       400:
 *         description: Ticket cannot be cancelled.
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.delete("/:id", cancelTicket);

export default router;
