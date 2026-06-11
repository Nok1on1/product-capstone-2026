"use client";

import { useAuth } from "@/context/AuthContext";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { uploadProfilePicture } from "@/lib/profile-picture";
import Link from "next/link";
import { StopSelect } from "@/components/StopSelect";
import { AnimatePresence, motion } from "framer-motion";
import { use, useEffect, useRef, useState, useMemo } from "react";

import { getDictionary, Locale } from "@/i18n/dictionaries";
import Skeleton from "@/components/Skeleton";
import {
  getRunnerLeaderboard,
  readLocalRunnerHighScore,
  RunnerLeaderboard,
  syncLocalRunnerHighScore,
} from "@/lib/game-score";

function getBadge(reports: number): { label: string; color: string; icon: string } {
  if (reports >= 100) return { label: "Expert", color: "text-purple-600 dark:text-purple-400", icon: "workspace_premium" };
  if (reports >= 50) return { label: "Reliable", color: "text-blue-600 dark:text-blue-400", icon: "verified" };
  if (reports >= 10) return { label: "Contributor", color: "text-amber-600 dark:text-amber-400", icon: "star" };
  return { label: "Beginner", color: "text-slate-500 dark:text-slate-400", icon: "hiking" };
}

function getNextMilestone(reports: number): { next: number; progress: number } {
  if (reports >= 100) return { next: 100, progress: 100 };
  if (reports >= 50) return { next: 100, progress: ((reports - 50) / 50) * 100 };
  if (reports >= 10) return { next: 50, progress: ((reports - 10) / 40) * 100 };
  return { next: 10, progress: (reports / 10) * 100 };
}

function trustScoreColor(score: number): string {
  if (score >= 70) return "text-green-600 dark:text-green-400";
  if (score >= 40) return "text-amber-600 dark:text-amber-400";
  return "text-red-600 dark:text-red-400";
}

function trustScoreBg(score: number): string {
  if (score >= 70) return "stroke-green-500";
  if (score >= 40) return "stroke-amber-500";
  return "stroke-red-500";
}

function TrustScoreGauge({ score }: { score: number }) {
  const clamped = Math.min(Math.max(score, 0), 100);
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative w-24 h-24 mx-auto">
      <svg className="w-24 h-24 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="36" fill="none" stroke="currentColor" strokeWidth="6"
          className="text-slate-200 dark:text-slate-700" />
        <circle cx="40" cy="40" r="36" fill="none" strokeWidth="6"
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-out ${trustScoreBg(score)}`}
          strokeDasharray={circumference}
          strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-2xl font-black ${trustScoreColor(score)}`}>{clamped}</span>
      </div>
    </div>
  );
}

function formatRank(rank: number | null) {
  if (!rank) return "Unranked";
  return `#${rank}`;
}

