import express from "express";

import { userController } from "../controllers/index.js";

const { register, auth, storyUser, login, logout } = userController;

const router = express.Router();
const userRoutes = {
  REGISTER: "/users/register",
  LOGIN: "/users/login",
  LOGOUT: "/users/logout",
};

router.get(userRoutes.REGISTER, register);
router.post(userRoutes.REGISTER, storyUser);
router.get(userRoutes.LOGIN, login);
router.post(userRoutes.LOGIN, auth);
router.get(userRoutes.LOGOUT, logout);

export default router;
