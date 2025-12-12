import express from "express";
import nodeController from "./node.controller";

const router = express.Router();

router.get("/", nodeController.getNodes);
router.post("/seed", nodeController.seedNodes);

export default router;
