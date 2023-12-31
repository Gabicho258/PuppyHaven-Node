import express from "express";

import { tramiteController } from "../controllers/index.js";

const {
  getAllTramite,
  createTramite,
  obtenerTramitePorAdopter,
  obtenerTramitePorDueno,
  obtenerTramitePorCod,
  updateTramitePorCod,
} = tramiteController;
const router = express.Router();

const tramiteRoutes = {
  GET_ALL: "/tramites/",
  CREATE: "/tramites/create",
  GET_BY_DUENO: "/tramites/dueno/:id",
  GET_BY_ADOPTER: "/tramites/adopter/:id",
  GET_BY_CODE: "/tramites/:id",
  UPDATE: "/tramites/update",
};
router.get(tramiteRoutes.GET_ALL, getAllTramite);
router.post(tramiteRoutes.CREATE, createTramite);
router.get(tramiteRoutes.GET_BY_DUENO, obtenerTramitePorDueno);
router.get(tramiteRoutes.GET_BY_ADOPTER, obtenerTramitePorAdopter);
router.get(tramiteRoutes.GET_BY_CODE, obtenerTramitePorCod);
router.put(tramiteRoutes.UPDATE, updateTramitePorCod);

export default router;
