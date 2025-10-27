import dotenv from "dotenv";
import express from "express";

import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { sequelize } from "./src/models/index.js";
import clinicRoutes from "./src/routes/clinic.routes.js";
import customerRoutes from "./src/routes/customer.routes.js";
import queueRoutes from "./src/routes/queue.routes.js";
import authRoutes from "./src/routes/auth.routes.js";

dotenv.config();
const app = express();
app.use(express.json());

(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");
    await sequelize.sync(); //! remember to disable this in production
  } catch (err) {
    console.error("DB connection failed:", err);
  }
})();

const specs = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "MediQueue API",
      version: "1.0.0",
    },
  },
  apis: ["./src/routes/*.js"],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/customers", customerRoutes);
app.use("/api/clinics", clinicRoutes);
app.use("/api/queues", queueRoutes)
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(3000, () =>
  console.log("Server running on port " + PORT)
);
