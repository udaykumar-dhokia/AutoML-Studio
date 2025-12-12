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
  },
});

export const { setCurrentWorkflow, clearCurrentWorkflow, addNode } =
  currentWorkflowSlice.actions;
export default currentWorkflowSlice.reducer;
