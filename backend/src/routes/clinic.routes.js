import express from "express";
import {
  deleteClinic,
  getAllClinics,
  getClinicById,
  updateClinic,
  getDoctorsByClinicId,
  updateDoctorQueueSettings
} from "../controllers/clinic.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clinics
 *   description: Manage clinic registrations
 *
 * components:
 *   schemas:
 *     Clinic:
 *       type: object
 *       properties:
 *         clinic_id:
 *           type: integer
 *           description: Unique identifier.
 *           example: 1
 *         clinic_name:
 *           type: string
 *           description: Clinic name.
 *           example: Kigali Health Center
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the clinic.
 *           example: contact@kigalihc.com
 *         phone_number:
 *           type: string
 *           description: Contact phone number.
 *           example: "+250788001122"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the clinic was created.
 *           example: "2024-05-01T08:30:00.000Z"
 *     ClinicPayload:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         clinic_name:
 *           type: string
 *           example: Kigali Health Center
 *         email:
 *           type: string
 *           format: email
 *           example: contact@kigalihc.com
 *         phone_number:
 *           type: string
 *           example: "+250788001122"
 *     ClinicUpdateInput:
 *       type: object
 *       properties:
 *         clinic_name:
 *           type: string
 *           example: Kigali Health Center
 *         email:
 *           type: string
 *           format: email
 *           example: contact@kigalihc.com
 *         phone_number:
 *           type: string
 *           example: "+250788001122"
 *         password:
 *           type: string
 *           format: password
 *           example: AnotherStrongPassword456
 *     ClinicResult:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Clinic updated successfully.
 *         clinic:
 *           $ref: "#/components/schemas/ClinicPayload"
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Clinic deleted successfully
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
 *                 example: Clinic not found
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
 * /api/clinics:
 *   get:
 *     summary: Get all clinics
 *     description: Retrieve a list of all clinics from the system.
 *     tags: [Clinics]
 *     responses:
 *       200:
 *         description: A list of clinics.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Clinic"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/", getAllClinics);

/**
 * @swagger
 * /api/clinics/{id}:
 *   get:
 *     summary: Get a clinic by ID
 *     tags: [Clinics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The clinic identifier.
 *     responses:
 *       200:
 *         description: Clinic retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Clinic"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/:id", getClinicById);

/**
 * @swagger
 * /api/clinics/{id}:
 *   put:
 *     summary: Update an existing clinic
 *     tags: [Clinics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The clinic identifier.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ClinicUpdateInput"
 *     responses:
 *       200:
 *         description: Clinic updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ClinicResult"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.put("/:id", updateClinic);

/**
 * @swagger
 * /api/clinics/{id}:
 *   delete:
 *     summary: Delete a clinic
 *     tags: [Clinics]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The clinic identifier.
 *     responses:
 *       200:
 *         description: Clinic deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MessageResponse"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.delete("/:id", deleteClinic);

/**
 * @swagger
 * /api/clinics/{clinic_id}/doctors:
 *   get:
 *     summary: Get doctors by clinic ID
 *     tags: [Clinics]
 *     parameters:
 *       - in: path
 *         name: clinic_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The clinic identifier.
 *     responses:
 *       200:
 *         description: A list of doctors for the clinic.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   doctor_id:
 *                     type: integer
 *                     example: 1
 *                     description: Unique ID of the doctor
 *                   clinic_id:
 *                     type: integer
 *                     example: 2
 *                     description: ID of the clinic the doctor belongs to
 *                   full_name:
 *                     type: string
 *                     example: "Dr. Jane Smith"
 *                     description: Full name of the doctor
 *                   phone_number:
 *                     type: string
 *                     example: "+250788123456"
 *                     description: Doctor's contact number
 *                   email:
 *                     type: string
 *                     example: "janesmith@example.com"
 *                     description: Doctor's email address
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-11-11T10:00:00Z"
 *                     description: Date and time when the record was created
 *       404:
 *         description: Resource not found
 *       500:
 *         description: Internal server error
 */
router.get("/:clinic_id/doctors", getDoctorsByClinicId);




export default router;
