import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../app/firebase";

export interface SerializedUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export interface AuthResult {
  user: SerializedUser;
  profileComplete: boolean;
}

// Helpers (internal)

export const serializeUser = (user: User): SerializedUser => ({
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
): Promise<void> => {
  await setDoc(
    doc(db, "users", uid),
    { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() },
    { merge: true },
  );
};

export const fetchProfileComplete = async (uid: string): Promise<boolean> => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data()?.profileComplete ?? false) : false;
};

// Auth operations (exported)

export const signInWithEmail = async (
  email: string,
  password: string,
): Promise<AuthResult> => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  const profileComplete = await fetchProfileComplete(result.user.uid);
  return { user: serializeUser(result.user), profileComplete };
};

export const registerWithEmail = async (
  email: string,
  firstName: string,
  lastName: string,
): Promise<AuthResult> => {
  const result = await createUserWithEmailAndPassword(auth, email);
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
    profileComplete: false,
  });

  return {
    user: serializeUser({ ...result.user, displayName } as User),
    profileComplete: false,
  };
};

export const signInWithGoogle = async (): Promise<AuthResult> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const { user } = result;

  const existingSnap = await getDoc(doc(db, "users", user.uid));
  const isReturning =
    existingSnap.exists() && existingSnap.data()?.profileComplete === true;

  if (!isReturning) {
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
};

export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const sendPasswordReset = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

export const subscribeToAuthChanges = (
  callback: (user: User | null) => void,
): Unsubscribe => {
  return onAuthStateChanged(auth, callback);
};
