import { setCurrentWorkflow } from "@/store/slices/currentWorkflow.slice";
import { store } from "@/store/store";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export const handleWorkflowRoute = (workflow: any, router: AppRouterInstance) => {
    store.dispatch(setCurrentWorkflow(workflow));
    localStorage.setItem("currentWorkflowId", workflow._id);
    router.push(`/workflow`);
  };