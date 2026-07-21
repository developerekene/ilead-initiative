import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

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
  /** Optional structured metadata for the detail view (e.g. title, category, description, resourceType) */
  metadata?: Record<string, string>;
}

interface NotificationState {
  items: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

/* ─── localStorage persistence ─────────────────────── */

const STORAGE_KEY = "ilead_notifications";

const saveToStorage = (items: Notification[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* storage full or unavailable — silently ignore */
  }
};

const loadFromStorage = (): Notification[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Notification[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* corrupted data — start fresh */
  }
  return [];
};

/*  Helpers */

const computeUnread = (items: Notification[]): number =>
  items.filter((n) => n.isUnread).length;

/* Format a timestamp into a human-readable relative string (e.g. "2 minutes ago") */
export const formatRelativeTime = (isoString: string): string =>
  dayjs(isoString).fromNow();

/* Hydrate initial state from localStorage so notifications survive refresh */
const persistedItems = loadFromStorage();
const initialState: NotificationState = {
  items: persistedItems,
  unreadCount: computeUnread(persistedItems),
  loading: false,
  error: null,
};

/*  Slice  */

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    /* Replace the entire notification list (e.g. on fetch from server). */
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.items = action.payload;
      state.unreadCount = computeUnread(action.payload);
      saveToStorage(state.items);
    },

    /* Append a single new notification to the top of the list. */
    addNotification(state, action: PayloadAction<Notification>) {
      state.items.unshift(action.payload);
      state.unreadCount = computeUnread(state.items);
      saveToStorage(state.items);
    },
    /* Mark a single notification as read by its id. */
    markAsRead(state, action: PayloadAction<string>) {
      const target = state.items.find((n) => n.id === action.payload);
      if (target) {
        target.isUnread = false;
        state.unreadCount = computeUnread(state.items);
        saveToStorage(state.items);
      }
    },

    /* Mark every notification as read. */
    markAllAsRead(state) {
      state.items.forEach((n) => {
        n.isUnread = false;
      });
      state.unreadCount = 0;
      saveToStorage(state.items);
    },

    /* Remove a single notification by its id. */
    removeNotification(state, action: PayloadAction<string>) {
      state.items = state.items.filter((n) => n.id !== action.payload);
      state.unreadCount = computeUnread(state.items);
      saveToStorage(state.items);
    },

    /* Clear the entire notification list. */
    clearNotifications(state) {
      state.items = [];
      state.unreadCount = 0;
      saveToStorage(state.items);
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
