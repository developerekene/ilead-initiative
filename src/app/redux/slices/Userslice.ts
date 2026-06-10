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
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../../firebase";

export interface SerializedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

interface UserState {
  user: SerializedUser | null;
  profileComplete: boolean | null; // null = not yet fetched from Firestore
  loading: boolean;
  error: string | null;
}

const serializeUser = (user: User): SerializedUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
  emailVerified: user.emailVerified,
});

const writeUserDoc = async (
  uid: string,
  data: {
    firstName: string;
    lastName: string;
    displayName: string;
    email: string;
    accountType: string;
    photoURL?: string | null;
    profileComplete: boolean;
  },
) => {
  await setDoc(
    doc(db, "users", uid),
    { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
    { merge: true },
  );
};

// ─── Helper: read profileComplete from Firestore ──────────────────────────────
const fetchProfileComplete = async (uid: string): Promise<boolean> => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data()?.profileComplete ?? false) : false;
};

// ─── Async Thunks ─────────────────────────────────────────────────────────────

export const loginWithEmail = createAsyncThunk(
  "user/loginWithEmail",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Fetch profileComplete so Login can route correctly:
      // returning user with complete profile → dashboard
      // incomplete → complete-profile
      const profileComplete = await fetchProfileComplete(result.user.uid);
      return { user: serializeUser(result.user), profileComplete };
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
      const displayName = `${firstName} ${lastName}`.trim();
      await updateProfile(result.user, { displayName });

      const accountType =
        sessionStorage.getItem("ilead_account_type") ?? "individual";
      await writeUserDoc(result.user.uid, {
        firstName,
        lastName,
        displayName,
        email,
        accountType,
        photoURL: result.user.photoURL,
        profileComplete: false, // always false — new user hasn't filled form yet
      });

      // profileComplete is always false for brand new registrations
      return {
        user: serializeUser({ ...result.user, displayName }),
        profileComplete: false,
      };
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
      const { user } = result;

      // Check BEFORE writing — if profileComplete is already true this is
      // a returning user and we must not overwrite their data
      const existingSnap = await getDoc(doc(db, "users", user.uid));
      const isReturning =
        existingSnap.exists() && existingSnap.data()?.profileComplete === true;

      if (!isReturning) {
        // First-time Google sign-up — write the initial doc
        const parts = (user.displayName ?? "").split(" ");
        const firstName = parts[0] ?? "";
        const lastName = parts.slice(1).join(" ");
        const accountType =
          sessionStorage.getItem("ilead_account_type") ?? "individual";

        await writeUserDoc(user.uid, {
          firstName,
          lastName,
          displayName: user.displayName ?? "",
          email: user.email ?? "",
          accountType,
          photoURL: user.photoURL,
          profileComplete: false,
        });
      }

      return { user: serializeUser(user), profileComplete: isReturning };
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

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState: UserState = {
  user: null,
  profileComplete: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Called by AuthListener in AppEntry — payload is pre-serialized so
    // Immer never receives a Firebase class instance
    setUser(
      state,
      action: {
        payload: {
          user: SerializedUser | null;
          profileComplete?: boolean;
        } | null;
        type: string;
      },
    ) {
      if (!action.payload || !action.payload.user) {
        // Signed out or no active session
        state.user = null;
        state.profileComplete = null;
      } else {
        state.user = action.payload.user;
        // Only set profileComplete when explicitly passed in — avoids
        // overwriting a value already set by a thunk with undefined
        if (action.payload.profileComplete !== undefined) {
          state.profileComplete = action.payload.profileComplete;
        }
      }
      state.loading = false;
      state.error = null;
    },
    // Dispatched by CompleteProfile after a successful Firestore save —
    // flips the flag in Redux instantly so Dashboard guard passes without
    // waiting for another Firestore read
    setProfileComplete(state) {
      state.profileComplete = true;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // loginWithEmail
    builder
      .addCase(loginWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profileComplete = action.payload.profileComplete;
      })
      .addCase(loginWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // registerWithEmail
    builder
      .addCase(registerWithEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerWithEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profileComplete = action.payload.profileComplete; // always false
      })
      .addCase(registerWithEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // loginWithGoogle
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profileComplete = action.payload.profileComplete;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // logoutUser
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.profileComplete = null; // reset on logout
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // sendPasswordReset
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

export const { setUser, setProfileComplete, clearError } = userSlice.actions;

export const selectUser = (state: { user: UserState }) => state.user.user;
export const selectUserLoading = (state: { user: UserState }) =>
  state.user.loading;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectIsLoggedIn = (state: { user: UserState }) =>
  !!state.user.user;
export const selectProfileComplete = (state: { user: UserState }) =>
  state.user.profileComplete;
export const selectDisplayName = (state: { user: UserState }) =>
  state.user.user?.displayName ?? null;

export default userSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
//   signOut,
//   updateProfile,
//   sendPasswordResetEmail,
//   User,
// } from "firebase/auth";
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import { auth, db } from "../../firebase";

// export interface SerializedUser {
//   uid: string;
//   email: string | null;
//   displayName: string | null;
//   photoURL: string | null;
//   emailVerified: boolean;
// }

// interface UserState {
//   user: SerializedUser | null;
//   loading: boolean;
//   error: string | null;
// }

// const serializeUser = (user: User): SerializedUser => ({
//   uid: user.uid,
//   email: user.email,
//   displayName: user.displayName,
//   photoURL: user.photoURL,
//   emailVerified: user.emailVerified,
// });

// // ─── Helper: write / merge users/{uid} in Firestore ──────────────────────────
// // merge: true means re-logins won't overwrite fields set by CompleteProfile
// const writeUserDoc = async (
//   uid: string,
//   data: {
//     firstName: string;
//     lastName: string;
//     displayName: string;
//     email: string;
//     accountType: string;
//     photoURL?: string | null;
//     profileComplete: boolean;
//   },
// ) => {
//   await setDoc(
//     doc(db, "users", uid),
//     {
//       ...data,
//       createdAt: serverTimestamp(),
//       updatedAt: serverTimestamp(),
//     },
//     { merge: true }, // safe for both first sign-up and Google re-logins
//   );
// };

// // ─── Async Thunks

// export const loginWithEmail = createAsyncThunk(
//   "user/loginWithEmail",
//   async (
//     { email, password }: { email: string; password: string },
//     { rejectWithValue },
//   ) => {
//     try {
//       const result = await signInWithEmailAndPassword(auth, email, password);
//       return serializeUser(result.user);
//     } catch (error: any) {
//       return rejectWithValue(error.message as string);
//     }
//   },
// );

// export const registerWithEmail = createAsyncThunk(
//   "user/registerWithEmail",
//   async (
//     {
//       email,
//       password,
//       firstName,
//       lastName,
//     }: {
//       email: string;
//       password: string;
//       firstName: string;
//       lastName: string;
//     },
//     { rejectWithValue },
//   ) => {
//     try {
//       // 1. Create Firebase Auth user
//       const result = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password,
//       );

//       // 2. Set displayName on the Auth profile immediately
//       const displayName = `${firstName} ${lastName}`.trim();
//       await updateProfile(result.user, { displayName });

//       // 3. Write initial Firestore user doc
//       //    accountType is read from sessionStorage here because the thunk
//       //    runs before CompleteProfile can write it — CompleteProfile will
//       //    update this field later via updateDoc when profile is completed.
//       const accountType =
//         sessionStorage.getItem("ilead_account_type") ?? "individual";
//       await writeUserDoc(result.user.uid, {
//         firstName,
//         lastName,
//         displayName,
//         email,
//         accountType,
//         photoURL: result.user.photoURL,
//         profileComplete: false, // CompleteProfile sets this to true
//       });

//       return serializeUser({ ...result.user, displayName });
//     } catch (error: any) {
//       return rejectWithValue(error.message as string);
//     }
//   },
// );

// export const loginWithGoogle = createAsyncThunk(
//   "user/loginWithGoogle",
//   async (_, { rejectWithValue }) => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       const { user } = result;

//       // Split Google displayName into first / last (best-effort)
//       const parts = (user.displayName ?? "").split(" ");
//       const firstName = parts[0] ?? "";
//       const lastName = parts.slice(1).join(" ");

//       const accountType =
//         sessionStorage.getItem("ilead_account_type") ?? "individual";

//       // merge:true means existing users who sign in again won't lose
//       // profile data written by CompleteProfile
//       await writeUserDoc(user.uid, {
//         firstName,
//         lastName,
//         displayName: user.displayName ?? "",
//         email: user.email ?? "",
//         accountType,
//         photoURL: user.photoURL,
//         profileComplete: false,
//       });

//       return serializeUser(user);
//     } catch (error: any) {
//       return rejectWithValue(error.message as string);
//     }
//   },
// );

// export const logoutUser = createAsyncThunk(
//   "user/logoutUser",
//   async (_, { rejectWithValue }) => {
//     try {
//       await signOut(auth);
//     } catch (error: any) {
//       return rejectWithValue(error.message as string);
//     }
//   },
// );

// export const sendPasswordReset = createAsyncThunk(
//   "user/sendPasswordReset",
//   async ({ email }: { email: string }, { rejectWithValue }) => {
//     try {
//       await sendPasswordResetEmail(auth, email);
//     } catch (error: any) {
//       return rejectWithValue(error.message as string);
//     }
//   },
// );

// // ─── Slice

// const initialState: UserState = {
//   user: null,
//   loading: false,
//   error: null,
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     // Called by Firebase's onAuthStateChanged listener in your app entry point
//     setUser(state, action) {
//       state.user = action.payload ? serializeUser(action.payload) : null;
//       state.loading = false;
//       state.error = null;
//     },
//     clearError(state) {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // loginWithEmail
//     builder
//       .addCase(loginWithEmail.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginWithEmail.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(loginWithEmail.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });

//     // registerWithEmail
//     builder
//       .addCase(registerWithEmail.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerWithEmail.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(registerWithEmail.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });

//     // loginWithGoogle
//     builder
//       .addCase(loginWithGoogle.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginWithGoogle.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(loginWithGoogle.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });

//     // logoutUser
//     builder
//       .addCase(logoutUser.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.loading = false;
//         state.user = null;
//         state.error = null;
//       })
//       .addCase(logoutUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });

//     // sendPasswordReset
//     builder
//       .addCase(sendPasswordReset.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(sendPasswordReset.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(sendPasswordReset.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { setUser, clearError } = userSlice.actions;

// // Selectors
// export const selectUser = (state: { user: UserState }) => state.user.user;
// export const selectUserLoading = (state: { user: UserState }) =>
//   state.user.loading;
// export const selectUserError = (state: { user: UserState }) => state.user.error;
// export const selectIsLoggedIn = (state: { user: UserState }) =>
//   !!state.user.user;
// export const selectDisplayName = (state: { user: UserState }) =>
//   state.user.user?.displayName ?? null;

// export default userSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
//   signOut,
//   updateProfile,
//   sendPasswordResetEmail,
//   User,
// } from "firebase/auth";
// import { auth } from "../../firebase";

// export interface SerializedUser {
//   uid: string;
//   email: string | null;
//   displayName: string | null;
//   photoURL: string | null;
//   emailVerified: boolean;
// }

// interface UserState {
//   user: SerializedUser | null;
//   loading: boolean;
//   error: string | null;
// }

// // Firebase User objects are not serializable — strip to plain object for Redux
// const serializeUser = (user: User): SerializedUser => ({
//   uid: user.uid,
//   email: user.email,
//   displayName: user.displayName,
//   photoURL: user.photoURL,
//   emailVerified: user.emailVerified,
// });

// // ── Async Thunks ──────────────────────────────────────────────────────────────

// export const loginWithEmail = createAsyncThunk(
//   "user/loginWithEmail",
//   async (
//     { email, password }: { email: string; password: string },
//     { rejectWithValue },
//   ) => {
//     try {
//       const result = await signInWithEmailAndPassword(auth, email, password);
//       return serializeUser(result.user);
//     } catch (error: any) {
//       return rejectWithValue(error.message as string);
//     }
//   },
// );

// export const registerWithEmail = createAsyncThunk(
//   "user/registerWithEmail",
//   async (
//     {
//       email,
//       password,
//       firstName,
//       lastName,
//     }: {
//       email: string;
//       password: string;
//       firstName: string;
//       lastName: string;
//     },
//     { rejectWithValue },
//   ) => {
//     try {
//       const result = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password,
//       );
//       // Set display name immediately after registration
//       await updateProfile(result.user, {
//         displayName: `${firstName} ${lastName}`,
//       });
//       return serializeUser({
//         ...result.user,
//         displayName: `${firstName} ${lastName}`,
//       });
//     } catch (error: any) {
//       return rejectWithValue(error.message as string);
//     }
//   },
// );

// export const loginWithGoogle = createAsyncThunk(
//   "user/loginWithGoogle",
//   async (_, { rejectWithValue }) => {
//     try {
//       const provider = new GoogleAuthProvider();
//       const result = await signInWithPopup(auth, provider);
//       return serializeUser(result.user);
//     } catch (error: any) {
//       return rejectWithValue(error.message as string);
//     }
//   },
// );

// export const logoutUser = createAsyncThunk(
//   "user/logoutUser",
//   async (_, { rejectWithValue }) => {
//     try {
//       await signOut(auth);
//     } catch (error: any) {
//       return rejectWithValue(error.message as string);
//     }
//   },
// );

// export const sendPasswordReset = createAsyncThunk(
//   "user/sendPasswordReset",
//   async ({ email }: { email: string }, { rejectWithValue }) => {
//     try {
//       await sendPasswordResetEmail(auth, email);
//     } catch (error: any) {
//       return rejectWithValue(error.message as string);
//     }
//   },
// );

// // ── Initial State ─────────────────────────────────────────────────────────────

// const initialState: UserState = {
//   user: null,
//   loading: false,
//   error: null,
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     // Called by Firebase's onAuthStateChanged listener in your app entry point
//     setUser(state, action) {
//       state.user = action.payload ? serializeUser(action.payload) : null;
//       state.loading = false;
//       state.error = null;
//     },
//     clearError(state) {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // ── loginWithEmail ──
//     builder
//       .addCase(loginWithEmail.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginWithEmail.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(loginWithEmail.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });

//     // ── registerWithEmail ──
//     builder
//       .addCase(registerWithEmail.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(registerWithEmail.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(registerWithEmail.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });

//     // ── loginWithGoogle ──
//     builder
//       .addCase(loginWithGoogle.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(loginWithGoogle.fulfilled, (state, action) => {
//         state.loading = false;
//         state.user = action.payload;
//       })
//       .addCase(loginWithGoogle.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });

//     // ── logoutUser ──
//     builder
//       .addCase(logoutUser.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(logoutUser.fulfilled, (state) => {
//         state.loading = false;
//         state.user = null;
//         state.error = null;
//       })
//       .addCase(logoutUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });

//     // ── sendPasswordReset ──
//     builder
//       .addCase(sendPasswordReset.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(sendPasswordReset.fulfilled, (state) => {
//         state.loading = false;
//       })
//       .addCase(sendPasswordReset.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export const { setUser, clearError } = userSlice.actions;

// export const selectUser = (state: { user: UserState }) => state.user.user;
// export const selectUserLoading = (state: { user: UserState }) =>
//   state.user.loading;
// export const selectUserError = (state: { user: UserState }) => state.user.error;
// export const selectIsLoggedIn = (state: { user: UserState }) =>
//   !!state.user.user;
// export const selectDisplayName = (state: { user: UserState }) =>
//   state.user.user?.displayName ?? null;

// export default userSlice.reducer;
