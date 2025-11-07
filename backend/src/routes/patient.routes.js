import express from "express";
import {
  getAllPatients,
  updatePatient,
  deletePatient,
  getPatientById,
} from "../controllers/patient.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: Manage patient registrations
 *
 * components:
 *   schemas:
 *     Patient:
 *       type: object
 *       properties:
 *         patient_id:
 *           type: integer
 *           description: Unique identifier.
 *           example: 1
 *         full_name:
 *           type: string
 *           description: Full name of the patient.
 *           example: Jane Doe
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the patient.
 *           example: jane@example.com
 *         phone_number:
 *           type: string
 *           description: Contact phone number.
 *           example: "+250788000111"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the patient was created.
 *           example: "2024-05-01T08:30:00.000Z"
 *     PatientPayload:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         full_name:
 *           type: string
 *           example: Jane Doe
 *         email:
 *           type: string
 *           format: email
 *           example: jane@example.com
 *         phone_number:
 *           type: string
 *           example: "+250788000111"
 *     PatientInput:
 *       type: object
 *       required:
 *         - full_name
 *         - email
 *         - password
 *       properties:
 *         full_name:
 *           type: string
 *           example: Jane Doe
 *         email:
 *           type: string
 *           format: email
 *           example: jane@example.com
 *         phone_number:
 *           type: string
 *           example: "+250788000111"
 *         password:
 *           type: string
 *           format: password
 *           example: mypassword123
 *     PatientUpdateInput:
 *       type: object
 *       properties:
 *         full_name:
 *           type: string
 *           example: Jane Doe
 *         email:
 *           type: string
 *           format: email
 *           example: jane@example.com
 *         phone_number:
 *           type: string
 *           example: "+250788000111"
 *         password:
 *           type: string
 *           format: password
 *           example: anotherPassword456
 *     PatientResult:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Patient created successfully.
 *         patient:
 *           $ref: "#/components/schemas/PatientPayload"
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Patient deleted successfully
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
 *                 example: Patient not found
 *     ValidationError:
 *       description: Missing or invalid fields were supplied.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Full name, email, and password are required.
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
 * /api/patients:
 *   get:
 *     summary: Get all patients
 *     description: Retrieve a list of all patients from the system.
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: A list of patients.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Patient"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/", getAllPatients);

/**
 * @swagger
 * /api/patients/{id}:
 *   get:
 *     summary: Get a patient by ID
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The patient identifier.
 *     responses:
 *       200:
 *         description: Patient retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Patient"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/:id", getPatientById);

/**
 * @swagger
 * /api/patients/{id}:
 *   put:
 *     summary: Update an existing patient
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The patient identifier.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/PatientUpdateInput"
 *     responses:
 *       200:
 *         description: Patient updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PatientResult"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.put("/:id", updatePatient);

/**
 * @swagger
 * /api/patients/{id}:
 *   delete:
 *     summary: Delete a patient
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The patient identifier.
 *     responses:
 *       200:
 *         description: Patient deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MessageResponse"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.delete("/:id", deletePatient);


export default router;
