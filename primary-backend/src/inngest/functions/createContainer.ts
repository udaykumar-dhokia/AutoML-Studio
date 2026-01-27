import { fileURLToPath } from "url";
import { dirname, join } from "path";
import docker from "../../config/docker.config";
import workflowDao from "../../features/workflow/workflow.dao";
import { inngest } from "../client";
import redisClient from "../../config/redis.config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Attempts to create and start a Docker container with retries.
 * @param workflowId - workflow ID
 * @param maxRetries - max retry attempts
 * @param delayMs - delay between retries
 */
async function createAndStartContainer(
  workflowId: string,
  maxRetries = 3,
  delayMs = 2000,
) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const container = await docker.createContainer({
        Image: "workflow-container-init",
        name: `w_${workflowId}`,
        HostConfig: {
          Binds: [`${join(__dirname, "init.sh")}:/init.sh`],
        },
        Cmd: ["/bin/bash", "/init.sh", workflowId],
      });

      await container.start();

      await redisClient.hSet(`container:${container.id}`, {
        workflowId,
        status: "up",
        createdAt: Date.now().toString(),
      });

      await redisClient.expire(`container:${container.id}`, 300);

      return container;
    } catch (err: any) {
      attempt++;
      console.error(
        `Attempt ${attempt} failed to create/start container:`,
        err,
      );

      if (attempt >= maxRetries) {
        throw new Error(
          `Failed to create/start container after ${maxRetries} attempts.`,
        );
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error("Unreachable code");
}

const createContainer = inngest.createFunction(
  { id: "create-container" },
  { event: "workflow/workflow.created" },
  async ({ event, step }) => {
    const workflowId = event.data.id;

    const container = await step.run("create-container", async () => {
      return createAndStartContainer(workflowId);
    });

    await workflowDao.updateWorkflowById(workflowId, {
      dockerId: container.id,
    });

    return container.id;
  },
);

export default createContainer;
