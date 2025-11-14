import { DataTypes, Op } from "sequelize";

const { STRING, INTEGER, DATE, NOW, ENUM } = DataTypes;

export default (sequelize) => {
  const Ticket = sequelize.define(
    "Ticket",
    {
      ticket_id: {
        type: STRING(20),
        primaryKey: true,
      },
      queue_id: {
        type: INTEGER,
        allowNull: false,
      },
      patient_id: {
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

      hooks: {
        // Generates a unique ticket ID in format: queue_id-MMYY-#### before creating
        beforeCreate: async (ticket) => {
          const now = new Date();
          const month = String(now.getMonth() + 1).padStart(2, "0");
          const year = String(now.getFullYear()).slice(-2);
          const prefix = `${ticket.queue_id}-${month}${year}`
          
          const lastTicket = await sequelize.models.Ticket.findOne({
            where: {
              ticket_id: {
                [Op.like]: `${prefix}-%`,
              },
            },
            order: [["ticket_id", "DESC"]],
          });

          let nextSeq = 1;
          if (lastTicket) {
            const lastSeq = parseInt(lastTicket.ticket_id.split("-")[2], 10);
            if (!isNaN(lastSeq)) nextSeq = lastSeq + 1;
          }

          const formattedSeq = String(nextSeq).padStart(4, "0");
          ticket.ticket_id = `${prefix}-${formattedSeq}`;
        },
      },
    }
  );

  return Ticket;
};
