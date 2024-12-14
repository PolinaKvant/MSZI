import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { UserInfo } from "../api/myapi";

interface CounterState {
  userData: UserInfo | null;
}

const initialState = { userData: null } satisfies CounterState as CounterState;

const userDataSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserInfo | null>) => {
      state.userData = action.payload;
    },
  },
});

export const { setUserData } = userDataSlice.actions;
export const userDataReducer = userDataSlice.reducer;
