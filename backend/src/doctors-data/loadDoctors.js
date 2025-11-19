import dotenv from "dotenv";
dotenv.config();

import { sequelize, Doctor } from "../models/index.js";
import { doctors } from "../doctors-data/doctors.js"

const loadDoctors = async () => {
  try {
    await Doctor.sync({ force: true });
    console.log("Doctor table synced.");

    for (const doc of doctors) {
      await Doctor.create({
        full_name: doc.name,
        department: doc.department,
        availability: doc.Availability,
        external_id: doc.Id,
        img_src: doc.img.src,
        img_alt: doc.img.alt,
        clinic_id: null,
      });
    }

    console.log("Doctors inserted!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

loadDoctors();