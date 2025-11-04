import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import ClinicModel from "./clinic.model.js";
import QueueModel from "./queue.model.js";
import CustomerModel from "./customer.model.js";
import TicketModel from "./ticket.model.js";
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
const Customer = CustomerModel(sequelize);
const Ticket = TicketModel(sequelize);
const PasswordResetToken = PasswordResetTokenModel(sequelize);

// ====== Associations ======
Clinic.hasMany(Queue, { foreignKey: "clinic_id", onDelete: "CASCADE" });
Queue.belongsTo(Clinic, { foreignKey: "clinic_id" });

Queue.hasMany(Ticket, { foreignKey: "queue_id", onDelete: "CASCADE" });
Ticket.belongsTo(Queue, { foreignKey: "queue_id" });

Customer.hasMany(Ticket, { foreignKey: "customer_id", onDelete: "SET NULL" });
Ticket.belongsTo(Customer, { foreignKey: "customer_id" });

export { sequelize, Clinic, Queue, Customer, Ticket, PasswordResetToken };
