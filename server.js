import express from "express";
import cors from "cors";
import "dotenv/config.js"
import { userRouter, distritoRouter, calificacionRouter,petRouter, paseosRouter, tramiteRouter } from "./api/routes/index.js";
import bodyParser from "body-parser";



const app = express();

//Permite la lectura del form 
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});
// Routes
app.use("/api", userRouter);  
app.use("/distrito", distritoRouter);
app.use("/calificacion", calificacionRouter);
app.use("/mascota", petRouter);
app.use("/paseos", paseosRouter);
app.use("/tramite", tramiteRouter);

const PORT = process.env.PORT || 5000;
const USER = process.env.USER_DB;

//init server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
