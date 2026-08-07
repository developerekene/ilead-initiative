import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { WorkshopTypes } from "../../utils/types";

export interface WorkshopState {
  workshops: WorkshopTypes[];
  loading: boolean;
  error: string | null;
  registering: Record<string, boolean>;
  registerError: Record<string, string | null>;
  creatingWorkshop: boolean;
  createError: string | null;
}

const initialState: WorkshopState = {
  workshops: [],
  loading: false,
  error: null,
  registering: {},
  registerError: {},
  creatingWorkshop: false,
  createError: null,
};

const workshopSlice = createSlice({
  name: "workshops",
  initialState,
  reducers: {
    setWorkshops(state, action: PayloadAction<WorkshopTypes[]>) {
      state.workshops = action.payload;
    },

    // Append a newly created workshop without a full refetch
    addWorkshop(state, action: PayloadAction<WorkshopTypes>) {
      state.workshops.push(action.payload);
    },

    setWorkshopsLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setWorkshopsError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },

    // bump a single workshop's enrolled count in place, e.g. after a
    // successful registration, without refetching the whole list
    setWorkshopEnrolled(
      state,
      action: PayloadAction<{ workshopId: string; enrolled: number }>,
    ) {
      const workshop = state.workshops.find(
        (w) => w.id === action.payload.workshopId,
      );
      if (workshop) {
        workshop.enrolled = action.payload.enrolled;
      }
    },

    setRegistering(
      state,
      action: PayloadAction<{ workshopId: string; value: boolean }>,
    ) {
      state.registering[action.payload.workshopId] = action.payload.value;
    },

    setRegisterError(
      state,
      action: PayloadAction<{ workshopId: string; error: string | null }>,
    ) {
      state.registerError[action.payload.workshopId] = action.payload.error;
    },

    clearRegisterError(state, action: PayloadAction<string>) {
      state.registerError[action.payload] = null;
    },

    setCreatingWorkshop(state, action: PayloadAction<boolean>) {
      state.creatingWorkshop = action.payload;
    },

    setCreateError(state, action: PayloadAction<string | null>) {
      state.createError = action.payload;
    },
  },
});

export const {
  setWorkshops,
  addWorkshop,
  setWorkshopsLoading,
  setWorkshopsError,
  setWorkshopEnrolled,
  setRegistering,
  setRegisterError,
  clearRegisterError,
  setCreatingWorkshop,
  setCreateError,
} = workshopSlice.actions;

// Selectors
export const selectWorkshops = (state: RootState) => state.workshops.workshops;
export const selectWorkshopsLoading = (state: RootState) =>
  state.workshops.loading;
export const selectWorkshopsError = (state: RootState) => state.workshops.error;
export const selectWorkshopById = (id: string) => (state: RootState) =>
  state.workshops.workshops.find((w) => w.id === id);
export const selectIsRegistering = (id: string) => (state: RootState) =>
  !!state.workshops.registering[id];
export const selectRegisterError = (id: string) => (state: RootState) =>
  state.workshops.registerError[id] ?? null;
export const selectIsCreatingWorkshop = (state: RootState) =>
  state.workshops.creatingWorkshop;
export const selectCreateError = (state: RootState) =>
  state.workshops.createError;

export default workshopSlice.reducer;

// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import type { RootState } from "../store";
// import { WorkshopTypes } from "../../utils/types";

// export interface WorkshopState {
//   workshops: WorkshopTypes[];
//   loading: boolean;
//   error: string | null;
//   registering: Record<string, boolean>;
//   registerError: Record<string, string | null>;
// }

// const initialState: WorkshopState = {
//   workshops: [],
//   loading: false,
//   error: null,
//   registering: {},
//   registerError: {},
// };

// const workshopSlice = createSlice({
//   name: "workshops",
//   initialState,
//   reducers: {
//     setWorkshops(state, action: PayloadAction<WorkshopTypes[]>) {
//       state.workshops = action.payload;
//     },

//     setWorkshopsLoading(state, action: PayloadAction<boolean>) {
//       state.loading = action.payload;
//     },

//     setWorkshopsError(state, action: PayloadAction<string | null>) {
//       state.error = action.payload;
//     },

//     // bump a single workshop's enrolled count in place, e.g. after a
//     // successful registration, without refetching the whole list
//     setWorkshopEnrolled(
//       state,
//       action: PayloadAction<{ workshopId: string; enrolled: number }>,
//     ) {
//       const workshop = state.workshops.find(
//         (w) => w.id === action.payload.workshopId,
//       );
//       if (workshop) {
//         workshop.enrolled = action.payload.enrolled;
//       }
//     },

//     setRegistering(
//       state,
//       action: PayloadAction<{ workshopId: string; value: boolean }>,
//     ) {
//       state.registering[action.payload.workshopId] = action.payload.value;
//     },

//     setRegisterError(
//       state,
//       action: PayloadAction<{ workshopId: string; error: string | null }>,
//     ) {
//       state.registerError[action.payload.workshopId] = action.payload.error;
//     },

//     clearRegisterError(state, action: PayloadAction<string>) {
//       state.registerError[action.payload] = null;
//     },
//   },
// });

// export const {
//   setWorkshops,
//   setWorkshopsLoading,
//   setWorkshopsError,
//   setWorkshopEnrolled,
//   setRegistering,
//   setRegisterError,
//   clearRegisterError,
// } = workshopSlice.actions;

// // Selectors
// export const selectWorkshops = (state: RootState) => state.workshops.workshops;
// export const selectWorkshopsLoading = (state: RootState) =>
//   state.workshops.loading;
// export const selectWorkshopsError = (state: RootState) => state.workshops.error;
// export const selectWorkshopById = (id: string) => (state: RootState) =>
//   state.workshops.workshops.find((w) => w.id === id);
// export const selectIsRegistering = (id: string) => (state: RootState) =>
//   !!state.workshops.registering[id];
// export const selectRegisterError = (id: string) => (state: RootState) =>
//   state.workshops.registerError[id] ?? null;

// export default workshopSlice.reducer;
