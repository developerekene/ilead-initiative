import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/User";
import campaignReducer from "./slices/campaignSlice";
import membershipReducer from "./slices/Membershipslice";
import notificationReducer from "./slices/notificationSlice";
import workshopReducer from "./slices/workshopSlice";
import consultantReducer from "./slices/consultantSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    campaignSlice: campaignReducer,
    membership: membershipReducer,
    notification: notificationReducer,
    workshops: workshopReducer,
    consultants: consultantReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
