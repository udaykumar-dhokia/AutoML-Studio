import express from "express";
import { markContainerReady } from "./container.controller";

const router = express.Router();

router.post("/workflow/:workflowId/ready", markContainerReady);

export default router;
