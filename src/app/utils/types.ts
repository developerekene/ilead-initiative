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
