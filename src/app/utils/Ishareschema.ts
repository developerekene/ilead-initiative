import { Timestamp } from "firebase/firestore";

//Post type union
export type PostType = "offer_give" | "request_need";
export type PostCategory = "skills" | "hardware" | "mentorship" | "other";
export type PostStatus = "active" | "fulfilled" | "archived" | "pending_match";

//Core document shape
export interface ISharePost {
  id: string;
  userId: string;
  type: PostType;
  title: string;
  description: string;
  category: PostCategory;
  status: PostStatus;
  timestamp: Timestamp;
  anonymous: boolean;
  // Optional enrichment fields populated client-side / cloud function
  resourceType?: string | null; // the kind of resource offered/requested
  safetyAcknowledged?: boolean; // request-side safety consent (iNeed)
  displayName?: string | null;
  photoURL?: string | null;
  matchedUserId?: string | null; // set when status → pending_match
  fulfilledAt?: Timestamp | null; // set when status → fulfilled
  flagged?: boolean; // set by moderation (Ticket 16)
}

// ── Factory — build a new post payload (omit id, added after write)
export const buildISharePost = (
  overrides: Omit<ISharePost, "id" | "timestamp" | "status">,
): Omit<ISharePost, "id"> => ({
  resourceType: null,
  safetyAcknowledged: false,
  ...overrides,
  status: "active",
  timestamp: Timestamp.now(),
  flagged: false,
  matchedUserId: null,
  fulfilledAt: null,
});

// ── Firestore collection name
export const ISHARE_COLLECTION = "ishare_posts";

// ── Firestore Security Rules (deploy via `firebase deploy --only firestore`) ──
//
// firestore.rules:
//
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//
//     match /ishare_posts/{postId} {
//
//       // Anyone (even unauthenticated) can read active posts;
//       // owners can additionally read their own non-active posts
//       allow read: if resource.data.status == 'active'
//                   || (request.auth != null
//                       && resource.data.userId == request.auth.uid);
//
//       // Authenticated users can create their own posts
//       allow create: if request.auth != null
//                     && request.resource.data.userId == request.auth.uid;
//
//       // Owners can update their own posts; status machine enforced below
//       allow update: if request.auth != null
//                     && resource.data.userId == request.auth.uid;
//
//       // Only cloud functions (admin SDK) can delete
//       allow delete: if false;
//     }
//   }
// }
