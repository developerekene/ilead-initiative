import type { MembershipPlanId } from "../redux/slices/User";

export interface MembershipTier {
  id: MembershipPlanId;
  name: string;
  price: number;
  badge: string;
  badgeColor: string;
  tagline: string;
  accentColor: string;
  cardBg: string;
  buttonStyle: string;
  popular: boolean;
  features: string[];
  locked: string[];
}

export interface WorkshopTypes {
  id: string;
  title: string;
  category: string;
  description: string;
  instructor: string;
  instructorRole: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  mode: "Online" | "Physical" | "Hybrid";
  image: string;
  seats: number;
  enrolled: number;
  price: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  tags: string[];
  status: "Open" | "Almost Full" | "Closed" | "Completed" | "Coming Soon";
  registrationDeadline: string;
}

// consultant directory types
export const EXPERTISE_OPTIONS = [
  "University Know-How",
  "CGPA Strategies",
  "Career Path Guidance",
  "Study Habits",
] as const;

export type ExpertiseArea = (typeof EXPERTISE_OPTIONS)[number];

export interface ConsultantSocialLinks {
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  website?: string;
}

export interface ConsultantTypes {
  id: string;
  userId: string;
  name: string;
  email: string;
  // Professional info
  role: string;
  institution: string;
  yearsOfExperience: number;
  expertise: ExpertiseArea[];
  bio: string;
  avatar: string;
  socialLinks: ConsultantSocialLinks;
  calendlyLink: string;
  impactHours: number;
  isVerified: boolean;
}
