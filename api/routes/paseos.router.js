import express from "express";

import { paseosController } from "../controllers/index.js";

const { deletePaseos, getAllPaseos, postPaseos, putPaseos} = paseosController;
const router = express.Router();

const distritoRoutes = {
  OBTENER: "/getModel",
  INSERTAR: "/postModel",
  EDITAR: "/putModel",
  ELIMINAR: "/deleteModel/:id"
};
router.get(distritoRoutes.OBTENER, getAllPaseos);
router.post(distritoRoutes.INSERTAR, postPaseos);
router.put(distritoRoutes.EDITAR, putPaseos);
router.delete(distritoRoutes.ELIMINAR, deletePaseos);

export default router;