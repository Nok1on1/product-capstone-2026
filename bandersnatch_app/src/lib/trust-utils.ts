/**
 * Trust Score Utility Functions
 * Handles all trust score and report count updates in Firestore
 * Used to track user reliability based on accuracy of bus reports
 */

import { doc, updateDoc, increment, FieldValue } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Increment trust score for a user (reward for accurate reports)
 * @param userId - The user's Firebase UID
 * @param amount - Points to add (default 1)
 */
export async function incrementTrustScore(
  userId: string,
  amount: number = 1
): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      trustScore: increment(amount),
    });
  } catch (error) {
    console.error(`Failed to increment trust score for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Decrement trust score for a user (penalty for false/inaccurate reports)
 * @param userId - The user's Firebase UID
 * @param amount - Points to subtract (default 1)
 */
export async function decrementTrustScore(
  userId: string,
  amount: number = 1
): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      trustScore: increment(-amount),
    });
  } catch (error) {
    console.error(
      `Failed to decrement trust score for user ${userId}:`,
      error
    );
    throw error;
  }
}

/**
 * Increment total reports made by user
 * Called whenever a user submits any kind of report (boarding, crowding, not-here, etc.)
 * @param userId - The user's Firebase UID
 */
export async function incrementReportCount(userId: string): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      totalReportsMade: increment(1),
    });
  } catch (error) {
    console.error(
      `Failed to increment report count for user ${userId}:`,
      error
    );
    throw error;
  }
}

/**
 * Update trust score to a specific value (for admin actions or corrections)
 * @param userId - The user's Firebase UID
 * @param newScore - The new trust score value
 */
export async function setTrustScore(userId: string, newScore: number): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      trustScore: newScore,
    });
  } catch (error) {
    console.error(`Failed to set trust score for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Assign or update user role (admin action only)
 * @param userId - The user's Firebase UID
 * @param role - The role to assign ('student', 'admin', 'driver', or null)
 */
export async function setUserRole(
  userId: string,
  role: "student" | "admin" | "driver" | null
): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      role,
    });
  } catch (error) {
    console.error(`Failed to set user role for user ${userId}:`, error);
    throw error;
  }
}

/**
 * Batch update trust score and/or report count (atomic operation)
 * @param userId - The user's Firebase UID
 * @param updates - Object containing trustScoreDelta and/or reportCountDelta
 */
export async function updateTrustMetrics(
  userId: string,
  updates: {
    trustScoreDelta?: number;
    reportCountDelta?: number;
  }
): Promise<void> {
  try {
    const userRef = doc(db, "users", userId);
    const updatePayload: Record<string, any> = {};

    if (updates.trustScoreDelta !== undefined) {
      updatePayload.trustScore = increment(updates.trustScoreDelta);
    }

    if (updates.reportCountDelta !== undefined) {
      updatePayload.totalReportsMade = increment(updates.reportCountDelta);
    }

    if (Object.keys(updatePayload).length > 0) {
      await updateDoc(userRef, updatePayload);
    }
  } catch (error) {
    console.error(`Failed to update trust metrics for user ${userId}:`, error);
    throw error;
  }
}
