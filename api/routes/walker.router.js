import express from "express";

import { walkerController } from "../controllers/index.js";

const {
  getAllWalkers,
  createWalker,
  editWalker,
  deleteWalker,
  obtenerWalkerPorCod,
  login,
} = walkerController;

const router = express.Router();
const walkerRoutes = {
  GET_ALL: "/walkers/",
  CREATE: "/walkers/create",
  UPDATE: "/walkers/update",
  DELETE: "/walkers/delete/:id",
  GET_BY_CODE: "/walkers/:id",
  LOGIN: "/walkers/login",
};

router.get(walkerRoutes.GET_ALL, getAllWalkers);
router.post(walkerRoutes.CREATE, createWalker);
router.put(walkerRoutes.UPDATE, editWalker);
router.delete(walkerRoutes.DELETE, deleteWalker);
router.get(walkerRoutes.GET_BY_CODE, obtenerWalkerPorCod);
router.post(walkerRoutes.LOGIN, login);

export default router;
