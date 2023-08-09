import express from "express";

import { comentariosController } from "../controllers/index.js";

const { getAllComentarios, createComentarios, obtenerComentariosPorPasCod } =
  comentariosController;
const router = express.Router();

const comentariosRoutes = {
  GET_ALL: "/comentarios/",
  CREATE: "/comentarios/create",
  GET_BY_WALKER: "/comentarios/walker/:id",
};
router.get(comentariosRoutes.GET_ALL, getAllComentarios);
router.post(comentariosRoutes.CREATE, createComentarios);
router.get(comentariosRoutes.GET_BY_WALKER, obtenerComentariosPorPasCod);

export default router;
