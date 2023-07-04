import express from "express";

import { userController } from "../controllers/index.js";

const {
  getAllUsers,
  createUser,
  editUser,
  deleteUser,
  obtenerUserPorCod,
  login,
} = userController;

const router = express.Router();
const userRoutes = {
  GET_ALL: "/users/",
  CREATE: "/users/create",
  UPDATE: "/users/update",
  DELETE: "/users/delete/:id",
  GET_BY_CODE: "/users/:id",
  LOGIN: "/users/login",
};

router.get(userRoutes.GET_ALL, getAllUsers);
router.post(userRoutes.CREATE, createUser);
router.put(userRoutes.UPDATE, editUser);
router.delete(userRoutes.DELETE, deleteUser);
router.get(userRoutes.GET_BY_CODE, obtenerUserPorCod);
router.post(userRoutes.LOGIN, login);

export default router;
