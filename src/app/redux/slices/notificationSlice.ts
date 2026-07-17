import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

/* Types */

export type NotificationType =
  | "ACCEPTED"
  | "RESCHEDULED"
  | "COMPLETED"
  | "NEW_CAMPAIGN"
  | "FLAG_POSTED"
  | "NEED_FULFILLED"
  | "GENERAL";

export interface Notification {
  id: string;
  caseId: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isUnread: boolean;
  senderName: string;
}

interface NotificationState {
  items: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

/* Initial State  */

const initialState: NotificationState = {
  items: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

/*  Helpers */

const computeUnread = (items: Notification[]): number =>
  items.filter((n) => n.isUnread).length;

/*  Slice  */

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    /* Replace the entire notification list (e.g. on fetch from server). */
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.items = action.payload;
      state.unreadCount = computeUnread(action.payload);
    },

    /* Append a single new notification to the top of the list. */
    addNotification(state, action: PayloadAction<Notification>) {
      state.items.unshift(action.payload);
      state.unreadCount = computeUnread(state.items);
    },

    /* Mark a single notification as read by its id. */
    markAsRead(state, action: PayloadAction<string>) {
      const target = state.items.find((n) => n.id === action.payload);
      if (target) {
        target.isUnread = false;
        state.unreadCount = computeUnread(state.items);
      }
    },

    /* Mark every notification as read. */
    markAllAsRead(state) {
      state.items.forEach((n) => {
        n.isUnread = false;
      });
      state.unreadCount = 0;
    },

    /* Remove a single notification by its id. */
    removeNotification(state, action: PayloadAction<string>) {
      state.items = state.items.filter((n) => n.id !== action.payload);
      state.unreadCount = computeUnread(state.items);
    },

    /* Clear the entire notification list. */
    clearNotifications(state) {
      state.items = [];
      state.unreadCount = 0;
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
  },
});

/* Exported Actions */

export const {
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
  setLoading,
  setError,
  clearError,
} = notificationSlice.actions;

/* Selectors */

export const selectNotifications = (state: RootState) =>
  state.notification.items;

export const selectUnreadCount = (state: RootState) =>
  state.notification.unreadCount;

export const selectNotificationLoading = (state: RootState) =>
  state.notification.loading;

export const selectNotificationError = (state: RootState) =>
  state.notification.error;

export const selectUnreadNotifications = (state: RootState) =>
  state.notification.items.filter((n) => n.isUnread);

/*  Reducer */

export default notificationSlice.reducer;
