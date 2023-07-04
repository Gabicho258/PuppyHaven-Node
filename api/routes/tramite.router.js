import express from "express";

import { tramiteController } from "../controllers/index.js";

const { deleteTramite, getAllTramite, postTramite, putTramite } =
  tramiteController;
const router = express.Router();

const distritoRoutes = {
  OBTENER: "/tramite/getModel",
  INSERTAR: "/tramite/postModel",
  EDITAR: "/tramite/putModel",
  ELIMINAR: "/tramite/deleteModel/:id",
};
router.get(distritoRoutes.OBTENER, getAllTramite);
router.post(distritoRoutes.INSERTAR, postTramite);
router.put(distritoRoutes.EDITAR, putTramite);
router.delete(distritoRoutes.ELIMINAR, deleteTramite);

export default router;