import { Request, Response } from "express";
import { io } from "../../index";
import redisClient from "../../config/redis.config";
import workflowDao from "../workflow/workflow.dao";

export const markContainerReady = async (req: Request, res: Response) => {
    const { workflowId } = req.params;

    console.log(`Getting ready signal for workflow ${workflowId}`);

    try {
        const workflow = await workflowDao.getWorkflowById(workflowId);

        if (!workflow || !workflow.dockerId) {
            console.error(`Workflow ${workflowId} or its container not found`);
            res.status(404).json({ message: "Workflow or container not found" });
            return;
        }

        const containerId = workflow.dockerId;
        console.log(`✅ Container ${containerId} for workflow ${workflowId} is ready!`);

        // Update status in Redis
        const containerKey = `container:${containerId}`;
        const containerData = await redisClient.hGetAll(containerKey);

        if (containerData && Object.keys(containerData).length > 0) {
            await redisClient.hSet(containerKey, { ...containerData, status: "ready" });
        } else {
            // Fallback if redis data is missing
            await redisClient.hSet(containerKey, {
                workflowId,
                status: "ready",
                updatedAt: Date.now().toString()
            });
        }

        // Emit event to frontend
        io.emit("container_ready", { id: containerId, workflowId });

        res.status(200).json({ message: "Container marked as ready" });
    } catch (error) {
        console.error("Error marking container ready:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
