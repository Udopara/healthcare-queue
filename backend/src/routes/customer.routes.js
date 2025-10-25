import express from "express";
import { createCustomer, getAllCustomers, updateCustomer, deleteCustomer, getCustomerById } from "../controllers/customer.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Manage customer registrations
 *
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         customer_id:
 *           type: integer
 *           description: Unique identifier.
 *           example: 1
 *         full_name:
 *           type: string
 *           description: Full name of the customer.
 *           example: Jane Doe
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the customer.
 *           example: jane@example.com
 *         phone_number:
 *           type: string
 *           description: Contact phone number.
 *           example: "+250788000111"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the customer was created.
 *           example: "2024-05-01T08:30:00.000Z"
 *     CustomerPayload:
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
 *     CustomerInput:
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
 *     CustomerUpdateInput:
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
 *     CustomerResult:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Customer created successfully.
 *         customer:
 *           $ref: "#/components/schemas/CustomerPayload"
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Customer deleted successfully
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
 *                 example: Customer not found
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
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     description: Retrieve a list of all customers from the system.
 *     tags: [Customers]
 *     responses:
 *       200:
 *         description: A list of customers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Customer"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/", getAllCustomers);

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Register a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CustomerInput"
 *     responses:
 *       201:
 *         description: Customer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CustomerResult"
 *       400:
 *         $ref: "#/components/responses/ValidationError"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.post("/", createCustomer);


/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The customer identifier.
 *     responses:
 *       200:
 *         description: Customer retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Customer"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/:id", getCustomerById);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update an existing customer
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The customer identifier.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CustomerUpdateInput"
 *     responses:
 *       200:
 *         description: Customer updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/CustomerResult"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.put("/:id", updateCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete a customer
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The customer identifier.
 *     responses:
 *       200:
 *         description: Customer deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MessageResponse"
 *       404:
 *         $ref: "#/components/responses/NotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.delete("/:id", deleteCustomer);


export default router;
