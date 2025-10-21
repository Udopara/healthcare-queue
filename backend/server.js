import dotenv from "dotenv";
import express from "express";
import { sequelize } from "./src/models/index.js";

dotenv.config();
const app = express();

(async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected");
    await sequelize.sync({ alter: true }); //! remember to disable this in production
  } catch (err) {
    console.error("DB connection failed:", err);
  }
})();


const PORT = process.env.PORT || 3000;
app.listen(3000, () =>
  console.log("Server running on port " + PORT)
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
