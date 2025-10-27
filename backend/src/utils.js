import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const createAuthToken = (payload, options = {}) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
    ...options,
  });
