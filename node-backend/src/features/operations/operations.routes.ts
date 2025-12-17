import express from "express";
import operationsController from "./operations.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get(
  "/dataset",
  authMiddleware,
  operationsController.getDatasetOperations
);

router.post(
  "/handle_missing_values",
  authMiddleware,
  operationsController.handleMissingValues
);

export default router;
