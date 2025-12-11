import axiosInstance from "@/utils/axios";
import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

export type TUser = {
  _id?: string;
  first_name: string;
  last_name: string;
  email: string;
};

interface IUserState {
  user: TUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}

const initialState: IUserState = {
  user: null,
  isAuthenticated: false,
  loading: false,
};

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  try {
    const response = await axiosInstance.get("/user/");
    return response.data.user;
  } catch (error: any) {
    throw Error(error.response.data.message);
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      });
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
