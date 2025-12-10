import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TDataset = {
  _id: string;
  name: string;
  description: string;
  url: string;
  d_id: string;
  user_id: string;
};

interface IDatasetState {
  datasets: TDataset[];
}

const initialState: IDatasetState = {
  datasets: [],
};

const datasetSlice = createSlice({
  name: "dataset",
  initialState,
  reducers: {
    setDatasets: (state, action: PayloadAction<TDataset[]>) => {
      state.datasets = action.payload;
    },
  },
});

export const { setDatasets } = datasetSlice.actions;
export default datasetSlice.reducer;
