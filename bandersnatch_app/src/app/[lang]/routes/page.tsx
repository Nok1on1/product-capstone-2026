"use client";

import { use, useEffect, useState } from "react";
import { getDictionary, Locale } from "@/i18n/dictionaries";
import RouteMap from "@/components/RouteMap";
import { motion } from "framer-motion";
import {
  DelayPattern,
  formatDelayPattern,
  getDelayPatternForNow,
} from "@/lib/delay-prediction";
import { readRecentBusReports } from "@/lib/offline-bus-data";

export default function RoutesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const dict = getDictionary(lang as Locale).routes;
  const [delayPattern, setDelayPattern] = useState<DelayPattern | null>(null);

  useEffect(() => {
    const fetchDelayPattern = async () => {
      try {
        const { data } = await readRecentBusReports();
        setDelayPattern(getDelayPatternForNow(data, "station", 10));
      } catch (error) {
        console.error("Error fetching delay pattern:", error);
      }
    };

    fetchDelayPattern();
  }, []);

  return (
    <main className="flex-grow flex flex-col gap-6 p-5 pb-32 max-w-3xl w-full mx-auto">
      {/* Page Title Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="flex flex-col gap-1 mt-4"
      >
        <h2 className="text-3xl font-bold text-on-surface dark:text-slate-100 tracking-tighter">{dict.title}</h2>
        <p className="text-lg text-on-surface-variant dark:text-slate-400">{dict.subtitle}</p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
        }}
        className="grid gap-4 md:grid-cols-2"
      >
        {/* Operating Hours */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex items-center gap-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <span className="material-symbols-outlined text-2xl">schedule</span>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant dark:text-slate-400 font-medium">{dict.operatingHours}</p>
            <p className="text-xl font-bold text-on-surface dark:text-white">{dict.operatingHoursValue}</p>
          </div>
        </motion.div>

        {/* Frequency */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
          className="bg-surface-container-lowest border border-outline-variant rounded-lg p-5 flex items-center gap-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <span className="material-symbols-outlined text-2xl">update</span>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant dark:text-slate-400 font-medium">{dict.frequency}</p>
            <p className="text-xl font-bold text-on-surface dark:text-white">{dict.frequencyValue}</p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.24, ease: "easeOut" }}
        className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 rounded-lg p-4 flex items-start gap-3 transition-colors duration-200"
      >
        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
          query_stats
        </span>
        <div>
          <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">
            Historical delay pattern
          </p>
          <p className="text-xs text-blue-700/80 dark:text-blue-300/80 mt-1 leading-relaxed">
            {formatDelayPattern(delayPattern)}
          </p>
        </div>
      </motion.div>

      {/* Route Map */}
      <RouteMap />

      {/* Exceptions */}
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-lg p-4 flex items-start gap-3 transition-colors duration-200">
        <span className="material-symbols-outlined text-red-600 dark:text-red-400">warning</span>
        <div>
          <p className="text-sm font-semibold text-red-700 dark:text-red-300">{dict.infoTitle}</p>
          <p className="text-xs text-red-600/80 dark:text-red-400/80 mt-1 leading-relaxed">
            {dict.infoText}
          </p>
        </div>
      </div>
    </main>
  );
}
