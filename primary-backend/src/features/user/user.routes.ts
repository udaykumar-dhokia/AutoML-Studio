import express from "express";
import userController from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get("/", authMiddleware, userController.getUser);

export default router;
