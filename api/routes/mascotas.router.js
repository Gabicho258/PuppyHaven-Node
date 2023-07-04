import express from "express";

import { MascotasController } from "../controllers/index.js";

const { getAllMascotas, deleteMascota, postMascota, putMascota } =
  MascotasController;
const router = express.Router();

const distritoRoutes = {
  OBTENER: "/Mascotas/getModel",
  INSERTAR: "/Mascotas/postModel",
  EDITAR: "/Mascotas/putModel",
  ELIMINAR: "/Mascotas/deleteModel/:id",
};
router.get(distritoRoutes.OBTENER, getAllMascotas);
router.post(distritoRoutes.INSERTAR, postMascota);
router.put(distritoRoutes.EDITAR, putMascota);
router.delete(distritoRoutes.ELIMINAR, deleteMascota);

export default router;
