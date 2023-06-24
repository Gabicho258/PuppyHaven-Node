import express from "express";

import { userController } from "../controllers/index.js";

const { saludar, saludar2, saludar3 } = userController;

const router = express.Router();

const userRoutes = {
  SALUDAR: "/users/saludar/:name",
  SALUDAR2: "/users/saludar2",
};

// router.get(userRoutes.SALUDAR, saludar);
router.post(userRoutes.SALUDAR, saludar);

export default router;
