import {
  doc,
  updateDoc,
  arrayUnion,
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { Campaign } from "../../slices/campaignSlice";

export class CampaignService {
  /**
   */
  async createCampaign(
    userId: string,
    campaignData: Campaign & { creatorId?: string },
  ): Promise<void> {
    try {
      if (!userId) throw new Error("User ID is required to save a campaign.");

      const userDocRef = doc(db, "users", userId);

      await updateDoc(userDocRef, {
        campaigns: arrayUnion(campaignData),
      });
    } catch (error) {
      console.error("Error adding campaign to user document:", error);
      throw error;
    }
  }

  async fetchAllCampaigns(): Promise<Campaign[]> {
    try {
      // Get all documents in the users collection
      const usersSnap = await getDocs(collection(db, "users"));
      let allCampaigns: Campaign[] = [];

      // Loop through each user and extract their campaigns array
      usersSnap.forEach((doc) => {
        const userData = doc.data();
        if (userData.campaigns && Array.isArray(userData.campaigns)) {
          allCampaigns = [...allCampaigns, ...userData.campaigns];
        }
      });

      return allCampaigns;
    } catch (error) {
      console.error("Error fetching all campaigns from DB:", error);
      return [];
    }
  }
}

export const campaignService = new CampaignService();