export default function Account({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const dict = getDictionary(lang as Locale).common;
  const trustDict = getDictionary(lang as Locale).trust;
  const navDict = getDictionary(lang as Locale).nav;
  
  const { user, profile, loading, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [picError, setPicError] = useState("");
  const [runnerScore, setRunnerScore] = useState(0);
  const [leaderboard, setLeaderboard] = useState<RunnerLeaderboard | null>(null);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState("");

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setPicError("Please upload an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPicError("Image must be less than 5MB.");
      return;
    }

    setUploadingPicture(true);
    setPicError("");

    try {
      const { downloadURL, path } = await uploadProfilePicture(user.uid, file);

      await updateDoc(doc(db, "users", user.uid), {
        profilePicture: downloadURL,
        profilePictureStoragePath: path,
      });

      await updateProfile({
        profilePicture: downloadURL,
        profilePictureStoragePath: path,
      });
    } catch (err: any) {
      console.error("Profile picture upload error:", err);
      setPicError(err.message || "Failed to upload profile picture.");
    } finally {
      setUploadingPicture(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const score = profile?.trustScore ?? 50;
  const reports = profile?.totalReportsMade ?? 0;
  const badge = useMemo(() => getBadge(reports), [reports]);
  const milestone = useMemo(() => getNextMilestone(reports), [reports]);
  const runnerRank = leaderboard?.currentUserRank ?? null;
  const currentUserInTop100 = !!leaderboard?.top.some(
    (entry) => entry.userId === user?.uid
  );

  const loadLeaderboard = async () => {
    if (!user) return;
    setLeaderboardLoading(true);
    setLeaderboardError("");
    try {
      const board = await getRunnerLeaderboard(user.uid);
      setLeaderboard(board);
    } catch (error) {
      console.error("Failed to load runner leaderboard", error);
      setLeaderboardError("Could not load rankings right now.");
    } finally {
      setLeaderboardLoading(false);
    }
  };

  useEffect(() => {
    if (!user || !profile) return;
    let cancelled = false;

    const syncScore = async () => {
      const localHighScore = readLocalRunnerHighScore();
      const profileHighScore = profile.offlineRunnerHighScore ?? 0;
      setRunnerScore(Math.max(localHighScore, profileHighScore));

      try {
        const highScore = await syncLocalRunnerHighScore({
          userId: user.uid,
          displayName: profile.displayName,
          email: profile.email || user.email,
          profileHighScore,
        });
        if (!cancelled) {
          setRunnerScore(highScore);
          await loadLeaderboard();
        }
      } catch (error) {
        console.error("Failed to sync runner score", error);
      }
    };

    void syncScore();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile?.offlineRunnerHighScore, profile?.displayName, profile?.email]);

  if (loading) {
    return (
      <main className="flex-grow">
        <Skeleton.Account />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex-grow flex flex-col items-center justify-center p-5 pb-32">
        <div className="w-full max-w-md text-center space-y-6">
          <span className="material-symbols-outlined text-6xl text-outline-variant">account_circle</span>
          <h1 className="text-2xl font-bold text-on-surface dark:text-slate-100">Not logged in</h1>
          <p className="text-on-surface-variant dark:text-slate-400">Log in to save your default bus stop and get personalized alerts.</p>
          <div className="flex flex-col gap-3 mt-8">
            <Link href={`/${lang}/login`} className="w-full bg-primary-container dark:bg-blue-600 text-on-primary font-semibold py-3 rounded-lg flex justify-center">
              {dict.login}
            </Link>
            <Link href={`/${lang}/signup`} className="w-full border border-outline-variant dark:border-slate-700 text-on-surface dark:text-slate-200 font-semibold py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex justify-center">
              {dict.signup}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow flex flex-col items-center p-5 pb-32 pt-8">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl p-6 relative overflow-visible shadow-sm transition-colors duration-200">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary-container dark:bg-blue-500 rounded-t-xl"></div>
        <div className="flex items-center gap-4 mb-8">
          <div 
            className="relative cursor-pointer group"
            onClick={handleProfilePictureClick}
            role="button"
            tabIndex={0}
          >
            {profile?.profilePicture ? (
              <img 
                src={profile.profilePicture} 
                alt={user.displayName || "Profile"}
                className="w-16 h-16 rounded-full object-cover bg-surface-container dark:bg-slate-800"
              />
            ) : (
              <div className="bg-surface-container dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center text-primary-container dark:text-blue-400 text-2xl font-bold">
                {profile?.displayName?.charAt(0).toUpperCase()}
              </div>
            )}
            
            {/* Upload overlay */}
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {uploadingPicture ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <span className="material-symbols-outlined text-white text-xl">camera_alt</span>
              )}
            </div>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="hidden"
              disabled={uploadingPicture}
            />
          </div>

          <div>
            <h1 className="text-xl font-bold text-on-surface dark:text-slate-100 tracking-tight">{navDict.account}</h1>
            <p className="text-sm text-on-surface-variant dark:text-slate-400">{profile?.displayName || user.email}</p>
          </div>
        </div>
        <div className="mb-6">
          <div className="grid grid-cols-5 gap-3 mb-4">
            <div className="col-span-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/30 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrustScoreGauge score={score} />
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                {trustDict.trustScore}
              </div>
            </div>
            <div className="col-span-2 flex flex-col gap-3">
              <div className="flex-1 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-lg p-3 flex flex-col items-center justify-center">
                <div className="text-xl font-bold text-green-600 dark:text-green-400">{reports}</div>
                <div className="text-[10px] text-green-600 dark:text-green-400 font-medium text-center leading-tight">
                  {trustDict.totalReports}
                </div>
              </div>
              <div className="flex-1 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/30 rounded-lg p-3 flex flex-col items-center justify-center">
                <span className={`material-symbols-outlined text-xl ${badge.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{badge.icon}</span>
                <div className={`text-[10px] font-bold ${badge.color} text-center leading-tight`}>
                  {trustDict[badge.label.toLowerCase() as keyof typeof trustDict] || badge.label}
                </div>
              </div>
            </div>
          </div>

          {milestone.next < 100 && (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                <span>{trustDict.nextMilestone}: {trustDict.reportBadge} {milestone.next}</span>
                <span>{Math.round(milestone.progress)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${milestone.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          )}

          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setLeaderboardOpen(true);
              void loadLeaderboard();
            }}
            className="mt-4 w-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-lg p-4 text-left flex items-center gap-4 hover:bg-amber-100/70 dark:hover:bg-amber-900/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/40"
          >
            <div className="h-12 w-12 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                emoji_events
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold uppercase tracking-wide text-amber-700 dark:text-amber-300">
                Bus Runner Ranking
              </p>
              <p className="text-2xl font-black text-amber-900 dark:text-amber-100 tracking-tight">
                {formatRank(runnerRank)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
                Best
              </p>
              <p className="text-xl font-black text-amber-900 dark:text-amber-100">
                {runnerScore}
              </p>
            </div>
            <span className="material-symbols-outlined text-amber-700 dark:text-amber-300">
              chevron_right
            </span>
          </motion.button>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative z-20">
            <label className="block font-bold text-on-surface dark:text-slate-200 mb-1 text-sm tracking-wide">Saved Primary Stop</label>
            <StopSelect 
              value={profile?.defaultStop || "10"} 
              onChange={(value) => updateProfile({ defaultStop: value })} 
            />
          </div>
        </div>

        <div className="space-y-3">
          <Link
            href={`/${lang}/ride-history`}
            className="w-full flex items-center justify-center gap-2 bg-surface-container dark:bg-slate-800 border border-outline-variant dark:border-slate-700 text-on-surface dark:text-slate-200 font-semibold py-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="material-symbols-outlined">history</span>
            View Ride History
          </Link>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => signOut(auth)}
            className="w-full border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-semibold py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">logout</span>
            {dict.logout}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {leaderboardOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLeaderboardOpen(false)}
              className="fixed inset-0 z-[60] bg-black/50"
            />
            <motion.section
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ type: "spring", bounce: 0.12, duration: 0.35 }}
              className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-h-[82vh] max-w-md overflow-hidden rounded-xl border border-outline-variant bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900"
              role="dialog"
              aria-modal="true"
              aria-labelledby="runner-leaderboard-title"
            >
              <div className="border-b border-outline-variant p-4 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-600 dark:text-amber-300">
                      Bus Runner
                    </p>
                    <h2 id="runner-leaderboard-title" className="text-xl font-black text-on-surface dark:text-slate-100">
                      Rankings
                    </h2>
                  </div>
                  <button
                    onClick={() => setLeaderboardOpen(false)}
                    className="rounded-full p-1 text-on-surface-variant hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container/30 dark:text-slate-400 dark:hover:bg-slate-800"
                    aria-label="Close rankings"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-amber-50 p-3 text-center dark:bg-amber-950/30">
                    <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">Your rank</p>
                    <p className="text-2xl font-black text-amber-900 dark:text-amber-100">{formatRank(runnerRank)}</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-3 text-center dark:bg-blue-950/30">
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">Your best</p>
                    <p className="text-2xl font-black text-blue-900 dark:text-blue-100">{runnerScore}</p>
                  </div>
                </div>
              </div>

              <div className="max-h-[56vh] overflow-y-auto p-3">
                {leaderboardLoading && (
                  <div className="py-8 text-center text-sm font-medium text-on-surface-variant dark:text-slate-400">
                    Loading rankings...
                  </div>
                )}

                {leaderboardError && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700 dark:bg-red-950/30 dark:text-red-300">
                    {leaderboardError}
                  </div>
                )}

                {!leaderboardLoading && !leaderboardError && leaderboard && (
                  <div className="space-y-2">
                    {leaderboard.top.length === 0 && (
                      <div className="py-8 text-center text-sm font-medium text-on-surface-variant dark:text-slate-400">
                        No scores yet. Your next offline run can take first place.
                      </div>
                    )}

                    {leaderboard.top.map((entry, index) => {
                      const isCurrentUser = entry.userId === user.uid;
                      return (
                        <div
                          key={entry.userId}
                          className={`grid grid-cols-[48px_1fr_auto] items-center gap-3 rounded-lg border p-3 ${
                            isCurrentUser
                              ? "border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30"
                              : "border-outline-variant bg-surface-container-lowest dark:border-slate-800 dark:bg-slate-950"
                          }`}
                        >
                          <div className="text-center text-sm font-black text-on-surface dark:text-slate-100">
                            #{index + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-on-surface dark:text-slate-100">
                              {entry.displayName}
                            </p>
                            {isCurrentUser && (
                              <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                                You
                              </p>
                            )}
                          </div>
                          <div className="text-lg font-black text-primary-container dark:text-blue-400">
                            {entry.highScore}
                          </div>
                        </div>
                      );
                    })}

                    {!currentUserInTop100 && leaderboard.currentUserEntry && leaderboard.currentUserRank && (
                      <>
                        <div className="py-2 text-center text-xs font-bold uppercase tracking-wide text-on-surface-variant dark:text-slate-500">
                          Your score
                        </div>
                        <div className="grid grid-cols-[48px_1fr_auto] items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 p-3 dark:border-amber-800 dark:bg-amber-950/30">
                          <div className="text-center text-sm font-black text-on-surface dark:text-slate-100">
                            #{leaderboard.currentUserRank}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-on-surface dark:text-slate-100">
                              {leaderboard.currentUserEntry.displayName}
                            </p>
                            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
                              You
                            </p>
                          </div>
                          <div className="text-lg font-black text-primary-container dark:text-blue-400">
                            {leaderboard.currentUserEntry.highScore}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
