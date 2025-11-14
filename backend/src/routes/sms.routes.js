import express from "express";
import { sendMessage } from "../controllers/sms.controller.js";

const router = express.Router();

router.post("/", sendMessage)

export default router;
