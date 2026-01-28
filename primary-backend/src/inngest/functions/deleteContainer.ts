import { io } from "../../index";
import docker from "../../config/docker.config";
import { inngest } from "../client";
import redisClient from "../../config/redis.config";

const deleteContainer = inngest.createFunction(
  { id: "delete-container" },
  { event: "workflow/workflow.deleted" },

  async ({ event, step }) => {
    const containerId = event.data.id;

    await step.run("stop-container", async () => {
      const container = docker.getContainer(containerId);

      if (!container) {
        console.log(`Container ${containerId} not found, skipping stop.`);
        return `${containerId} not found`;
      }

      try {
        await container.stop();
        console.log(`Stop requested for container ${containerId}`);
      } catch (err: any) {
        if (err?.statusCode !== 304) {
          throw err;
        }
        console.log(`Container ${containerId} already stopped.`);
      }

      await inngest.send({
        name: "container/container.stopped",
        data: {
          id: containerId,
          source: "delete-container",
          timestamp: Date.now(),
        },
      });

      return `${containerId} stop requested`;
    });

    await step.waitForEvent("wait-for-container-stop", {
      event: "container/container.stopped",
      if: `event.data.id == "${containerId}"`,
      timeout: "10s",
    });

    await step.run("remove-container", async () => {
      const container = docker.getContainer(containerId);

      if (!container) {
        console.log(`Container ${containerId} not found, skipping removal.`);
        return `${containerId} not found`;
      }

      try {
        await container.remove({ force: true });
        await redisClient.del(`container:${containerId}`);
        io.emit("container_removed", container);
        console.log(`Container ${containerId} removed.`);
      } catch (err: any) {
        if (err?.statusCode !== 404) {
          throw err;
        }
        console.log(`Container ${containerId} already removed.`);
      }

      return `${containerId} removed`;
    });

    return {
      containerId,
      status: "deleted",
    };
  },
);

export default deleteContainer;
