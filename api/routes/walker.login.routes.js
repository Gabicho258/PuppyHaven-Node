import express from "express";

import { walkerController } from "../controllers/index.js";

const { register, auth, storyUser, login, logout } = walkerController;

const router = express.Router();
const walkerRoutes = {
  REGISTER: "/walkers/register",
  LOGIN: "/walkers/login",
  LOGOUT: "/walkers/logout"
};

router.get(walkerRoutes.REGISTER, register);
router.post(walkerRoutes.REGISTER, storyUser);
router.get(walkerRoutes.LOGIN, login);
router.post(walkerRoutes.LOGIN, auth);
router.get(walkerRoutes.LOGOUT, logout);



export default router;