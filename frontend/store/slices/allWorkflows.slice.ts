import axiosInstance from "@/utils/axios";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

export type TNode = {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: {
    label?: string;
    selectedDataset?: string;
    columns?: string[];
  };
};

export type TEdge = {
  id: string;
  source: string;
  target: string;
  data: {
    label?: string;
  };
};

export type TWorflow = {
  _id: string;
  name: string;
  description: string;
  nodes: TNode[];
  edges: TEdge[];
  createdAt: string;
  updatedAt: string;
};

interface IAllWorkflowsState {
  workflows: TWorflow[];
  loading: boolean;
}

export const fetchAllWorkflows = createAsyncThunk(
  "allWorkflows/fetchAllWorkflows",
  async () => {
    try {
      const response = await axiosInstance.get("/workflow");
      return response.data;
    } catch (error: any) {
      throw error.response.data.message;
    }
  }
);

const initialState: IAllWorkflowsState = {
  workflows: [],
  loading: false,
};

const allWorkflowsSlice = createSlice({
  name: "allWorkflows",
  initialState,
  reducers: {
    addWorkflow: (state, action: PayloadAction<TWorflow>) => {
      state.workflows.push(action.payload);
    },
    updateWorkflow: (state, action: PayloadAction<TWorflow>) => {
      state.workflows = state.workflows.map((workflow) =>
        workflow._id === action.payload._id ? action.payload : workflow
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllWorkflows.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchAllWorkflows.fulfilled, (state, action) => {
      state.loading = false;
      state.workflows = action.payload;
    });
    builder.addCase(fetchAllWorkflows.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { addWorkflow, updateWorkflow } = allWorkflowsSlice.actions;

export default allWorkflowsSlice.reducer;
