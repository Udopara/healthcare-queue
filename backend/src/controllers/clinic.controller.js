import { Clinic } from "../models/index.js";
import { Doctor } from "../models/index.js";

// Fetches all clinics and returns basic info (id, name, email, phone)
export const getAllClinics = async (req, res) => {
  try {
    const clinics = await Clinic.findAll();
    const clinicData = clinics.map((clinic) => ({
      id: clinic.clinic_id,
      clinic_name: clinic.clinic_name,
      email: clinic.email,
      phone_number: clinic.phone_number,
    }));

    return res.json(clinicData);
  } catch (error) {
    console.error("Error fetching clinics:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Gets a single clinic by ID
export const getClinicById = async (req, res) => {
  try {
    const { id } = req.params;
    const clinic = await Clinic.findByPk(id);

    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    const clinicData = {
      id: clinic.clinic_id,
      clinic_name: clinic.clinic_name,
      email: clinic.email,
      phone_number: clinic.phone_number,
    };

    return res.json(clinicData);
  } catch (error) {
    console.error("Error fetching clinic:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Updates clinic details - only updates fields that are provided
export const updateClinic = async (req, res) => {
  try {
    const { id } = req.params;
    const { clinic_name, email, phone_number, password } = req.body;

    const clinic = await Clinic.findByPk(id);
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    await clinic.update({
      clinic_name: clinic_name ?? clinic.clinic_name,
      email: email ?? clinic.email,
      phone_number: phone_number ?? clinic.phone_number,
      password: password ?? clinic.password,
    });

    return res.status(200).json({
      message: "Clinic updated successfully",
      clinic: {
        id: clinic.clinic_id,
        clinic_name: clinic.clinic_name,
        email: clinic.email,
        phone_number: clinic.phone_number,
      },
    });
  } catch (error) {
    console.error("Error updating clinic:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Deletes a clinic from the database
export const deleteClinic = async (req, res) => {
  try {
    const { id } = req.params;

    const clinic = await Clinic.findByPk(id);
    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    await clinic.destroy();

    return res.status(200).json({ message: "Clinic deleted successfully" });
  } catch (error) {
    console.error("Error deleting clinic:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Returns all doctors associated with a specific clinic
export const getDoctorsByClinicId = async (req, res) => {
  try {
    const { clinic_id } = req.params;
    console.log(clinic_id)
    const doctors = await Doctor.findAll({ where: { clinic_id } });
    return res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors for clinic:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Updates a doctor's max queue size setting
export const updateDoctorQueueSettings = async (req, res) => {
  try {
    const { doctor_id } = req.params;
    const { max_queue_size } = req.body;
    const doctor = await Doctor.findByPk(doctor_id);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    doctor.max_queue_size = max_queue_size;
    await doctor.save();
    return res.json({ message: "max_queue_size updated", doctor });
  } catch (error) {
    console.error("Error updating doctor's queue settings:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
