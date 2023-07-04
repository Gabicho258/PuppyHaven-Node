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

const calificacionesRoutes = {
  GET_ALL: "/calificaciones/",
  CREATE: "/calificaciones/create",
  UPDATE: "/calificaciones/update",
  GET_BY_CODE: "/calificaciones/:id",
};
router.get(calificacionesRoutes.GET_ALL, getAllCalificaciones);
router.post(calificacionesRoutes.CREATE, createCalificaciones);
router.put(calificacionesRoutes.UPDATE, editCalificaciones);
router.get(calificacionesRoutes.GET_BY_CODE, obtenerCalificacionesPorCod);
// router.delete(distritoRoutes.ELIMINAR, deleteCalificaciones);

export default router;
