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
  profilePictureStoragePath?: string | null;
  emailVerified?: boolean;
  createdAt: Timestamp | string;
  onboardingCompleted?: boolean;
  acquisitionSource?: string | null;
  offlineRunnerHighScore?: number;
  offlineRunnerHighScoreUpdatedAt?: string;
}

// Type for when we're updating trust score or report count
export interface UserTrustUpdate {
  trustScore?: number;
  totalReportsMade?: number;
}
