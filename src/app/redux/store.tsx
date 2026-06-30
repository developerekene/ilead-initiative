import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/User";
import campaignReducer from "./slices/campaignSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    campaignSlice: campaignReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
