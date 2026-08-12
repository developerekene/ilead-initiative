import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { ConsultantTypes } from "../../utils/types";

export interface ConsultantState {
  consultants: ConsultantTypes[];
  loading: boolean;
  error: string | null;
  creatingConsultant: boolean;
  createError: string | null;
}

const initialState: ConsultantState = {
  consultants: [],
  loading: false,
  error: null,
  creatingConsultant: false,
  createError: null,
};

const consultantSlice = createSlice({
  name: "consultants",
  initialState,
  reducers: {
    setConsultants(state, action: PayloadAction<ConsultantTypes[]>) {
      state.consultants = action.payload;
    },

    addConsultant(state, action: PayloadAction<ConsultantTypes>) {
      state.consultants.push(action.payload);
    },

    setConsultantsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setConsultantsError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    setCreatingConsultant(state, action: PayloadAction<boolean>) {
      state.creatingConsultant = action.payload;
    },

    setCreateConsultantError(state, action: PayloadAction<string | null>) {
      state.createError = action.payload;
    },
  },
});

export const {
  setConsultants,
  addConsultant,
  setConsultantsLoading,
  setConsultantsError,
  setCreatingConsultant,
  setCreateConsultantError,
} = consultantSlice.actions;

// Selectors
export const selectConsultants = (state: RootState) =>
  state.consultants.consultants;
export const selectConsultantsLoading = (state: RootState) =>
  state.consultants.loading;
export const selectConsultantsError = (state: RootState) =>
  state.consultants.error;
export const selectConsultantById = (id: string) => (state: RootState) =>
  state.consultants.consultants.find((c) => c.id === id);
export const selectIsCreatingConsultant = (state: RootState) =>
  state.consultants.creatingConsultant;
export const selectCreateConsultantError = (state: RootState) =>
  state.consultants.createError;

export default consultantSlice.reducer;
