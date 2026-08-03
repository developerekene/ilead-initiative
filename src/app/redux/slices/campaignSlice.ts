import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Campaign {
  id: string;
  title: string;
  category: "Tech Mentorship" | "Business Strategy" | "Community Giving" | "Election";
  description: string;
  metricLabel?: string;
  metricValue?: string;
  statusBadge: string;
  longFormBody: string;
  keyDeliverables: string[];
  candidates?: string[];
  candidatePhotos?: string[];
  creatorId?: string;
  votes?: Record<string, number>;
  votedBy?: string[];
  volunteersCount?: number;
  supportersCount?: number;
  volunteeredBy?: string[];
  backedBy?: string[];
}

interface SubmissionRecord {
  index: number;
  campaignId: string;
  campaignType: "Participant" | "Contributor";
  firstName: string;
  lastName: string;
  dateRegistered: string;
}

interface CampaignState {
  campaigns: Campaign[];
  submissions: SubmissionRecord[];
  isSubmitting: boolean;
}

const initialState: CampaignState = {
  campaigns: [],
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
      state.campaigns = action.payload;
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
    castVote(state, action: PayloadAction<{ campaignId: string; candidate: string; voterId?: string }>) {
      const { campaignId, candidate, voterId } = action.payload;
      const campaign = state.campaigns.find(c => c.id === campaignId);
      if (campaign) {
        if (!campaign.votes) {
          campaign.votes = {};
        }
        campaign.votes[candidate] = (campaign.votes[candidate] || 0) + 1;
        if (voterId) {
          if (!campaign.votedBy) {
            campaign.votedBy = [];
          }
          if (!campaign.votedBy.includes(voterId)) {
            campaign.votedBy.push(voterId);
          }
        }
      }
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
  castVote,
} = campaignSlice.actions;

export default campaignSlice.reducer;
