import { inngest } from "../client";
import workflowDao from "../../features/workflow/workflow.dao";
import docker from "../../config/docker.config";
import { io } from "../../index";
import redisClient from "../../config/redis.config";

const activateWorkflow = inngest.createFunction(
    {
        id: "activate-workflow",
    },
    {
        event: "workflow/workflow.activated",
    },
    async ({ event, step }) => {
        const { containerId, workflowId } = event.data;

        await redisClient.hSet(`container:${containerId}`, {
            workflowId,
            status: "up",
            createdAt: Date.now().toString(),
        });

        await redisClient.expire(`container:${containerId}`, 30);

        await step.run("spin-up-container", async () => {
            const container = await docker.getContainer(containerId);
            await container.start();
        });
        await step.run("update-workflow-status", async () => {
            return await workflowDao.updateWorkflowById(workflowId, {
                status: true,
            });
        });
        io.emit("container_ready", { containerId, workflowId });
    },
);

export default activateWorkflow;