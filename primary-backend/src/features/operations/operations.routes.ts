import express from "express";
import operationsController from "./operations.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = express.Router();

router.get(
  "/dataset",
  authMiddleware,
  operationsController.getDatasetOperations,
);

router.post(
  "/handle_missing_values",
  authMiddleware,
  operationsController.handleMissingValues,
);

router.post(
  "/visualise/univariate",
  authMiddleware,
  operationsController.univariateAnalysis,
);

router.post(
  "/visualise/bivariate",
  authMiddleware,
  operationsController.bivariateAnalysis,
);

router.post(
  "/handle_outliers",
  authMiddleware,
  operationsController.handleOutliers,
);

router.post(
  "/handle_normalization",
  authMiddleware,
  operationsController.handleNormalization,
);

router.post(
  "/handle_standardization",
  authMiddleware,
  operationsController.handleStandardization,
);

export default router;
