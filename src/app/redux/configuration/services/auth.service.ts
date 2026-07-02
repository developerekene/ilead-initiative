import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, db } from "../../../firebase";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { store } from "../../store";
import { clearUser, setPlan, setUser } from "../../slices/User";
import { resolve } from "path";
import { error } from "console";

interface RegistrationInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  accountType?: string;
}

const generateUniqueId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

const getCurrentUserPromise = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    const unsuscribe = auth.onAuthStateChanged((user) => {
      unsuscribe();
      if (user) {
        resolve(user);
      } else {
        reject(new Error("No user is currently signed in"));
      }
    });
  });
};

const googleProvider = new GoogleAuthProvider();

export class AuthService {
  async getCurrentUser(): Promise<any> {
    return getCurrentUserPromise();
  }

  async handleUserRegistration(userData: any): Promise<any> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password,
      );
      const user = userCredential.user;
      const systemsOneAccount = {
        user: {
          primaryInformation: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            isUserLoggedIn: true,
            userType: userData.accountType,
            userId: user.uid,
          },
          secondaryInformation: {
            accountType: userData.accountType,
            userReferenceId: user.uid + generateUniqueId(),
          },
          locationAndTime: {
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            locale: navigator.language,
            location: "",
          },
        },
      };

      const userDocData = doc(collection(db, "users"), user.uid);
      await setDoc(userDocData, systemsOneAccount);
      const userSnapshot = await getDoc(userDocData);
      if (userSnapshot.exists()) {
        const getUserData = userSnapshot.data();
        const dataForRedux = getUserData?.user?.primaryInformation;
        store.dispatch(
          setUser({
            uid: user.uid,
            email: dataForRedux?.email,
            firstName: dataForRedux?.firstName,
            lastName: dataForRedux?.lastName,
            displayName:
              `${dataForRedux?.firstName ?? ""} ${dataForRedux?.lastName ?? ""}`.trim(),
            isLoggedIn: true,
            plan: "free",
            profileComplete: false,
          }),
        );
      }
    } catch (error) {
      console.error("Error during user registration:", error);
      throw error;
    } finally {
    }
  }
  //Google sign-in / sign-up
  //Used for both JoinCommunity (new accounts) and Login (returning users).
  async handleGoogleAuth(accountType?: string): Promise<any> {
    try {
      const credential = await signInWithPopup(auth, googleProvider);
      const user = credential.user;

      const userDocData = doc(collection(db, "users"), user.uid);
      const existingSnapshot = await getDoc(userDocData);

      if (!existingSnapshot.exists()) {
        const [firstName = "", lastName = ""] = (user.displayName ?? "").split(
          " ",
        );

        const systemsOneAccount = {
          user: {
            primaryInformation: {
              firstName,
              lastName,
              email: user.email ?? "",
              isUserLoggedIn: true,
              userType: accountType ?? "individual",
              userId: user.uid,
            },
            secondaryInformation: {
              accountType: accountType ?? "individual",
              userReferenceId: user.uid + generateUniqueId(),
            },
            locationAndTime: {
              timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
              locale: navigator.language,
              location: "",
            },
          },
          profileComplete: false,
        };

        await setDoc(userDocData, systemsOneAccount);
      }

      const userSnapshot = await getDoc(userDocData);
      if (userSnapshot.exists()) {
        const getUserData = userSnapshot.data();
        const dataForRedux = getUserData?.user?.primaryInformation;
        store.dispatch(
          setUser({
            uid: user.uid,
            email: dataForRedux?.email ?? user.email ?? "",
            firstName: dataForRedux?.firstName ?? "",
            lastName: dataForRedux?.lastName ?? "",
            displayName:
              `${dataForRedux?.firstName ?? ""} ${dataForRedux?.lastName ?? ""}`.trim() ||
              user.displayName ||
              "",
            isLoggedIn: true,
            profileComplete: getUserData?.profileComplete ?? false,
            plan: getUserData?.user?.plan ?? "free",
            photoURL: user.photoURL,
          }),
        );
        return getUserData;
      }
    } catch (error) {
      console.error("Error during Google authentication:", error);
      throw error;
    }
  }

  async handleUserLoginWithEmailPassword(
    email: string,
    password: string,
  ): Promise<any> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      const userDocData = doc(collection(db, "users"), user.uid);
      const userSnapshot = await getDoc(userDocData);

      if (userSnapshot.exists()) {
        const getUserData = userSnapshot.data();
        const dataForRedux = getUserData?.user?.primaryInformation;

        store.dispatch(
          setUser({
            uid: user.uid,
            email: dataForRedux?.email ?? user.email ?? "",
            firstName: dataForRedux?.firstName ?? "",
            lastName: dataForRedux?.lastName ?? "",
            displayName:
              `${dataForRedux?.firstName ?? ""} ${dataForRedux?.lastName ?? ""}`.trim() ||
              user.displayName ||
              "",
            isLoggedIn: true,
            profileComplete: getUserData?.profileComplete ?? false,
            plan: getUserData?.user?.plan ?? "free",
            photoURL: user.photoURL,
          }),
        );

        return getUserData;
      }

      store.dispatch(
        setUser({
          uid: user.uid,
          email: user.email ?? email,
          displayName: user.displayName ?? "",
          isLoggedIn: true,
          profileComplete: false,

          photoURL: user.photoURL,
        }),
      );
      return null;
    } catch (error) {
      console.error("Error during email/password login:", error);
      throw error;
    }
  }

  //NEW
  async updateUserInformation(updateData: Partial<any>): Promise<void> {
    try {
      const currentUser = await this.getCurrentUser();
      const userId = currentUser.uid;
      const userDoc = doc(db, "users", userId);
      const userSnapShot = await getDoc(userDoc);
      if (!userSnapShot.exists()) throw new Error("user not found");
      const currentData = userSnapShot.data();

      // Pull out fields that must live at the document root —
      // every read path (handleGoogleAuth, hydrateUser, AuthListener)
      // checks profileComplete at the top level, not nested under
      // user.secondaryInformation
      const { profileComplete, ...restOfUpdate } = updateData;

      const updatePrimaryInfo = {
        ...currentData.user.secondaryInformation,
        ...restOfUpdate,
      };

      const writePayload: Record<string, any> = {
        "user.secondaryInformation": updatePrimaryInfo,
      };

      if (profileComplete !== undefined) {
        writePayload.profileComplete = profileComplete;
      }

      await updateDoc(userDoc, writePayload);

      store.dispatch(
        setUser({
          ...updatePrimaryInfo,
          ...(profileComplete !== undefined ? { profileComplete } : {}),
        }),
      );
    } catch (error) {
      console.error("Error updating primary information:", error);
      throw error;
    }
  }
  async handlePasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  }

  async handleUserSignout(): Promise<void> {
    await signOut(auth)
      .then(() => store.dispatch(clearUser()))
      .catch((error: any) => {
        console.log("user not signed out", error);
      });
  }

  // async updateMembershipPlan(
  //   planId: string,
  //   paymentMeta?: {
  //     reference: string;
  //     billing: "monthly" | "annual";
  //     amount: number;
  //   },
  // ): Promise<void> {
  //   try {
  //     const currentUser = await this.getCurrentUser();
  //     const userId = currentUser.uid;
  //     const userDoc = doc(db, "users", userId);

  //     const snapshot = await getDoc(userDoc);
  //     if (!snapshot.exists()) throw new Error("User not found");

  //     // Write plan at document root — matches how profileComplete is stored/read
  //     const writePayload: Record<string, any> = {
  //       plan: planId,
  //       planUpdatedAt: Date.now(),
  //     };

  //     // Append a payment record to history if this came from a real transaction
  //     if (paymentMeta) {
  //       const existing = snapshot.data()?.membershipHistory ?? [];
  //       writePayload.membershipHistory = [
  //         ...existing,
  //         {
  //           planId,
  //           reference: paymentMeta.reference,
  //           billing: paymentMeta.billing,
  //           amount: paymentMeta.amount,
  //           paidAt: new Date().toISOString(),
  //         },
  //       ];
  //     }

  //     await updateDoc(userDoc, writePayload);

  //     // Sync Redux so UI updates immediately
  //     store.dispatch(setPlan(planId as any));
  //   } catch (error) {
  //     console.error("Error updating membership plan:", error);
  //     throw error;
  //   }
  // }
  async handleMembershipPlan(
    planId: string,
    paymentMeta?: {
      reference: string;
      billing: "monthly" | "annual";
      amount: number;
    },
  ): Promise<void> {
    try {
      const currentUser = await this.getCurrentUser();
      const userId = currentUser.uid;
      const userDoc = doc(db, "users", userId);

      const snapshot = await getDoc(userDoc);
      if (!snapshot.exists()) throw new Error("User not found");

      // Write nested under the `user` map using dot-notation paths
      const writePayload: Record<string, any> = {
        "user.plan": planId,
        "user.planUpdatedAt": Date.now(),
      };

      if (paymentMeta) {
        // Read existing history from the nested location
        const existing = snapshot.data()?.user?.membershipHistory ?? [];
        writePayload["user.membershipHistory"] = [
          ...existing,
          {
            planId,
            reference: paymentMeta.reference,
            billing: paymentMeta.billing,
            amount: paymentMeta.amount,
            paidAt: new Date().toISOString(),
          },
        ];
      }

      await updateDoc(userDoc, writePayload);

      store.dispatch(setPlan(planId as any));
    } catch (error) {
      console.error("Error updating membership plan:", error);
      throw error;
    }
  }
}

export const authService = new AuthService();
