import { Patient } from "../models/index.js";

export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.findAll();
    const patientData = patients.map((patient) => {
      return {
        id: patient.patient_id,
        full_name: patient.full_name,
        email: patient.email,
        phone_number: patient.phone_number,
      };
    });
    return res.json(patientData);
  } catch (error) {
    console.error("Error fetching patients:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await Patient.findByPk(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const patientData = {
      id: patient.patient_id,
      full_name: patient.full_name,
      email: patient.email,
      phone_number: patient.phone_number,
    };

    return res.json(patientData);
  } catch (error) {
    console.error("Error fetching patient:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, email, phone_number, password } = req.body;

    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    await patient.update({
      full_name: full_name ?? patient.full_name,
      email: email ?? patient.email,
      phone_number: phone_number ?? patient.phone_number,
      password: password ?? patient.password,
    });

    return res.status(200).json({
      message: "Patient updated successfully",
      patient: {
        id: patient.patient_id,
        full_name: patient.full_name,
        email: patient.email,
        phone_number: patient.phone_number,
      },
    });
  } catch (error) {
    console.error("Error updating patient:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findByPk(id);
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    await patient.destroy();

    return res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    console.error("Error deleting patient:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
