import express from "express";

import { userController } from "../controllers/index.js";



const { saludar, getAllAlumnos, postAlumnos, putAlumnos, deleteAlumnos} = userController;
const router = express.Router();

const userRoutes = {
  SALUDAR: "/users/saludar/:name",
  SALUDAR2: "/users/saludar2",
  OBTENER: "/getuserModel",
  INSERTAR: "/postuserModel",
  EDITAR: "/putuserModel",
  ELIMINAR: "/deleteuserModel/:id"
};
router.post(userRoutes.SALUDAR, saludar);
router.get(userRoutes.OBTENER, getAllAlumnos);
router.post(userRoutes.INSERTAR, postAlumnos);
router.put(userRoutes.EDITAR, putAlumnos);
router.delete(userRoutes.ELIMINAR, deleteAlumnos);

export default router;
