import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { store } from "../../store";
import { setUser } from "../../slices/User";

const generateUniqueId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export class AuthService {
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
            email: dataForRedux?.email,
            firstName: dataForRedux?.firstName,
            lastName: dataForRedux?.lastName,
          }),
        );
      }
    } catch (error) {
      console.error("Error during user registration:", error);
      throw error;
    } finally {
    }
  }
}

export const authService = new AuthService();
