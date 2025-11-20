import { User } from "../models/index.js";

const ALLOWED_ROLES = ["admin", "clinic", "doctor", "patient"];

// Formats user data for API responses
const toUserResponse = (userInstance) => ({
  id: userInstance.user_id ?? userInstance.id,
  name: userInstance.name,
  email: userInstance.email,
  phone_number: userInstance.phone_number,
  role: userInstance.role,
  linked_entity_id: userInstance.linked_entity_id,
  created_at: userInstance.created_at,
});

// Returns all users in the system
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.json(users.map(toUserResponse));
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Gets a single user by their ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(toUserResponse(user));
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Updates user details - validates role if provided
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone_number, role } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (role && !ALLOWED_ROLES.includes(role)) {
      return res
        .status(400)
        .json({ message: "role must be one of admin, clinic, doctor, patient" });
    }

    await user.update({
      name: name ?? user.name,
      phone_number: phone_number ?? user.phone_number,
      role: role ?? user.role,
    });

    return res.json({
      message: "User updated successfully",
      user: toUserResponse(user),
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Deletes a user from the system
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.destroy();
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
