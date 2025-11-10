import { User, PasswordResetToken } from "../models/index.js";
import { createAuthToken } from "../utils.js";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../utils/email.js";

const ALLOWED_ROLES = ["admin", "clinic", "doctor", "patient"];

const buildUserPayload = (user) => ({
  id: user.user_id ?? user.id,
  name: user.name,
  email: user.email,
  phone_number: user.phone_number,
  role: user.role,
  linked_entity_id: user.linked_entity_id,
});

export const register = async (req, res) => {
  const { name, email, phone_number, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res
      .status(400)
      .json({ message: "name, email, password, and role are required" });
  }

  if (!ALLOWED_ROLES.includes(role)) {
    return res.status(400).json({ message: "Invalid role supplied" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({
      name,
      email,
      phone_number,
      password,
      role,
    });

    const payload = buildUserPayload(user);
    const token = createAuthToken({
      id: payload.id,
      email: payload.email,
      role: payload.role,
      linked_entity_id: payload.linked_entity_id,
    });

    return res.status(201).json({
      token,
      user: payload,
    });
  } catch (error) {
    console.error("Register user error:", error);
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ message: error.errors?.[0]?.message ?? "Validation error" });
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({
          message:
            error.errors?.[0]?.message ?? "A user with provided details already exists",
        });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await user.checkPassword(password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const payload = buildUserPayload(user);
    const token = createAuthToken({
      id: payload.id,
      email: payload.email,
      role: payload.role,
      linked_entity_id: payload.linked_entity_id,
    });

    return res.json({
      token,
      user: payload,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      // For privacy, return success even if not found
      return res.json({ message: "If that email exists, a reset link was sent" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await PasswordResetToken.create({
      email,
      user_role: user.role,
      token,
      expires_at: expiresAt,
    });

    const appUrl = process.env.APP_URL || process.env.FRONTEND_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    try {
      await sendPasswordResetEmail(email, user.name, resetUrl);
      console.log(`✅ Password reset email sent successfully to ${email}`);
    } catch (mailErr) {
      console.error("❌ Failed to send reset email:", mailErr);
      console.error("   Full error:", JSON.stringify(mailErr, null, 2));
      
      // If email fails, we should still return an error or at least log it properly
      // But for security, we still return a generic message
      // However, log the actual error for debugging
      return res.status(500).json({ 
        message: "Failed to send reset email. Please try again later or contact support.",
        error: process.env.NODE_ENV === "development" ? mailErr.message : undefined
      });
    }

    return res.json({ message: "If that email exists, a reset link was sent" });
  } catch (error) {
    console.error("Request password reset error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "token and password are required" });
  }

  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  try {
    const record = await PasswordResetToken.findOne({ where: { token } });
    if (!record || record.used) {
      return res.status(400).json({ message: "Invalid or used token" });
    }

    if (new Date(record.expires_at).getTime() < Date.now()) {
      return res.status(400).json({ message: "Token has expired" });
    }

    const user = await User.findOne({ where: { email: record.email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = password;
    await user.save();

    record.used = true;
    await record.save();

    return res.json({ message: "Password has been reset" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getCurrentUser = async (req, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      user: buildUserPayload(user),
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
