import express from "express";

import { distritoController} from "../controllers/index.js";

const { deleteDistrito, getAllDistritos, postDistritos, putDistrito} = distritoController;
const router = express.Router();

const distritoRoutes = {
  OBTENER: "/getModel",
  INSERTAR: "/postModel",
  EDITAR: "/putModel",
  ELIMINAR: "/deleteModel/:id"
};
router.get(distritoRoutes.OBTENER, getAllDistritos);
router.post(distritoRoutes.INSERTAR, postDistritos);
router.put(distritoRoutes.EDITAR, putDistrito);
router.delete(distritoRoutes.ELIMINAR, deleteDistrito);

export default router;