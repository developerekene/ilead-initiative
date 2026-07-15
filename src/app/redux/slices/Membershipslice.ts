import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { MembershipPlanId } from "../slices/User";

export type BillingCycle = "monthly" | "annual";
export type PaymentStatus = "idle" | "processing" | "success" | "failed";

export interface PaymentRecord {
  reference: string;
  planId: MembershipPlanId;
  billing: BillingCycle;
  amount: number; // in Naira (not kobo)
  currency: string;
  status: "success" | "failed";
  paidAt: string; // ISO timestamp
}

interface MembershipState {
  activePlan: MembershipPlanId;
  billing: BillingCycle;
  paymentStatus: PaymentStatus;
  processingTier: MembershipPlanId | null;
  lastReference: string | null;
  history: PaymentRecord[];
  error: string | null;
}

const initialState: MembershipState = {
  activePlan: "free",
  billing: "monthly",
  paymentStatus: "idle",
  processingTier: null,
  lastReference: null,
  history: [],
  error: null,
};

const membershipSlice = createSlice({
  name: "membership",
  initialState,
  reducers: {
    setBilling(state, action: PayloadAction<BillingCycle>) {
      state.billing = action.payload;
    },

    // Fired when the Paystack popup opens for a given tier
    startPayment(state, action: PayloadAction<MembershipPlanId>) {
      state.paymentStatus = "processing";
      state.processingTier = action.payload;
      state.error = null;
    },

    // Fired on verified successful payment — upgrades the plan and logs it
    paymentSuccess(state, action: PayloadAction<PaymentRecord>) {
      state.activePlan = action.payload.planId;
      state.paymentStatus = "success";
      state.processingTier = null;
      state.lastReference = action.payload.reference;
      state.history.push(action.payload);
    },

    // Fired on failed/verification-failed payment
    paymentFailed(state, action: PayloadAction<string>) {
      state.paymentStatus = "failed";
      state.processingTier = null;
      state.error = action.payload;
    },

    // Fired when the user closes the popup without paying
    cancelPayment(state) {
      state.paymentStatus = "idle";
      state.processingTier = null;
    },

    // Direct plan set with no payment (e.g. downgrading to Free)
    setActivePlan(state, action: PayloadAction<MembershipPlanId>) {
      state.activePlan = action.payload;
      state.paymentStatus = "idle";
      state.processingTier = null;
    },

    clearMembershipError(state) {
      state.error = null;
    },

    resetMembership() {
      return initialState;
    },
  },
});

export const {
  setBilling,
  startPayment,
  paymentSuccess,
  paymentFailed,
  cancelPayment,
  setActivePlan,
  clearMembershipError,
  resetMembership,
} = membershipSlice.actions;

export const selectActivePlan = (state: RootState) =>
  state.membership.activePlan;
export const selectBilling = (state: RootState) => state.membership.billing;
export const selectPaymentStatus = (state: RootState) =>
  state.membership.paymentStatus;
export const selectProcessingTier = (state: RootState) =>
  state.membership.processingTier;
export const selectPaymentHistory = (state: RootState) =>
  state.membership.history;
export const selectMembershipError = (state: RootState) =>
  state.membership.error;

export default membershipSlice.reducer;
