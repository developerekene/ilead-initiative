import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Campaign {
  id: string;
  title: string;
  category: "Tech Mentorship" | "Business Strategy" | "Community Giving" | "Election";
  description: string;
  metricLabel: string;
  metricValue: string;
  statusBadge: string;
  longFormBody: string;
  keyDeliverables: string[];
  candidates?: string[];
  creatorId?: string;
}

interface SubmissionRecord {
  index: number;
  campaignId: string;
  campaignType: "Participant" | "Contributor";
  firstName: string;
  lastName: string;
  dateRegistered: string;
}

const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: "you-are-not-alone-2026",
    title: 'The "You Are Not Alone" Network',
    category: "Community Giving",
    description:
      "Providing proactive professional check-ins, direct technical workspace assistance, and collaborative safety nets for engineers breaking out of extreme isolation.",
    metricLabel: "Active Peers Connected",
    metricValue: "850+ Members",
    statusBadge: "Always Open",
    longFormBody:
      "Isolation is one of the silent killers of technical excellence and personal well-being. The 'You Are Not Alone' Network creates a consistent framework of real human validation for software engineers and digital creators. By facilitating weekly mental health check-ins, providing unblocked technical code reviews, and creating shared spaces for safe, unfiltered growth, we establish a robust human foundation beneath technical development layers.",
    keyDeliverables: [
      "24/7 technical SOS channel for immediate engineering roadblocks",
      "Bi-weekly interactive peer circles breaking down developer burnout",
      "Direct matched mentorship pairing senior engineering leaders with breaking talent",
    ],
  },
];

interface CampaignState {
  campaigns: Campaign[];
  submissions: SubmissionRecord[];
  isSubmitting: boolean;
}

const initialState: CampaignState = {
  campaigns: INITIAL_CAMPAIGNS,
  submissions: [],
  isSubmitting: false,
};

const campaignSlice = createSlice({
  name: "campaign",
  initialState,
  reducers: {
    addCampaign(state, action: PayloadAction<Campaign>) {
      state.campaigns.push(action.payload);
    },
    setCampaigns(state, action: PayloadAction<Campaign[]>) {
      const dbCampaigns = action.payload;
      const combined = [...INITIAL_CAMPAIGNS];
      dbCampaigns.forEach((dbC) => {
        if (!combined.find((c) => c.id === dbC.id)) {
          combined.push(dbC);
        }
      });
      state.campaigns = combined;
    },
    updateCampaignItem(state, action: PayloadAction<Campaign>) {
      const index = state.campaigns.findIndex(
        (c) => c.id === action.payload.id,
      );
      if (index !== -1) {
        state.campaigns[index] = action.payload;
      }
    },
    removeCampaignItem(state, action: PayloadAction<string>) {
      state.campaigns = state.campaigns.filter((c) => c.id !== action.payload);
    },
    setSubmitting(state, action: PayloadAction<boolean>) {
      state.isSubmitting = action.payload;
    },
    addSubmission(state, action: PayloadAction<SubmissionRecord>) {
      state.submissions.push(action.payload);
    },
    clearSubmissions(state) {
      state.submissions = [];
    },
  },
});

export const {
  addCampaign,
  setCampaigns,
  updateCampaignItem,
  removeCampaignItem,
  setSubmitting,
  addSubmission,
  clearSubmissions,
} = campaignSlice.actions;

export default campaignSlice.reducer;
