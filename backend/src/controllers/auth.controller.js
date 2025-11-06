import { User } from "../models/index.js";
import { createAuthToken } from "../utils.js";

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

// TODO: Implement password reset functionality

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
