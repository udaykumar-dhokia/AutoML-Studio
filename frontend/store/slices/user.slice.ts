import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type TUser = {
  _id?: string;
  first_name: string;
  last_name: string;
  email: string;
};

interface IUserState {
  user: TUser | null;
  isAuthenticated: boolean;
}

const initialState: IUserState = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<TUser>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
