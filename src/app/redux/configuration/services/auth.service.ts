import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

import { auth, db } from "../../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  runTransaction,
  setDoc,
  updateDoc,
  addDoc,
} from "firebase/firestore";

import { store } from "../../store";
import { clearUser, setPlan, setUser } from "../../slices/User";
import {
  setWorkshops,
  addWorkshop,
  setWorkshopsLoading,
  setWorkshopsError,
  setWorkshopEnrolled,
  setRegistering,
  setRegisterError,
  setCreatingWorkshop,
  setCreateError,
} from "../../slices/workshopSlice";
import { WorkshopTypes, ConsultantTypes } from "../../../utils/types";

import {
  setConsultants,
  addConsultant,
  setConsultantsLoading,
  setConsultantsError,
  setCreatingConsultant,
  setCreateConsultantError,
} from "../../slices/consultantSlice";

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

  async handleCreateWorkshop(
    workshopData: Omit<WorkshopTypes, "id" | "enrolled">,
  ): Promise<string> {
    store.dispatch(setCreatingWorkshop(true));
    store.dispatch(setCreateError(null));
    try {
      await this.getCurrentUser();

      const newWorkshopDoc = {
        ...workshopData,
        enrolled: 0,
      };

      const docRef = await addDoc(collection(db, "workshops"), newWorkshopDoc);

      const createdWorkshop: WorkshopTypes = {
        id: docRef.id,
        ...newWorkshopDoc,
      };

      store.dispatch(addWorkshop(createdWorkshop));
      return docRef.id;
    } catch (error: any) {
      console.error("Error creating workshop:", error);
      store.dispatch(
        setCreateError(error?.message ?? "Failed to create workshop"),
      );
      throw error;
    } finally {
      store.dispatch(setCreatingWorkshop(false));
    }
  }

  async fetchWorkshops(): Promise<void> {
    store.dispatch(setWorkshopsLoading(true));
    store.dispatch(setWorkshopsError(null));
    try {
      const snapshot = await getDocs(collection(db, "workshops"));
      const workshops = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as WorkshopTypes,
      );
      store.dispatch(setWorkshops(workshops));
    } catch (error: any) {
      console.error("Error fetching workshops:", error);
      store.dispatch(
        setWorkshopsError(error?.message ?? "Failed to load workshops"),
      );
      throw error;
    } finally {
      store.dispatch(setWorkshopsLoading(false));
    }
  }

  async handleWorkshopRegistration(
    workshopId: string,
    workshopTitle: string,
    registrationData: Record<string, any>,
  ): Promise<void> {
    store.dispatch(setRegistering({ workshopId, value: true }));
    store.dispatch(setRegisterError({ workshopId, error: null }));
    try {
      const currentUser = await this.getCurrentUser();
      const userId = currentUser.uid;
      const userDoc = doc(db, "users", userId);
      const snapshot = await getDoc(userDoc);
      if (!snapshot.exists()) throw new Error("User not found");

      const currentData = snapshot.data();
      const existingRegistrations =
        currentData?.user?.workshopRegistrations ?? [];

      // Guard against double-registering for the same workshop
      const alreadyRegistered = existingRegistrations.some(
        (reg: any) => reg.workshopId === workshopId,
      );
      if (alreadyRegistered) {
        throw new Error("You are already registered for this workshop");
      }

      const registrationRecord = {
        workshopId,
        workshopTitle,
        ...registrationData,
        registeredAt: new Date().toISOString(),
      };

      const writePayload: Record<string, any> = {
        "user.workshopRegistrations": [
          ...existingRegistrations,
          registrationRecord,
        ],
      };

      await updateDoc(userDoc, writePayload);
      const workshopRef = doc(db, "workshops", workshopId);
      const newEnrolled = await runTransaction(db, async (transaction) => {
        const workshopSnap = await transaction.get(workshopRef);
        if (!workshopSnap.exists()) throw new Error("Workshop not found");

        const workshopData = workshopSnap.data() as WorkshopTypes;
        if (workshopData.enrolled >= workshopData.seats) {
          throw new Error("This workshop is full");
        }

        const updatedEnrolled = workshopData.enrolled + 1;
        transaction.update(workshopRef, { enrolled: updatedEnrolled });
        return updatedEnrolled;
      });

      store.dispatch(
        setWorkshopEnrolled({ workshopId, enrolled: newEnrolled }),
      );
    } catch (error: any) {
      console.error("Error registering for workshop:", error);
      store.dispatch(
        setRegisterError({
          workshopId,
          error: error?.message ?? "Registration failed. Please try again.",
        }),
      );
      throw error;
    } finally {
      store.dispatch(setRegistering({ workshopId, value: false }));
    }
  }

  async fetchConsultants(): Promise<void> {
    store.dispatch(setConsultantsLoading(true));
    store.dispatch(setConsultantsError(null));
    try {
      const snapshot = await getDocs(collection(db, "consultants"));
      const consultants = snapshot.docs.map(
        (d) => ({ id: d.id, ...d.data() }) as ConsultantTypes,
      );
      store.dispatch(setConsultants(consultants));
    } catch (error: any) {
      console.error("Error fetching consultants:", error);
      store.dispatch(
        setConsultantsError(error?.message ?? "Failed to load consultants"),
      );
      throw error;
    } finally {
      store.dispatch(setConsultantsLoading(false));
    }
  }

  async handleConsultantRegistration(
    consultantData: Pick<
      ConsultantTypes,
      | "role"
      | "institution"
      | "yearsOfExperience"
      | "expertise"
      | "bio"
      | "avatar"
      | "socialLinks"
      | "calendlyLink"
    >,
  ): Promise<string> {
    store.dispatch(setCreatingConsultant(true));
    store.dispatch(setCreateConsultantError(null));
    try {
      const currentUser = await this.getCurrentUser();
      const userId = currentUser.uid;

      const consultantDoc = doc(db, "consultants", userId);
      const existingSnapshot = await getDoc(consultantDoc);
      if (existingSnapshot.exists()) {
        throw new Error("You already have a consultant profile");
      }

      const userDoc = doc(db, "users", userId);
      const userSnapshot = await getDoc(userDoc);
      if (!userSnapshot.exists()) throw new Error("User profile not found");
      const primaryInfo = userSnapshot.data()?.user?.primaryInformation;

      const newConsultant: Omit<ConsultantTypes, "id"> = {
        userId,
        name: `${primaryInfo?.firstName ?? ""} ${primaryInfo?.lastName ?? ""}`.trim(),
        email: primaryInfo?.email ?? "",
        ...consultantData,
        impactHours: 0,
        isVerified: false,
      };

      await setDoc(consultantDoc, newConsultant);

      const createdConsultant: ConsultantTypes = {
        id: userId,
        ...newConsultant,
      };

      store.dispatch(addConsultant(createdConsultant));
      return userId;
    } catch (error: any) {
      console.error("Error registering as consultant:", error);
      store.dispatch(
        setCreateConsultantError(
          error?.message ?? "Failed to submit consultant profile",
        ),
      );
      throw error;
    } finally {
      store.dispatch(setCreatingConsultant(false));
    }
  }
}

export const authService = new AuthService();
