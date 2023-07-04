import express from "express";

import { mascotasController } from "../controllers/index.js";

const {
  getAllMascotas,
  deleteMascota,
  createMascota,
  editMascota,
  obtenerMascotaPorCod,
  obtenerMascotasPorUsuCod,
} = mascotasController;
const router = express.Router();

const mascotaRoutes = {
  GET_ALL: "/mascotas/",
  CREATE: "/mascotas/create",
  UPDATE: "/mascotas/update",
  DELETE: "/mascotas/delete/:id",
  GET_BY_CODE: "/mascotas/:id",
  GET_BY_USER_CODE: "/mascotas/user/:id",
};
router.get(mascotaRoutes.GET_ALL, getAllMascotas);
router.post(mascotaRoutes.CREATE, createMascota);
router.put(mascotaRoutes.UPDATE, editMascota);
router.delete(mascotaRoutes.DELETE, deleteMascota);
router.get(mascotaRoutes.GET_BY_CODE, obtenerMascotaPorCod);
router.get(mascotaRoutes.GET_BY_USER_CODE, obtenerMascotasPorUsuCod);

export default router;
