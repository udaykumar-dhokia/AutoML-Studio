import Workflow from "./workflow.model";
import { TWorkflow } from "./workflow.type";

class WorkflowDao {
  async createWorkflow(workflowData: TWorkflow) {
    return await Workflow.create(workflowData);
  }

  async getWorkflowsByUserId(userId: string) {
    return await Workflow.find({ userId });
  }

  async getWorkflowByNameAndUserId(name: string, userId: string) {
    return await Workflow.findOne({ name, userId });
  }

  async getWorkflowById(id: string) {
    return await Workflow.findById(id);
  }

  async updateWorkflowById(id: string, workflowData: { nodes: []; edges: [] }) {
    return await Workflow.findByIdAndUpdate(id, workflowData);
  }

  async deleteWorkflowById(id: string) {
    return await Workflow.findByIdAndDelete(id);
  }
}

export default new WorkflowDao();
