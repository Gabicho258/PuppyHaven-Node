import express from "express";

import { petController } from "../controllers/index.js";

const {getAllMascotas,deleteMascota, postMascota, putMascota } = petController;
const router = express.Router();

const distritoRoutes = {
  OBTENER: "/getModel",
  INSERTAR: "/postModel",
  EDITAR: "/putModel",
  ELIMINAR: "/deleteModel/:id"
};
router.get(distritoRoutes.OBTENER, getAllMascotas);
router.post(distritoRoutes.INSERTAR, postMascota);
router.put(distritoRoutes.EDITAR, putMascota);
router.delete(distritoRoutes.ELIMINAR, deleteMascota);

export default router;