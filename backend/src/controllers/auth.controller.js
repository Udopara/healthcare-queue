import { Customer, Clinic, PasswordResetToken } from "../models/index.js";
import { createAuthToken } from "../utils.js";
import crypto from "crypto";
import { sendPasswordResetEmail } from "../utils/email.js";

export const registerCustomer = async (req, res) => {
  const { full_name, email, phone_number, password } = req.body;

  if (!full_name || !email || !password) {
    return res
      .status(400)
      .json({ message: "full_name, email and password are required" });
  }

  try {
    const existingCustomer = await Customer.findOne({ where: { email } });
    if (existingCustomer) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const customer = await Customer.create({
      full_name,
      email,
      phone_number,
      password,
    });

    const customerId = customer.customer_id ?? customer.id;
    const token = createAuthToken({
      id: customerId,
      email: customer.email,
      role: "customer",
    });

    return res.status(201).json({
      token,
      customer: {
        id: customerId,
        full_name: customer.full_name,
        email: customer.email,
        phone_number: customer.phone_number,
      },
    });
  } catch (error) {
    console.error("Register customer error:", error);
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ message: error.errors?.[0]?.message ?? "Validation error" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

export const registerClinic = async (req, res) => {
  const { clinic_name, email, phone_number, password } = req.body;

  if (!clinic_name || !email || !password) {
    return res
      .status(400)
      .json({ message: "clinic_name, email and password are required" });
  }

  try {
    const existingClinic = await Clinic.findOne({ where: { email } });
    if (existingClinic) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const clinic = await Clinic.create({
      clinic_name,
      email,
      phone_number,
      password,
    });

    const clinicId = clinic.clinic_id ?? clinic.id;
    const token = createAuthToken({
      id: clinicId,
      email: clinic.email,
      role: "clinic",
    });

    return res.status(201).json({
      token,
      clinic: {
        id: clinicId,
        clinic_name: clinic.clinic_name,
        email: clinic.email,
        phone_number: clinic.phone_number,
      },
    });
  } catch (error) {
    console.error("Register clinic error:", error);
    if (error.name === "SequelizeValidationError") {
      return res
        .status(400)
        .json({ message: error.errors?.[0]?.message ?? "Validation error" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginCustomer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const customer = await Customer.findOne({ where: { email } });
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const validPassword = customer.confirmPassword(password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const customerId = customer.customer_id ?? customer.id;
    const token = createAuthToken({
      id: customerId,
      email: customer.email,
      role: "customer"
    });

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginClinic = async (req, res) => {
  const { email } = req.body;

  try {
    const clinic = await Clinic.findOne({ where: { email } });
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    const validPassword = clinic.confirmPassword(req.body.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const clinicId = clinic.clinic_id ?? clinic.id;
    const token = createAuthToken({
      id: clinicId,
      email: clinic.email,
      role: "clinic"
    });

    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "email is required" });
  }

  try {
    const customer = await Customer.findOne({ where: { email } });
    const clinic = customer ? null : await Clinic.findOne({ where: { email } });

    if (!customer && !clinic) {
      // For privacy, return success even if not found
      return res.json({ message: "If that email exists, a reset link was sent" });
    }

    const role = customer ? "customer" : "clinic";
    const name = customer ? customer.full_name : clinic.clinic_name;

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await PasswordResetToken.create({
      email,
      user_role: role,
      token,
      expires_at: expiresAt,
    });

    const appUrl = process.env.APP_URL || process.env.FRONTEND_URL || "http://localhost:3000";
    const resetUrl = `${appUrl}/reset-password?token=${token}`;

    try {
      await sendPasswordResetEmail(email, name, resetUrl);
    } catch (mailErr) {
      console.error("Failed to send reset email:", mailErr);
      // Still respond generically
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

    if (record.user_role === "customer") {
      const customer = await Customer.findOne({ where: { email: record.email } });
      if (!customer) {
        return res.status(404).json({ message: "Account not found" });
      }
      customer.password = password;
      await customer.save();
    } else if (record.user_role === "clinic") {
      const clinic = await Clinic.findOne({ where: { email: record.email } });
      if (!clinic) {
        return res.status(404).json({ message: "Account not found" });
      }
      clinic.password = password;
      await clinic.save();
    } else {
      return res.status(400).json({ message: "Invalid token context" });
    }

    record.used = true;
    await record.save();

    return res.json({ message: "Password has been reset" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
