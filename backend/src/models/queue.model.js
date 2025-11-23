import { DataTypes } from "sequelize";

const { STRING, INTEGER, DATE, NOW, ENUM } = DataTypes;

export default (sequelize) => {
  const Queue = sequelize.define(
    "Queue",
    {
      queue_id: {
        type: INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      queue_name: {
        type: STRING(100),
        allowNull: false,
      },
      status: {
        type: ENUM("open", "closed", "paused"),
        defaultValue: "open",
      },
      clinic_id: {
        type: INTEGER,
        allowNull: false,
      },
      doctor_id: {
        type: INTEGER,
        allowNull: true,
        comment: "ID of the doctor who created this queue (null if created by clinic)",
      },
      current_ticket_id: {
        type: STRING(20),
        defaultValue: null,
      },
      max_number:{
        type: INTEGER,
        allowNull: false,
      },
      created_at: {
        type: DATE,
        defaultValue: NOW,
      },
    },
    {
      tableName: "Queue",
      timestamps: false,     
    }
  );

   // Marks current ticket as completed and moves the next waiting ticket to serving
   Queue.callNext = async function (queue_id, models) {
     const { Ticket } = models;

     const queue = await Queue.findByPk(queue_id);
     if (!queue) throw new Error("Queue not found");

     if (queue.current_ticket_id) {
       const currentTicket = await Ticket.findOne({
         where: { ticket_id: queue.current_ticket_id },
       });
       if (currentTicket) {
         currentTicket.status = "completed";
         await currentTicket.save();
       }
     }

     const nextTicket = await Ticket.findOne({
       where: {
         queue_id,
         status: "waiting",
       },
       order: [["ticket_id", "ASC"]],
     });

     if (!nextTicket) {
       queue.current_ticket_id = null;
       await queue.save();
       return { message: "No more tickets in queue." };
     }

     nextTicket.status = "serving";
     nextTicket.served_at = new Date();
     await nextTicket.save();

     queue.current_ticket_id = nextTicket.ticket_id;
     await queue.save();

     return {
       message: "Next ticket called.",
       ticket: nextTicket,
     };
   };


  return Queue;
};
