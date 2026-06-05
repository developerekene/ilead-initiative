import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";
import { auth } from "../../firebase";

export interface SerializedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

interface UserState {
  user: SerializedUser | null;
  loading: boolean;
  error: string | null;
}

// Firebase User objects are not serializable — strip to plain object for Redux
const serializeUser = (user: User): SerializedUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  emailVerified: user.emailVerified,
});

// ── Async Thunks ──────────────────────────────────────────────────────────────

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return serializeUser(result.user);
    } catch (error: any) {
      return rejectWithValue(error.message as string);
    }
  },
);

export const registerWithEmail = createAsyncThunk(
  "user/registerWithEmail",
  async (
    {
      email,
      password,
      firstName,
      lastName,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      // Set display name immediately after registration
      await updateProfile(result.user, {
        displayName: `${firstName} ${lastName}`,
      });
      return serializeUser({
        ...result.user,
        displayName: `${firstName} ${lastName}`,
      });
    } catch (error: any) {
      return rejectWithValue(error.message as string);
    }
  },
);

export const loginWithGoogle = createAsyncThunk(
  "user/loginWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      return serializeUser(result.user);
    } catch (error: any) {
      return rejectWithValue(error.message as string);
    }
  },
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
    } catch (error: any) {
      return rejectWithValue(error.message as string);
    }
  },
);

export const sendPasswordReset = createAsyncThunk(
  "user/sendPasswordReset",
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      return rejectWithValue(error.message as string);
    }
  },
);

// ── Initial State ─────────────────────────────────────────────────────────────

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Called by Firebase's onAuthStateChanged listener in your app entry point
    setUser(state, action) {
      state.user = action.payload ? serializeUser(action.payload) : null;
      state.loading = false;
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── loginWithEmail ──
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── registerWithEmail ──
    builder
      .addCase(registerWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── loginWithGoogle ──
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── logoutUser ──
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── sendPasswordReset ──
    builder
      .addCase(sendPasswordReset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendPasswordReset.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendPasswordReset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearError } = userSlice.actions;

export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectUserLoading = (state: { user: UserState }) =>
  state.user.loading;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectIsLoggedIn = (state: { user: UserState }) =>
  !!state.user.user;
export const selectDisplayName = (state: { user: UserState }) =>
  state.user.user?.displayName ?? null;

export default userSlice.reducer;
