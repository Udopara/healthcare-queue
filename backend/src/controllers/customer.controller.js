import { Customer } from "../models/index.js";

export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    const customerData = customers.map((customer) => {
      return {
        id: customer.customer_id,
        full_name: customer.full_name,
        email: customer.email,
        phone_number: customer.phone_number,
      };
    });
    return res.json(customerData);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await Customer.findByPk(id);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const customerData = {
      id: customer.customer_id,
      full_name: customer.full_name,
      email: customer.email,
      phone_number: customer.phone_number,
    };

    return res.json(customerData);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, phone_number, password } = req.body;

    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await customer.update({
      full_name: full_name ?? customer.full_name,
      email: email ?? customer.email,
      phone_number: phone_number ?? customer.phone_number,
      password: password ?? customer.password,
    });

    return res.status(200).json({
      message: "Customer updated successfully",
      customer: {
        id: customer.customer_id,
        full_name: customer.full_name,
        email: customer.email,
        phone_number: customer.phone_number,
      },
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    await customer.destroy();

    return res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};