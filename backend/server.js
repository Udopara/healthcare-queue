import dotenv from "dotenv";
import express from "express";
import { sequelize } from "./src/models/index.js";
import customerRoutes from "./src/routes/customer.routes.js";

dotenv.config();
const app = express();
app.use(express.json());

(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");
    await sequelize.sync({ alter: true }); //! remember to disable this in production
  } catch (err) {
    console.error("DB connection failed:", err);
  }
})();


app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/customers", customerRoutes);

const PORT = process.env.PORT || 3000;
app.listen(3000, () =>
  console.log("Server running on port " + PORT)
);
