"use client";

import { use } from "react";
import { getDictionary, Locale } from "@/i18n/dictionaries";

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

      <div className="grid gap-4">
        {/* Operating Hours */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <span className="material-symbols-outlined text-2xl">schedule</span>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant dark:text-slate-400 font-medium">{dict.operatingHours}</p>
            <p className="text-xl font-bold text-on-surface dark:text-white">{dict.operatingHoursValue}</p>
          </div>
        </div>

        {/* Frequency */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <span className="material-symbols-outlined text-2xl">update</span>
          </div>
          <div>
            <p className="text-sm text-on-surface-variant dark:text-slate-400 font-medium">{dict.frequency}</p>
            <p className="text-xl font-bold text-on-surface dark:text-white">{dict.frequencyValue}</p>
          </div>
        </div>
      </div>

      {/* Exceptions */}
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl p-4 flex items-start gap-3 transition-colors duration-200">
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
