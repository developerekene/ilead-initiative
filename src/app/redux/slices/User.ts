import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  firstName: "",
  lastName: "",
  email: "",
};

export const user = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<Partial<any>>) {
      return { ...state, ...action.payload };
    },

    logoutUser() {
      return { ...initialState };
    },
  },
});

export const { setUser, logoutUser } = user.actions;

export default user.reducer;
