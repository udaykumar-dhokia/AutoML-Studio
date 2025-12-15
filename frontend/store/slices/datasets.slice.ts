import axiosInstance from "@/utils/axios";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

export type TDataset = {
  _id: string;
  name: string;
  description: string;
  url: string;
  d_id: string;
  userId: string;
};

interface IDatasetState {
  datasets: TDataset[];
  loading: boolean;
}

export const fetchDatasets = createAsyncThunk("dataset/fetch", async () => {
  try {
    const response = await axiosInstance.get("/dataset/");
    return response.data;
  } catch (error: any) {
    throw error.response.data.message;
  }
});

const initialState: IDatasetState = {
  datasets: [],
  loading: false,
};

const datasetSlice = createSlice({
  name: "dataset",
  initialState,
  reducers: {
    setDatasets: (state, action: PayloadAction<TDataset[]>) => {
      state.datasets = action.payload;
    },
    addDataset: (state, action: PayloadAction<TDataset>) => {
      state.datasets.push(action.payload);
    },
    deleteDataset: (state, action: PayloadAction<string>) => {
      state.datasets = state.datasets.filter((d) => d._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatasets.fulfilled, (state, action) => {
        state.loading = false;
        state.datasets = action.payload;
      })
      .addCase(fetchDatasets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDatasets.rejected, (state) => {
        state.loading = false;
        state.datasets = [];
      });
  },
});

export const { setDatasets, addDataset, deleteDataset } = datasetSlice.actions;
export default datasetSlice.reducer;
