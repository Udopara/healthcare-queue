import express from "express";
import { createQueue, getAllQueues, getQueueById, updateQueue, deleteQueue } from "../controllers/queue.controller.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Queues
 *   description: Manage queue registration and status per clinic
 *
 * components:
 *   schemas:
 *     Queue:
 *       type: object
 *       properties:
 *         queue_id:
 *           type: integer
 *           description: Unique identifier.
 *           example: 5
 *         queue_name:
 *           type: string
 *           description: Display name of the queue.
 *           example: General Consultation
 *         status:
 *           type: string
 *           enum: [open, closed, paused]
 *           description: Current queue status.
 *           example: open
 *         clinic_id:
 *           type: integer
 *           description: Clinic that owns the queue.
 *           example: 2
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: When the queue record was created.
 *           example: "2024-05-02T10:15:00.000Z"
 *     QueueInput:
 *       type: object
 *       required:
 *         - queue_name
 *         - clinic_id
 *       properties:
 *         queue_name:
 *           type: string
 *           description: Queue display name.
 *           example: General Consultation
 *         clinic_id:
 *           type: integer
 *           description: Clinic that owns the queue.
 *           example: 2
 *     QueueUpdateInput:
 *       type: object
 *       properties:
 *         queue_name:
 *           type: string
 *           example: Emergency
 *         clinic_id:
 *           type: integer
 *           example: 4
 *         status:
 *           type: string
 *           enum: [open, closed, paused]
 *           example: paused
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Queue deleted successfully.
 *   responses:
 *     NotFound:
 *       description: The requested resource was not found.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Queue not found
 *     ValidationError:
 *       description: Missing or invalid fields were supplied.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: queue_name and clinic_id are required.
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
 * /api/queues:
 *   get:
 *     summary: Get all queues
 *     tags: [Queues]
 *     parameters:
 *       - in: query
 *         name: clinic_id
 *         required: false
 *         schema:
 *           type: integer
 *         description: Filter queues by clinic identifier.
 *     responses:
 *       200:
 *         description: A list of queues.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Queue"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/", getAllQueues);

/**
 * @swagger
 * /api/queues/{id}:
 *   get:
 *     summary: Get queue by ID
 *     tags: [Queues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Queue identifier.
 *     responses:
 *       200:
 *         description: Queue retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Queue"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/:id", getQueueById);

/**
 * @swagger
 * /api/queues:
 *   post:
 *     summary: Create a new queue
 *     tags: [Queues]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/QueueInput"
 *     responses:
 *       201:
 *         description: Queue created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Queue"
 *       400:
 *         $ref: "#/components/responses/ValidationError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.post("/", createQueue);

/**
 * @swagger
 * /api/queues/{id}:
 *   put:
 *     summary: Update an existing queue
 *     tags: [Queues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Queue identifier.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/QueueUpdateInput"
 *     responses:
 *       200:
 *         description: Queue updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Queue"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.put("/:id", updateQueue);

/**
 * @swagger
 * /api/queues/{id}:
 *   delete:
 *     summary: Delete a queue
 *     tags: [Queues]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Queue identifier.
 *     responses:
 *       200:
 *         description: Queue deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MessageResponse"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.delete("/:id", deleteQueue);

export default router;
