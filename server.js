import express from "express";
import cors from "cors";

import { userRouter } from "./api/routes/index.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.send("Bienvenido a Puppy Heaven");
});
app.use("/api", userRouter);

const PORT = process.env.PORT || 5000;
const USER = process.env.USER;

// Init server

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
