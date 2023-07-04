import express from "express";

import { paseosController } from "../controllers/index.js";

const {
  getAllPaseos,
  createPaseos,
  editPaseos,
  deletePaseos,
  obtenerPaseosPorUsuCod,
  obtenerPaseosPorPasCod,
  obtenerPaseoPorPasNum,
} = paseosController;
const router = express.Router();

const paseosRoutes = {
  GET_ALL: "/paseos/",
  CREATE: "/paseos/create",
  UPDATE: "/paseos/update",
  DELETE: "/paseos/delete/:id",
  GET_BY_USER: "/paseos/user/:id",
  GET_BY_WALKER: "/paseos/walker/:id",
  GET_BY_CODE: "/paseos/:id",
};
router.get(paseosRoutes.GET_ALL, getAllPaseos);
router.post(paseosRoutes.CREATE, createPaseos);
router.put(paseosRoutes.UPDATE, editPaseos);
router.delete(paseosRoutes.DELETE, deletePaseos);
router.get(paseosRoutes.GET_BY_USER, obtenerPaseosPorUsuCod);
router.get(paseosRoutes.GET_BY_WALKER, obtenerPaseosPorPasCod);
router.get(paseosRoutes.GET_BY_CODE, obtenerPaseoPorPasNum);

export default router;
