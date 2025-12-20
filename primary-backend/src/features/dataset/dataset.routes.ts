import express from "express";
import datasetController from "./dataset.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { upload } from "../../config/multer.config";

const router = express.Router();

router.get("/", authMiddleware, datasetController.getDataset);
router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  datasetController.createDataset
);
router.delete("/:id", authMiddleware, datasetController.deleteDataset);

export default router;
