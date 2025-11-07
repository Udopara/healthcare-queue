import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import {
  sequelize,
  Clinic,
  Doctor,
  Patient,
  Queue,
  Ticket,
  User,
} from "../src/models/index.js";

dotenv.config();

const QUEUE_NAMES = [
  "General Consultation",
  "Dental Checkup",
  "Pharmacy Pickup",
  "Lab Tests",
  "Eye Screening",
  "Pediatrics",
  "Radiology",
];

const createUserWithRole = async ({ name, email, phone_number, role, clinicId }) => {
  const user = await User.create(
    {
      name,
      email,
      phone_number,
      password: "Password123!",
      role,
    },
    { context: { clinicId } }
  );

  const { linked_entity_id } = user;
  if (!linked_entity_id) {
    return null;
  }

  switch (role) {
    case "clinic":
      return Clinic.findByPk(linked_entity_id);
    case "doctor":
      return Doctor.findByPk(linked_entity_id);
    case "patient":
      return Patient.findByPk(linked_entity_id);
    default:
      return null;
  }
};

const ensureEntity = async (promise, role) => {
  const entity = await promise;
  if (!entity) {
    throw new Error(`Failed to create ${role} entity`);
  }
  return entity;
};

(async () => {
  try {
    console.log("Connecting to DB...");
    await sequelize.authenticate();

    await sequelize.sync({ force: true });
    console.log("Database synced — all tables dropped and recreated.");

    await User.create({
      name: "System Admin",
      email: "admin@mediqueue.com",
      password: "admin",
      role: "admin",
      phone_number: faker.phone.number("###-###-####"),
    });
    console.log("Created admin user");

    const clinics = [];
    for (let i = 0; i < 3; i++) {
      const clinic = await ensureEntity(
        createUserWithRole({
          name: faker.company.name(),
          email: faker.internet.email().toLowerCase(),
          phone_number: faker.phone.number("###-###-####"),
          role: "clinic",
        }),
        "clinic"
      );
      clinics.push(clinic);
    }
    console.log(`Created ${clinics.length} clinics`);

    const queues = [];
    for (const clinic of clinics) {
      const queueCount = faker.number.int({ min: 2, max: 4 });
      for (let i = 0; i < queueCount; i++) {
        const queue = await Queue.create({
          queue_name: faker.helpers.arrayElement(QUEUE_NAMES),
          clinic_id: clinic.clinic_id,
        });
        queues.push(queue);
      }
    }
    console.log(`Created ${queues.length} queues`);

    const doctors = [];
    for (let i = 0; i < 5; i++) {
      const clinicForDoctor = faker.helpers.arrayElement(clinics);
      const doctor = await ensureEntity(
        createUserWithRole({
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          phone_number: faker.phone.number("###-###-####"),
          role: "doctor",
          clinicId: clinicForDoctor?.clinic_id,
        }),
        "doctor"
      );
      doctors.push(doctor);
    }
    console.log(`Created ${doctors.length} doctors`);

    const patients = [];
    for (let i = 0; i < 20; i++) {
      const patient = await ensureEntity(
        createUserWithRole({
          name: faker.person.fullName(),
          email: faker.internet.email().toLowerCase(),
          phone_number: faker.phone.number("###-###-####"),
          role: "patient",
        }),
        "patient"
      );
      patients.push(patient);
    }
    console.log(`Created ${patients.length} patients`);

    const tickets = [];
    for (let i = 0; i < 40; i++) {
      const randomQueue = faker.helpers.arrayElement(queues);
      const randomPatient = faker.helpers.arrayElement(patients);

      const ticket = await Ticket.create({
        queue_id: randomQueue.queue_id,
        patient_id: randomPatient.patient_id,
        notification_contact: randomPatient.email,
        status: faker.helpers.arrayElement(["waiting", "serving", "completed"]),
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
