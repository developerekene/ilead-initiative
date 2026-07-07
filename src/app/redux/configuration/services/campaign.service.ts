import {
  doc,
  updateDoc,
  arrayUnion,
  collection,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { Campaign } from "../../slices/campaignSlice";

export class CampaignService {
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
      const usersSnap = await getDocs(collection(db, "users"));
      let allCampaigns: Campaign[] = [];
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

  async updateCampaign(
    userId: string,
    updatedCampaign: Campaign,
  ): Promise<void> {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const campaigns = userDoc.data().campaigns || [];
        const updatedArray = campaigns.map((c: Campaign) =>
          c.id === updatedCampaign.id ? updatedCampaign : c,
        );
        await updateDoc(userDocRef, { campaigns: updatedArray });
      }
    } catch (error) {
      console.error("Error updating campaign:", error);
      throw error;
    }
  }

  async deleteCampaign(userId: string, campaignId: string): Promise<void> {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const campaigns = userDoc.data().campaigns || [];
        const filteredArray = campaigns.filter(
          (c: Campaign) => c.id !== campaignId,
        );
        await updateDoc(userDocRef, { campaigns: filteredArray });
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
      throw error;
    }
  }
}

export const campaignService = new CampaignService();
