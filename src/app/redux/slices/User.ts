import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface SerializedUser {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  displayName: string;
  isLoggedIn: boolean;
  profileComplete?: boolean;
  loading: boolean;
  error: string | null;
  photoURL?: string | null;
  location?: string | null;
  bio?: string;
  pronouns?: string;
  availability?: string | null;
  contactMethod?: string | null;
  updatedAt?: number;
}

const initialState: SerializedUser = {
  uid: "",
  firstName: "",
  lastName: "",
  email: "",
  displayName: "",
  isLoggedIn: false,
  profileComplete: false,
  loading: false,
  error: null,
  photoURL: null,
  location: "",
  bio: "",
  pronouns: "",
  availability: "",
  contactMethod: "",
  updatedAt: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<SerializedUser>>) {
      Object.assign(state, action.payload);
      console.log(action.payload);
    },

    clearUser() {
      return initialState;
    },

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    clearError(state) {
      state.error = null;
    },

    setProfileComplete(state, action: PayloadAction<boolean>) {
      state.profileComplete = action.payload;
    },
  },
});

export const {
  setUser,
  clearUser,
  setLoading,
  setError,
  clearError,
  setProfileComplete,
} = userSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.user;
export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;
export const selectProfileComplete = (state: RootState) =>
  state.user.profileComplete;

export default userSlice.reducer;
