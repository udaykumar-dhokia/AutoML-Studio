import { inngest } from "./client";
import createContainer from "./functions/createContainer";
import deleteContainter from "./functions/deleteContainer";
import activateWorkflow from "./functions/activateWorkflow";
import deactivateWorkflow from "./functions/deactivateWorkflow";

export const functions = [createContainer, deleteContainter, activateWorkflow, deactivateWorkflow];
export { inngest };
