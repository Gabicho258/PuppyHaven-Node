import express from "express";
import cors from "cors";
import "dotenv/config.js"
import { userRouter, distritoRouter, calificacionRouter,petRouter, paseosRouter, tramiteRouter,walkerRouter } from "./api/routes/index.js";
import bodyParser from "body-parser";
import session from "express-session";

const app = express();

//Permite la lectura del form 
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.get("/", (req, res) => {
  res.send("Bienvenido a Puppy Heaven");
});
app.use("/api", userRouter);  
// corregir rutas
app.use("/distrito", distritoRouter);
app.use("/calificacion", calificacionRouter);
app.use("/mascota", petRouter);
app.use("/paseos", paseosRouter);
app.use("/tramite", tramiteRouter);
app.use("/api", walkerRouter);


const PORT = process.env.PORT || 5000;
const USER = process.env.USER_DB;

//init server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});