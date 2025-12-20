import express from "express";
import { authMiddleware } from "../../middlewares/auth.middleware";
import workflowController from "./workflow.controller";

const router = express.Router();

router.post("/", authMiddleware, workflowController.createWorkflow);
router.get("/", authMiddleware, workflowController.getWorkflows);
router.get("/:id", authMiddleware, workflowController.getWorkflowById);
router.put("/:id", authMiddleware, workflowController.updateWorkflowById);
router.delete("/:id", authMiddleware, workflowController.deleteWorkflowById);

export default router;
