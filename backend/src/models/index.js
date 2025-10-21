import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import UserModel from "./user.model.js";
import QueueModel from "./queue.model.js";
import CustomerModel from "./customer.model.js";
import TicketModel from "./ticket.model.js";

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

const User = UserModel(sequelize);
const Queue = QueueModel(sequelize);
const Customer = CustomerModel(sequelize);
const Ticket = TicketModel(sequelize);

// ====== Associations ======
User.hasMany(Queue, { foreignKey: "user_id", onDelete: "CASCADE" });
Queue.belongsTo(User, { foreignKey: "user_id" });

Queue.hasMany(Ticket, { foreignKey: "queue_id", onDelete: "CASCADE" });
Ticket.belongsTo(Queue, { foreignKey: "queue_id" });

Customer.hasMany(Ticket, { foreignKey: "customer_id", onDelete: "SET NULL" });
Ticket.belongsTo(Customer, { foreignKey: "customer_id" });

export { sequelize, User, Queue, Customer, Ticket };
