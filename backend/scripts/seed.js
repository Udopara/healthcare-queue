import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import {
  sequelize,
  Clinic,
  Queue,
  Customer,
  Ticket,
} from "../src/models/index.js";

dotenv.config();

(async () => {
  try {
    console.log("Connecting to DB...");
    await sequelize.authenticate();

    await sequelize.sync({ force: true });
    console.log("Database synced — all tables dropped and recreated.");

    const clinics = [];
    for (let i = 0; i < 3; i++) {
      const clinic = await Clinic.create({
        clinic_name: faker.company.name(),
        email: faker.internet.email().toLowerCase(),
        phone_number: faker.phone.number("###-###-####"),
        password: "password123",
      });
      clinics.push(clinic);
    }
    console.log(`Created ${clinics.length} clinics`);

    const queues = [];
    for (const clinic of clinics) {
      const queueCount = faker.number.int({ min: 2, max: 4 });
      for (let i = 0; i < queueCount; i++) {
        const queue = await Queue.create({
          queue_name: faker.helpers.arrayElement([
            "General Consultation",
            "Dental Checkup",
            "Pharmacy Pickup",
            "Lab Tests",
            "Eye Screening",
          ]),
          clinic_id: clinic.clinic_id,
        });
        queues.push(queue);
      }
    }
    console.log(`Created ${queues.length} queues`);

    const customers = [];
    for (let i = 0; i < 20; i++) {
      const customer = await Customer.create({
        full_name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        phone_number: faker.phone.number("###-###-####"),
        password: "secret1234",
      });
      customers.push(customer);
    }
    console.log(`Created ${customers.length} customers`);

    const tickets = [];
    for (let i = 0; i < 40; i++) {
      const randomQueue = faker.helpers.arrayElement(queues);
      const randomCustomer = faker.helpers.arrayElement(customers);

      const ticket = await Ticket.create({
        queue_id: randomQueue.queue_id,
        customer_id: randomCustomer.customer_id,
        notification_contact: randomCustomer.email,
        status: "waiting",
      });

      tickets.push(ticket);
    }
    console.log(`Created ${tickets.length} tickets`);

    console.log("Seeding complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
})();
