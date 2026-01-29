import { inngest } from "../../inngest";
import { httpStatus } from "../../utils/httpStatus";
import workflowDao from "./workflow.dao";
import { TWorkflow } from "./workflow.type";
import redisClient from "../../config/redis.config";

const workflowController = {
  createWorkflow: async (req, res) => {
    const userId = req.id;
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
        status: false,
        nodes: [],
        edges: [],
      };

      const workflow = await workflowDao.createWorkflow(payload);
      inngest
        .send({
          name: "workflow/workflow.created",
          data: {
            id: workflow._id.toString(),
          },
        })
        .catch((error) => {
          return res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ error, message: "Internal Server Error" });
        });
      return res.status(httpStatus.OK).json(workflow);
    } catch (error) {
      console.error(error);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  },

  getWorkflows: async (req, res) => {
    const userId = req.id;
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

  getWorkflowById: async (req, res) => {
    const userId = req.id;
    if (!userId) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    try {
      const workflow = await workflowDao.getWorkflowById(req.params.id);

      if (workflow && workflow.dockerId) {
        const containerData: any = await redisClient.hGetAll(`container:${workflow.dockerId}`);
        if (containerData && containerData.status === "up") {
          return res.status(httpStatus.OK).json({
            ...workflow.toObject(),
            isInitializing: true
          });
        }
      }

      return res.status(httpStatus.OK).json(workflow);
    } catch (error) {
      console.error(error);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  },

  updateWorkflowById: async (req, res) => {
    const userId = req.id;
    if (!userId) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const { nodes, edges } = req.body;
    if (!nodes || !edges) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Nodes and edges are required" });
    }

    try {
      const workflow = await workflowDao.updateWorkflowById(req.params.id, {
        nodes,
        edges,
      });
      return res.status(httpStatus.OK).json(workflow);
    } catch (error) {
      console.error(error);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  },

  deleteWorkflowById: async (req, res) => {
    const userId = req.id;
    if (!userId) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const id = req.params.id;
    if (!id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Id is required" });
    }

    try {
      const workflow = await workflowDao.getWorkflowById(id);
      inngest.send({
        name: "workflow/workflow.deleted",
        data: {
          id: workflow.dockerId,
        },
      });
      await workflowDao.deleteWorkflowById(id);
      return res
        .status(httpStatus.OK)
        .json({ workflow, message: "Deleted successfully" });
    } catch (error) {
      console.error(error);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  },

  activateWorkflowById: async (req, res) => {
    const userId = req.id;
    if (!userId) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const id = req.params.id;
    if (!id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Id is required" });
    }

    try {
      const workflow = await workflowDao.getWorkflowById(id);
      inngest.send({
        name: "workflow/workflow.activated",
        data: {
          containerId: workflow.dockerId,
          workflowId: id,
        },
      });
      return res
        .status(httpStatus.OK)
        .json({ message: "Activated successfully" });
    } catch (error) {
      console.error(error);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  },

  deactivateWorkflowById: async (req, res) => {
    const userId = req.id;
    if (!userId) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }

    const id = req.params.id;
    if (!id) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Id is required" });
    }

    try {
      const workflow = await workflowDao.getWorkflowById(id);
      inngest.send({
        name: "workflow/workflow.deactivated",
        data: {
          containerId: workflow.dockerId,
          workflowId: id,
        },
      });
      await workflowDao.updateWorkflowById(id, {
        status: false,
      });
      return res
        .status(httpStatus.OK)
        .json({ message: "Deactivated successfully" });
    } catch (error) {
      console.error(error);
      return res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }
  },
};

export default workflowController;