import { DataTypes } from "sequelize";

const { STRING, INTEGER, DATE, NOW, ENUM } = DataTypes;

export default (sequelize) => {
  const Ticket = sequelize.define(
    "Ticket",
    {
      ticket_id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ticket_number: {
        type: STRING(20),
        unique: true,
        allowNull: false,
      },
      queue_id: {
        type: INTEGER,
        allowNull: false,
      },
      customer_id: {
        type: INTEGER,
        allowNull: true,
      },
      notification_contact: {
        type: STRING(100),
        allowNull: false,
      },
      status: {
        type: ENUM("waiting", "serving", "completed", "cancelled"),
        defaultValue: "waiting",
      },
      issued_at: {
        type: DATE,
        defaultValue: NOW,
      },
      served_at: {
        type: DATE,
        allowNull: true,
      },
      estimated_wait_time: {
        type: INTEGER,
      },
    },
    {
      tableName: "Ticket",
      timestamps: false,
    }
  );

  return Ticket;
};
