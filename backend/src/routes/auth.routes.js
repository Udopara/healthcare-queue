import express from "express";
import {
  loginClinic,
  loginCustomer,
  registerClinic,
  registerCustomer,
} from "../controllers/auth.controller.js";
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints for customers and clinics
 *
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: mySecurePassword123
 *     LoginResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JSON Web Token for authenticated requests.
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: User registered
 *   responses:
 *     Unauthorized:
 *       description: Invalid credentials.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Invalid password
 *     NotFound:
 *       description: Provided account was not found.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Customer not found
 *     ServerError:
 *       description: Unexpected server error.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               message:
 *                 type: string
 *                 example: Server error
 */

/**
 * @swagger
 * /api/auth/register/customer:
 *   post:
 *     summary: Register a new customer
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - password
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane.doe@example.com
 *               phone_number:
 *                 type: string
 *                 example: "+250781234567"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: StrongPassword123
 *     responses:
 *       201:
 *         description: Customer registered successfully.
 *       400:
 *         description: Missing or invalid fields.
 *       409:
 *         description: Email already registered.
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.post("/register/customer", registerCustomer);

/**
 * @swagger
 * /api/auth/register/clinic:
 *   post:
 *     summary: Register a new clinic
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clinic_name
 *               - email
 *               - password
 *             properties:
 *               clinic_name:
 *                 type: string
 *                 example: Downtown Health Center
 *               email:
 *                 type: string
 *                 format: email
 *                 example: contact@dhc.com
 *               phone_number:
 *                 type: string
 *                 example: "+250780000000"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: ClinicStrongPassword123
 *     responses:
 *       201:
 *         description: Clinic registered successfully.
 *       400:
 *         description: Missing or invalid fields.
 *       409:
 *         description: Email already registered.
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.post("/register/clinic", registerClinic);

/**
 * @swagger
 * /api/auth/login/customer:
 *   post:
 *     summary: Login customer
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginRequest"
 *     responses:
 *       200:
 *         description: Customer authenticated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LoginResponse"
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.post("/login/customer", loginCustomer);

/**
 * @swagger
 * /api/auth/login/clinic:
 *   post:
 *     summary: Login clinic
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LoginRequest"
 *     responses:
 *       200:
 *         description: Clinic authenticated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LoginResponse"
 *       401:
 *         $ref: "#/components/responses/Unauthorized"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.post("/login/clinic", loginClinic);

export default router;
