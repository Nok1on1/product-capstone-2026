"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function FindRidePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const router = useRouter();

  return (
    <main className="flex-grow bg-slate-50 dark:bg-slate-950 p-5 pb-32 max-w-md mx-auto w-full flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 shadow-sm rounded-xl p-8 text-center w-full transition-colors"
      >
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push(`/${lang}`)}
          className="flex items-center gap-2 text-on-surface dark:text-slate-200 font-medium hover:text-primary-container dark:hover:text-blue-400 transition-colors mb-8"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </motion.button>

        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-amber-600 dark:text-amber-400">
            construction
          </span>
        </div>

        <h1 className="text-2xl font-bold text-on-surface dark:text-slate-100 mb-2">
          Coming Soon
        </h1>
        <p className="text-on-surface-variant dark:text-slate-400 text-sm">
          Split a Ride will be available in a future update.
        </p>
      </motion.div>
    </main>
  );
}
