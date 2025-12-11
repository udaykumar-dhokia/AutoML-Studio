import { httpStatus } from "../../utils/httpStatus";
import workflowDao from "./workflow.dao";
import { TWorkflow } from "./workflow.type";

const workflowController = {
  createWorkflow: async (req, res) => {
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const { name, description } = req.body;
    if (!name || !description) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Name and description are required" });
    }

    try {
      const exists = await workflowDao.getWorkflowByNameAndUserId(name, userId);
      if (exists) {
        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ message: "Workflow with this name already exists" });
      }

      const payload: TWorkflow = {
        name,
        description,
        userId,
        nodes: [],
        edges: [],
      };

      const workflow = await workflowDao.createWorkflow(payload);
      return res.status(httpStatus.OK).json(workflow);
    } catch (error) {
      console.error(error);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  },

  getWorkflows: async (req, res) => {
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    try {
      const workflows = await workflowDao.getWorkflowsByUserId(userId);
      return res.status(httpStatus.OK).json(workflows);
    } catch (error) {
      console.error(error);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  },
};

export default workflowController;
