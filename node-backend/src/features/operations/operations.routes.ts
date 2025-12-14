import express from "express";
import operationsController from "./operations.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get(
  "/dataset",
  authMiddleware,
  operationsController.getDatasetOperations
);

export default router;
