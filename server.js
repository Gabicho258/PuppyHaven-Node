import express from "express";
import cors from "cors";
import "dotenv/config.js";
import { calificacionesRouter, distritosRouter } from "./api/routes/index.js";
// import {
//   userRouter,
//   distritoRouter,
//   calificacionRouter,
//   mascotasRouter,
//   paseosRouter,
//   tramiteRouter,
//   walkerRouter,
// } from "./api/routes/index.js";
import session from "express-session";

const app = express();

//Permite la lectura del form
// PENDIENTE
// app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.send("Bienvenido a Puppy Heaven");
});
// app.use("/api", userRouter);
// corregir rutas
app.use("/api", distritosRouter);
app.use("/api", calificacionesRouter);
// app.use("/api", mascotasRouter);
// app.use("/api", paseosRouter);
// app.use("/api", tramiteRouter);
// app.use("/api", walkerRouter);

const PORT = process.env.PORT || 5000;
// const USER = process.env.USER_DB;

//init server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
