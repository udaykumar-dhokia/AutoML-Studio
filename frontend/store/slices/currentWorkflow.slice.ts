import { createSlice } from "@reduxjs/toolkit";
import { TWorflow } from "./allWorkflows.slice";

const initialState: { workflow: TWorflow | null } = {
  workflow: null,
};

const currentWorkflowSlice = createSlice({
  name: "currentWorkflow",
  initialState,
  reducers: {
    setCurrentWorkflow: (state, action) => {
      state.workflow = action.payload;
    },
    clearCurrentWorkflow: (state) => {
      state.workflow = null;
    },
  },
});

export const { setCurrentWorkflow, clearCurrentWorkflow } =
  currentWorkflowSlice.actions;
export default currentWorkflowSlice.reducer;
