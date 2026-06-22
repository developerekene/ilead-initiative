// campaignSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Campaign {
  id: string;
  title: string;
  category: "Tech Mentorship" | "Business Strategy" | "Community Giving";
  description: string;
  metricLabel: string;
  metricValue: string;
  statusBadge: string;
  longFormBody: string;
  keyDeliverables: string[];
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
  {
    id: "business-bootcamp",
    title: "SME & Founders Strategic Acceleration",
    category: "Business Strategy",
    description:
      "Breaking down financial planning, scalable team operations, and market positioning for local creators trying to build sustainable businesses.",
    metricLabel: "Mentorship Hours Gifted",
    metricValue: "450 hrs",
    statusBadge: "In Progress",
    longFormBody: "...",
    keyDeliverables: ["..."],
  },
  {
    id: "peer-support-fund",
    title: "The Selfless Circle Equipment Fund",
    category: "Community Giving",
    description:
      "A zero-interest, crowd-fueled collective pool helping community members purchase modern laptops and essential remote working setups.",
    metricLabel: "Laptops Provided",
    metricValue: "84 Systems",
    statusBadge: "Active Support",
    longFormBody: "...",
    keyDeliverables: ["..."],
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

export const { addCampaign, setSubmitting, addSubmission, clearSubmissions } =
  campaignSlice.actions;

export default campaignSlice.reducer;
