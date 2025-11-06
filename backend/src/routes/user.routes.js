import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from "../controllers/user.controller.js";
import { authenticateToken } from "../middlewares/auth.js";

const router = express.Router();

router.use(authenticateToken);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Manage platform users
 *
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           description: Unique identifier.
 *         name:
 *           type: string
 *           description: Full name of the user.
 *         email:
 *           type: string
 *           format: email
 *         phone_number:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, clinic, doctor, patient]
 *         linked_entity_id:
 *           type: integer
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *     UserCreateInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone_number:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, clinic, doctor, patient]
 *         password:
 *           type: string
 *           format: password
 *     UserUpdateInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         phone_number:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, clinic, doctor, patient]
 *     MessageResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *   responses:
 *     UserNotFound:
 *       description: User not found.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/MessageResponse"
 *     ValidationError:
 *       description: Invalid or missing fields supplied.
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
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/User"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/", getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       404:
 *         $ref: "#/components/responses/UserNotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.get("/:id", getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserUpdateInput"
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         $ref: "#/components/responses/ValidationError"
 *       404:
 *         $ref: "#/components/responses/UserNotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.put("/:id", updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MessageResponse"
 *       404:
 *         $ref: "#/components/responses/UserNotFound"
 *       500:
 *         $ref: "#/components/responses/ServerError"
 */
router.delete("/:id", deleteUser);

export default router;
