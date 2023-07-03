import express from "express";

import { calicicacionesController} from "../controllers/index.js";

const {getAllCalificaciones,deleteCalificaciones, postCalificaciones, putCalificaciones  } = calicicacionesController;
const router = express.Router();

const distritoRoutes = {
  OBTENER: "/getModel",
  INSERTAR: "/postModel",
  EDITAR: "/putModel",
  ELIMINAR: "/deleteModel/:id"
};
router.get(distritoRoutes.OBTENER, getAllCalificaciones);
router.post(distritoRoutes.INSERTAR, postCalificaciones);
router.put(distritoRoutes.EDITAR, putCalificaciones);
router.delete(distritoRoutes.ELIMINAR, deleteCalificaciones);

export default router;