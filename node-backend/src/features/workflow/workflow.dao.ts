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
}

export default new WorkflowDao();
