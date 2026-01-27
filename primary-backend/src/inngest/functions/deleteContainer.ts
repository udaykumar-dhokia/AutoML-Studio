import docker from "../../config/docker.config";
import { inngest } from "../client";

const deleteContainer = inngest.createFunction(
  { id: "delete-container" },
  { event: "workflow/workflow.deleted" },

  async ({ event, step }) => {
    const containerId = event.data.id;

    await step.run("stop-container", async () => {
      const container = docker.getContainer(containerId);

      try {
        await container.stop();
      } catch (err: any) {
        if (err?.statusCode !== 304) {
          throw err;
        }
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

      try {
        await container.remove({ force: true });
      } catch (err: any) {
        if (err?.statusCode !== 404) {
          throw err;
        }
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
