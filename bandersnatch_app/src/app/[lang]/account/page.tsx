"use client";

import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { StopSelect } from "@/components/StopSelect";
import { motion } from "framer-motion";
import { use } from "react";
import { getDictionary, Locale } from "@/i18n/dictionaries";

export default function Account({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const dict = getDictionary(lang as Locale).common;
  const navDict = getDictionary(lang as Locale).nav;
  
  const { user, profile, loading, updateProfile } = useAuth();

  if (loading) {
    return (
      <main className="flex-grow flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-container"></div>
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
            <p className="text-sm text-on-surface-variant dark:text-slate-400">{user.email}</p>
          </div>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative z-20">
            <label className="block font-bold text-on-surface dark:text-slate-200 mb-1 text-sm tracking-wide">Saved Primary Stop</label>
            <StopSelect 
              value={profile?.defaultStop || "10"} 
              onChange={(value) => updateProfile(value)} 
            />
          </div>
        </div>

        <motion.button 
          whileTap={{ scale: 0.96 }}
          onClick={() => signOut(auth)}
          className="w-full border border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 font-semibold py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">logout</span>
          {dict.logout}
        </motion.button>
      </div>
    </main>
  );
}
