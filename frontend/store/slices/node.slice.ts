import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import { TNode } from "./allWorkflows.slice";
import axiosInstance from "@/utils/axios";

export type TDatasetNode = TNode & {
  type: "dataset";
  datasetId: string;
};

export type TPreprocessingNode = TNode & {
  type: "preprocessing";
  datasetId: string;
  operation:
    | "Handle Missing Values"
    | "Handle Outliers"
    | "Feature Scaling"
    | "Feature Selection"
    | "Normalization"
    | "Standardization"
    | "No Operation";
};

export type TModelNode = TNode & {
  type: "model";
  datasetId: string;
  model:
    | "Random Forest"
    | "Linear Regression"
    | "Logistic Regression"
    | "Decision Tree"
    | "Naive Bayes"
    | "Support Vector Machine"
    | "K-Nearest Neighbors"
    | "Gradient Boosting"
    | "XGBoost"
    | "Random Forest"
    | "No Operation";
};

export type TWorkflowNode = TNode & {
  _id: string;
  type: string;
  label: string;
  description: string;
  icon: string;
  dataSchema: TDatasetNode | TPreprocessingNode | TModelNode;
};

interface INodeState {
  nodes: TWorkflowNode[];
  loading: boolean;
}

const initialState: INodeState = {
  nodes: [],
  loading: false,
};

export const fetchAvailableNodes = createAsyncThunk(
  "node/fetchAvailableNodes",
  async () => {
    try {
      const response = await axiosInstance.get("/node");
      return response.data;
    } catch (error: any) {
      throw error.response.data.message;
    }
  }
);

const nodeSlice = createSlice({
  name: "node",
  initialState,
  reducers: {
    addNode: (state, action: PayloadAction<TWorkflowNode>) => {
      state.nodes.push(action.payload);
    },
    removeNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter((node) => node._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchAvailableNodes.fulfilled,
      (state, action: PayloadAction<TWorkflowNode[]>) => {
        state.loading = false;
        state.nodes = action.payload;
      }
    );
    builder.addCase(fetchAvailableNodes.rejected, (state) => {
      state.loading = false;
    });
    builder.addCase(fetchAvailableNodes.pending, (state) => {
      state.loading = true;
    });
  },
});

export const { addNode, removeNode } = nodeSlice.actions;

export default nodeSlice.reducer;
