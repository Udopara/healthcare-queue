import express from "express";
import { Doctor } from "../models/index.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: Manage doctors
 *
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       properties:
 *         doctor_id:
 *           type: integer
 *           example: 1
 *         full_name:
 *           type: string
 *           example: Dr. John Doe
 *         department:
 *           type: string
 *           example: Cardiology
 *         availability:
 *           type: string
 *           example: Available
 *         phone_number:
 *           type: string
 *           example: "+123456789"
 *         email:
 *           type: string
 *           example: doctor@example.com
 *         img_src:
 *           type: string
 *           example: "https://someurl.com/doctor.jpg"
 *         img_alt:
 *           type: string
 *           example: "Doctor profile image"
 */

/**
 * @swagger
 * /api/doctors:
 *   get:
 *     summary: Get all doctors
 *     description: Retrieve a list of all doctors.
 *     tags: [Doctors]
 *     responses:
 *       200:
 *         description: A list of doctors.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Doctor"
 *       500:
 *         description: Server error
 */
router.get("/", async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
});

export default router;