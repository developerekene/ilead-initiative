import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { store } from "../../store";
import { clearUser, setUser } from "../../slices/User";
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

  async updateUserInformation(updateData: Partial<any>): Promise<void> {
    try {
      const currentUser = await this.getCurrentUser();
      const userId = currentUser.uid;
      const userDoc = doc(db, "users", userId);
      const userSnapShot = await getDoc(userDoc);
      if (!userSnapShot.exists()) throw new Error("user not found");
      const currentData = userSnapShot.data();
      const updatePrimaryInfo = {
        ...currentData.user.secondaryInformation,
        ...updateData,
      };
      await updateDoc(userDoc, {
        "user.secondaryInformation": updatePrimaryInfo,
      });
      store.dispatch(setUser(updatePrimaryInfo));
    } catch (error) {
      console.error("Error updating primary information:", error);
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
}

export const authService = new AuthService();
