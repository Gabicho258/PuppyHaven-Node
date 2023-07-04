import express from "express";

import { distritosController } from "../controllers/index.js";

const {
  getAllDistritos,
  createDistritos,
  editDistrito,
  obtenerDistritoPorCod,
} = distritosController;

const router = express.Router();

const distritoRoutes = {
  GET_ALL: "/distritos/",
  CREATE: "/distritos/create",
  UPDATE: "/distritos/update",
  GET_BY_CODE: "/distritos/:id",
};
router.get(distritoRoutes.GET_ALL, getAllDistritos);
router.post(distritoRoutes.CREATE, createDistritos);
router.put(distritoRoutes.UPDATE, editDistrito);
router.get(distritoRoutes.GET_BY_CODE, obtenerDistritoPorCod);

export default router;
