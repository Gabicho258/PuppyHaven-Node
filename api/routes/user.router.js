import express from "express";

import { userController } from "../controllers/index.js";


const { saludar, getAllAlumnos } = userController;
const router = express.Router();

const userRoutes = {
  SALUDAR: "/users/saludar/:name",
  SALUDAR2: "/users/saludar2",
  database: "/probar/conexion",
  OBTENER: "/getAlumnos"
};
router.post(userRoutes.SALUDAR, saludar);

router.get(userRoutes.OBTENER, getAllAlumnos);

export default router;
