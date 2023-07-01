import express from "express";

import { userController } from "../controllers/index.js";
import { connection } from "../../database.js";

const { saludar, saludar2, saludar3 } = userController;
const router = express.Router();

const userRoutes = {
  SALUDAR: "/users/saludar/:name",
  SALUDAR2: "/users/saludar2",
  database: "/probar/conexion"
};
console.log(connection ? "hola2":"no2")
router.post(userRoutes.SALUDAR, saludar);

export default router;
