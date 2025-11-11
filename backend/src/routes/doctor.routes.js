import express from "express";
import {
  getAllDoctors,
  getDoctorById,
} from "../controllers/doctor.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *  name: Doctors
 *  description: Manage doctor information
 * 
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       properties:
 *         doctor_id:
 *           type: integer
 *           description: Unique identifier for the doctor.
 *           example: 1
 *         full_name:
 *           type: string
 *           description: Full name of the doctor.
 *           example: "Dr. John Smith"
 *         clinic_id:
 *           type: integer
 *           description: Identifier of the clinic the doctor is associated with.
 *           example: 2
 *         phone_number:
 *           type: string
 *           description: Contact phone number of the doctor.
 *           example: "+250788123456"
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the doctor.
 *           example: "dr.johnsmith@example.com"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the doctor was created.
 *           example: "2024-05-01T08:30:00.000Z"
 * 
 * /api/doctors:
 *   get:
 *     summary: Get all doctors
 *     tags: [Doctors]
 *     responses:
 *       200:
 *         description: List of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Doctor'
 *             example:
 *               - doctor_id: 1
 *                 full_name: "Dr. John Smith"
 *                 clinic_id: 2
 *                 phone_number: "+250788123456"
 *                 email: "dr.johnsmith@example.com"
 *                 created_at: "2024-05-01T08:30:00.000Z"
 *               - doctor_id: 2
 *                 full_name: "Dr. Jane Doe"
 *                 clinic_id: 3
 *                 phone_number: "+250788654321"
 *                 email: "dr.janedoe@example.com"
 *                 created_at: "2024-05-02T09:00:00.000Z"
 *       500:
 *         description: Internal server error
 * 
 * /api/doctors/{id}:
 *   get:
 *     summary: Get a doctor by ID
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Doctor ID
 *     responses:
 *       200:
 *         description: Doctor data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Doctor'
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */

router.get("/", getAllDoctors);

router.get("/:id", getDoctorById);

export default router;
