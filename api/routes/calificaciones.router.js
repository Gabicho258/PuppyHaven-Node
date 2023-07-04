import express from "express";

import { calificacionesController } from "../controllers/index.js";

const {
  getAllCalificaciones,
  createCalificaciones,
  editCalificaciones,
  obtenerCalificacionesPorCod,
  // deleteCalificaciones,
  // postCalificaciones,
  // putCalificaciones,
} = calificacionesController;
const router = express.Router();

const distritoRoutes = {
  GET_ALL: "/calificaciones/",
  CREATE: "/calificaciones/create",
  UPDATE: "/calificaciones/update",
  GET_BY_CODE: "/calificaciones/:id",
};
router.get(distritoRoutes.GET_ALL, getAllCalificaciones);
router.post(distritoRoutes.CREATE, createCalificaciones);
router.put(distritoRoutes.UPDATE, editCalificaciones);
router.get(distritoRoutes.GET_BY_CODE, obtenerCalificacionesPorCod);
// router.delete(distritoRoutes.ELIMINAR, deleteCalificaciones);

export default router;
