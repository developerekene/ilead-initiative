import {
  doc,
  updateDoc,
  collection,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";
import { Campaign } from "../../slices/campaignSlice";

const serializeCampaign = (campaign: any) => {
  // Deep clone to remove undefined values, which can also crash Firestore
  const clean = JSON.parse(JSON.stringify(campaign));
  
  const toJSONString = (val: any) => {
    if (typeof val === 'string') return val; // Already a string
    if (Array.isArray(val)) return JSON.stringify(val);
    if (val && typeof val === 'object') return JSON.stringify(Object.values(val));
    return "[]";
  };

  return {
    ...clean,
    keyDeliverables: toJSONString(clean.keyDeliverables),
    candidates: toJSONString(clean.candidates),
    candidatePhotos: toJSONString(clean.candidatePhotos),
    votedBy: toJSONString(clean.votedBy),
  };
};

const deserializeCampaign = (data: any): Campaign => {
  const parseJSON = (val: any) => {
    if (!val) return [];
    if (typeof val === 'string') {
      try { return JSON.parse(val); } catch { return []; }
    }
    if (Array.isArray(val)) return val;
    return Object.values(val);
  };
  
  return {
    ...data,
    keyDeliverables: parseJSON(data.keyDeliverables),
    candidates: parseJSON(data.candidates),
    candidatePhotos: parseJSON(data.candidatePhotos),
    votedBy: parseJSON(data.votedBy),
  } as Campaign;
};

export class CampaignService {
  async createCampaign(
    userId: string,
    campaignData: Campaign & { creatorId?: string },
  ): Promise<void> {
    try {
      if (!userId) throw new Error("User ID is required to save a campaign.");
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const rawCampaigns = userDoc.data().campaigns || [];
        // Ensure that we filter out any multidimensional arrays or non-objects from the existing data
        const validCampaigns = Array.isArray(rawCampaigns) 
          ? rawCampaigns.filter(c => c && typeof c === 'object' && !Array.isArray(c))
          : [];
        
        // Serialize existing campaigns to fix any old data that has raw arrays
        const serializedExisting = validCampaigns.map(c => serializeCampaign(c as Campaign));

        await updateDoc(userDocRef, {
          campaigns: [...serializedExisting, serializeCampaign(campaignData)],
        });
      }
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
          const deserialized = userData.campaigns.map(deserializeCampaign);
          allCampaigns = [...allCampaigns, ...deserialized];
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
        const serializedUpdate = serializeCampaign(updatedCampaign);
        const updatedArray = campaigns.map((c: any) =>
          c.id === updatedCampaign.id ? serializedUpdate : serializeCampaign(c as Campaign),
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
        const filteredArray = campaigns
          .filter((c: any) => c.id !== campaignId)
          .map((c: any) => serializeCampaign(c as Campaign));
        await updateDoc(userDocRef, { campaigns: filteredArray });
      }
    } catch (error) {
      console.error("Error deleting campaign:", error);
      throw error;
    }
  }
}

export const campaignService = new CampaignService();
