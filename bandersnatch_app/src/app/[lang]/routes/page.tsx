"use client";

import { motion } from "framer-motion";
import { use } from "react";
import { getDictionary, Locale } from "@/i18n/dictionaries";

const times = [
  { time: "7:30 AM", skipped: false },
  { time: "8:00 AM", skipped: false },
  { time: "8:30 AM", skipped: false },
  { time: "9:00 AM", skipped: false },
  { time: "9:30 AM", skipped: false },
  { time: "10:00 AM", skipped: false },
  { time: "10:30 AM", skipped: false },
  { time: "11:00 AM", skipped: false },
  { time: "11:30 AM", skipped: false },
  { time: "12:00 PM", skipped: false },
  { time: "12:30 PM", skipped: false },
  { time: "1:00 PM", skipped: false },
  { time: "1:30 PM", skipped: false },
  { time: "2:00 PM", skipped: false },
  { time: "2:30 PM", skipped: false },
  { time: "3:00 PM", skipped: false },
  { time: "3:30 PM", skipped: false },
  { time: "4:00 PM", skipped: false },
  { time: "4:30 PM", skipped: false },
  { time: "5:00 PM", skipped: false },
  { time: "5:30 PM", skipped: false },
  { time: "6:00 PM", skipped: false },
  { time: "6:30 PM", skipped: false },
  { time: "7:00 PM", skipped: false },
  { time: "7:30 PM", skipped: false },
  { time: "8:00 PM", skipped: true }, 
  { time: "8:30 PM", skipped: false },
  { time: "9:00 PM", skipped: false },
  { time: "9:30 PM", skipped: false },
  { time: "10:00 PM", skipped: false },
];

export default function RoutesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const dict = getDictionary(lang as Locale).routes;

  return (
    <main className="flex-grow flex flex-col gap-6 p-5 pb-32 max-w-3xl w-full mx-auto">
      {/* Page Title Header */}
      <div className="flex flex-col gap-1 mt-4">
        <h2 className="text-3xl font-bold text-on-surface dark:text-slate-100 tracking-tighter">{dict.title}</h2>
        <p className="text-lg text-on-surface-variant dark:text-slate-400">{dict.subtitle}</p>
      </div>

      <div className="bg-blue-50 dark:bg-slate-900 border border-blue-100 dark:border-slate-800 rounded-lg p-4 flex items-start gap-3 transition-colors duration-200">
        <span className="material-symbols-outlined text-primary-container dark:text-blue-400">info</span>
        <div>
          <p className="text-sm font-semibold text-primary-container dark:text-blue-400">{dict.infoTitle}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {dict.infoText}
          </p>
        </div>
      </div>

      <section className="flex flex-col gap-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {times.map(({ time, skipped }) => (
            <motion.div
              key={time}
              whileTap={!skipped ? { scale: 0.95 } : {}}
              className={`border rounded-lg h-16 flex flex-col items-center justify-center shadow-sm select-none transition-colors ${
                skipped 
                  ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 opacity-80 cursor-not-allowed" 
                  : "bg-surface-container-lowest border-outline-variant text-on-surface hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              }`}
            >
              <span className={`text-lg font-semibold ${skipped ? "line-through opacity-70" : ""}`}>
                {time}
              </span>
              {skipped && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 mt-0.5">
                  {dict.skipped}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
