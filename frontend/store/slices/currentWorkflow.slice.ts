import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { TNode, TWorflow } from "./allWorkflows.slice";

const initialState: { workflow: TWorflow | null } = {
  workflow: null,
};

const currentWorkflowSlice = createSlice({
  name: "currentWorkflow",
  initialState,
  reducers: {
    setCurrentWorkflow: (state, action: PayloadAction<TWorflow>) => {
      state.workflow = action.payload;
    },
    clearCurrentWorkflow: (state) => {
      state.workflow = null;
    },
    addNode: (state, action: PayloadAction<TNode>) => {
      if (state.workflow) {
        state.workflow.nodes.push(action.payload);
      }
    },
    deleteNode: (state, action: PayloadAction<{ id: string }>) => {
      if (state.workflow) {
        state.workflow.nodes = state.workflow.nodes.filter(
          (node) => node.id !== action.payload.id
        );
      }
    },
  },
});

export const { setCurrentWorkflow, clearCurrentWorkflow, addNode, deleteNode } =
  currentWorkflowSlice.actions;
export default currentWorkflowSlice.reducer;
