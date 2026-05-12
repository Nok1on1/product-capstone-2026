import { Timestamp } from "firebase/firestore";

export type UserRole = "student" | "admin" | "driver" | null;

export interface UserProfile {
  displayName: string;
  email: string;
  role: UserRole;
  trustScore: number;
  totalReportsMade: number;
  defaultStop: string;
  profilePicture?: string | null;
  emailVerified?: boolean;
  createdAt: Timestamp | string;
}

// Type for when we're updating trust score or report count
export interface UserTrustUpdate {
  trustScore?: number;
  totalReportsMade?: number;
}
