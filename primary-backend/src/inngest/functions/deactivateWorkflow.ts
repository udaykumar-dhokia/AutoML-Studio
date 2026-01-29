import docker from "../../config/docker.config";
import redisClient from "../../config/redis.config";
import workflowDao from "../../features/workflow/workflow.dao";
import { inngest } from "../client";

const deactivateWorkflow = inngest.createFunction(
    {
        id: "deactivate-workflow",
    },
    {
        event: "workflow/workflow.deactivated",
    },
    async ({ event, step }) => {
        const { containerId, workflowId } = event.data;
        await redisClient.del(`container:${containerId}`);
        await step.run("spin-down-container", async () => {
            const container = await docker.getContainer(containerId);
            await container.stop();
        });
        await step.run("update-workflow-status", async () => {
            return await workflowDao.updateWorkflowById(workflowId, {
                status: false,
            });
        });
    },
);

export default deactivateWorkflow;