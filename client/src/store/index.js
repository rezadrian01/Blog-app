import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth";
import { pathSlice } from "./path";

const store = configureStore({
  reducer: { auth: authSlice.reducer, path: pathSlice.reducer },
});

export default store;
