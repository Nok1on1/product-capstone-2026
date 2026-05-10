"use client";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { StopSelect } from "@/components/StopSelect";
import { motion } from "framer-motion";
import { use, useMemo } from "react";
import { getDictionary, Locale } from "@/i18n/dictionaries";
import Skeleton from "@/components/Skeleton";

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

export default function Account({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const dict = getDictionary(lang as Locale).common;
  const trustDict = getDictionary(lang as Locale).trust;
  const navDict = getDictionary(lang as Locale).nav;
  
  const { user, profile, loading, updateProfile } = useAuth();

  const score = profile?.trustScore ?? 50;
  const reports = profile?.totalReportsMade ?? 0;
  const badge = useMemo(() => getBadge(reports), [reports]);
  const milestone = useMemo(() => getNextMilestone(reports), [reports]);

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
          <div className="bg-surface-container dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center text-primary-container dark:text-blue-400 text-2xl font-bold">
            {user.email?.charAt(0).toUpperCase()}
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
    </main>
  );
}
