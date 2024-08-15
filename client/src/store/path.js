import { createSlice } from "@reduxjs/toolkit";

export const pathSlice = createSlice({
  name: "path",
  initialState: {
    previousPath: "",
  },
  reducers: {
    savePreviousPath(state, action) {
      state.previousPath = action.payload;
    },
  },
});

export const pathActions = pathSlice.actions;
