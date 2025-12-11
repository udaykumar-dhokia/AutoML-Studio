import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import workflowController from "./workflow.controller";

const router = express.Router();

router.post("/", authMiddleware, workflowController.createWorkflow);
router.get("/", authMiddleware, workflowController.getWorkflows);

export default router;
