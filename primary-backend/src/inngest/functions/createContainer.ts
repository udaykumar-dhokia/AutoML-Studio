import docker from "../../config/docker.config";
import workflowDao from "../../features/workflow/workflow.dao";
import { inngest } from "../client";

const createContainer = inngest.createFunction(
  { id: "create-container" },
  { event: "workflow/workflow.created" },
  async ({ event, step }) => {
    const workflowId = event.data.id;

    const container = await docker.createContainer({
      Image: "ubuntu",
      name: `w_${workflowId.toString()}`,
      Cmd: ["sleep", "infinity"],
    });

    await container.start();

    await workflowDao.updateWorkflowById(workflowId, {
      dockerId: container.id,
    });

    return container.id;
  },
);

export default createContainer;
