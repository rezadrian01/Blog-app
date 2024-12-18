import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: localStorage.getItem("token") ? true : false,
    username: localStorage.getItem("username") || "",
  },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.username = action.payload.username;
    },
    logout(state, action) {
      localStorage.removeItem("token");
      state.isLoggedIn = false;
      state.username = null;
    },
    checkAuth(state, action) {
      state.isLoggedIn = localStorage.getItem("token") ? true : false;
      state.username = localStorage.getItem("username") || "";
    },
    updateUsername(state, action) {
      state.username = action.payload;
    },
  },
});

export const authActions = authSlice.actions;
