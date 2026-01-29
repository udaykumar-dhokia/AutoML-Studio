import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { TNode, TWorflow } from "./allWorkflows.slice";

const initialState: { workflow: TWorflow | null; isInitializing: boolean } = {
  workflow: null,
  isInitializing: false,
};

const currentWorkflowSlice = createSlice({
  name: "currentWorkflow",
  initialState,
  reducers: {
    setCurrentWorkflow: (state, action: PayloadAction<TWorflow & { isInitializing?: boolean }>) => {
      state.workflow = action.payload;
      if (action.payload.isInitializing !== undefined) {
        state.isInitializing = action.payload.isInitializing;
      } else {
        state.isInitializing = false;
      }
    },
    setIsInitializing: (state, action: PayloadAction<boolean>) => {
      state.isInitializing = action.payload;
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
    spinUpWorkflow: (state, action: PayloadAction<string>) => {
      if (state.workflow) {
        state.workflow.status = true;
      }
    },

    spinDownWorkflow: (state, action: PayloadAction<string>) => {
      if (state.workflow) {
        state.workflow.status = false;
      }
    },

  },
});

export const {
  setCurrentWorkflow,
  clearCurrentWorkflow,
  addNode,
  deleteNode,
  setIsInitializing,
  spinUpWorkflow,
  spinDownWorkflow,
} = currentWorkflowSlice.actions;
export default currentWorkflowSlice.reducer;
