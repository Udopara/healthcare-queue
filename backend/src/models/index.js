import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import ClinicModel from "./clinic.model.js";
import QueueModel from "./queue.model.js";
import PatientModel from "./patient.model.js";
import DoctorModel from "./doctor.model.js";
import TicketModel from "./ticket.model.js";
import UserModel from "./user.model.js";
import PasswordResetTokenModel from "./password_reset_token.model.js";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

const Clinic = ClinicModel(sequelize);
const Queue = QueueModel(sequelize);
const Patient = PatientModel(sequelize);
const Doctor = DoctorModel(sequelize);
const Ticket = TicketModel(sequelize);
const User = UserModel(sequelize);
const PasswordResetToken = PasswordResetTokenModel(sequelize);

Clinic.hasMany(Queue, { foreignKey: "clinic_id", onDelete: "CASCADE" });
Queue.belongsTo(Clinic, { foreignKey: "clinic_id" });

Doctor.hasMany(Queue, { foreignKey: "doctor_id", onDelete: "SET NULL" });
Queue.belongsTo(Doctor, { foreignKey: "doctor_id" });

Queue.hasMany(Ticket, { foreignKey: "queue_id", onDelete: "CASCADE" });
Ticket.belongsTo(Queue, { foreignKey: "queue_id" });

Patient.hasMany(Ticket, { foreignKey: "patient_id", onDelete: "SET NULL" });
Ticket.belongsTo(Patient, { foreignKey: "patient_id" });

export { sequelize, Clinic, Queue, Patient, Doctor, Ticket, User, PasswordResetToken };
