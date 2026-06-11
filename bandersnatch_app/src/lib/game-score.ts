"use client";

import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export const OFFLINE_RUNNER_SCORE_KEY = "bandersnatch_offline_runner_best";

export interface RunnerLeaderboardEntry {
  userId: string;
  displayName: string;
  highScore: number;
  updatedAt?: unknown;
}

export interface RunnerLeaderboard {
  top: RunnerLeaderboardEntry[];
  currentUserEntry: RunnerLeaderboardEntry | null;
  currentUserRank: number | null;
}

export function readLocalRunnerHighScore() {
  if (typeof window === "undefined") return 0;
  const score = Number(localStorage.getItem(OFFLINE_RUNNER_SCORE_KEY) || 0);
  return Number.isFinite(score) ? Math.max(0, Math.floor(score)) : 0;
}

function publicName(displayName?: string | null, email?: string | null) {
  if (displayName?.trim()) return displayName.trim();
  if (email?.includes("@")) return email.split("@")[0];
  return "Student";
}

export async function publishRunnerScore(params: {
  userId: string;
  displayName?: string | null;
  email?: string | null;
  score: number;
}) {
  const highScore = Math.max(0, Math.floor(params.score));
  const payload = {
    userId: params.userId,
    displayName: publicName(params.displayName, params.email),
    highScore,
    updatedAt: serverTimestamp(),
  };

  await Promise.all([
    updateDoc(doc(db, "users", params.userId), {
      offlineRunnerHighScore: highScore,
      offlineRunnerHighScoreUpdatedAt: new Date().toISOString(),
    }),
    setDoc(doc(db, "game_scores", params.userId), payload, { merge: true }),
  ]);

  return highScore;
}

export async function syncLocalRunnerHighScore(params: {
  userId: string;
  displayName?: string | null;
  email?: string | null;
  profileHighScore?: number | null;
}) {
  const localHighScore = readLocalRunnerHighScore();
  const profileHighScore = params.profileHighScore ?? 0;
  const highScore = Math.max(localHighScore, profileHighScore);

  if (highScore <= 0) return highScore;

  if (localHighScore < highScore && typeof window !== "undefined") {
    localStorage.setItem(OFFLINE_RUNNER_SCORE_KEY, String(highScore));
  }

  await publishRunnerScore({
    userId: params.userId,
    displayName: params.displayName,
    email: params.email,
    score: highScore,
  });

  return highScore;
}

function toEntry(id: string, data: Record<string, unknown>): RunnerLeaderboardEntry {
  return {
    userId: typeof data.userId === "string" ? data.userId : id,
    displayName: typeof data.displayName === "string" ? data.displayName : "Student",
    highScore: typeof data.highScore === "number" ? data.highScore : 0,
    updatedAt: data.updatedAt,
  };
}

export async function getRunnerLeaderboard(currentUserId: string) {
  const scoresRef = collection(db, "game_scores");
  const topQuery = query(scoresRef, orderBy("highScore", "desc"), limit(100));
  const topSnapshot = await getDocs(topQuery);
  const top = topSnapshot.docs.map((scoreDoc) =>
    toEntry(scoreDoc.id, scoreDoc.data())
  );

  const currentUserDoc = await getDoc(doc(db, "game_scores", currentUserId));
  const currentUserEntry = currentUserDoc.exists()
    ? toEntry(currentUserDoc.id, currentUserDoc.data())
    : null;

  let currentUserRank: number | null = null;
  if (currentUserEntry) {
    const higherScores = await getCountFromServer(
      query(scoresRef, where("highScore", ">", currentUserEntry.highScore))
    );
    currentUserRank = higherScores.data().count + 1;
  }

  return {
    top,
    currentUserEntry,
    currentUserRank,
  } satisfies RunnerLeaderboard;
}
