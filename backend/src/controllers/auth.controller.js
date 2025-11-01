import { Customer, Clinic } from "../models/index.js";
import { createAuthToken } from "../utils.js";

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

//TODO: Implement password reset functionality
