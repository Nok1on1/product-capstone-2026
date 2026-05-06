"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { BusStop } from "@/data/route3";

interface OnBusBannerProps {
  nextStop: BusStop | null;
  etaMinutes: number | null;
  title: string;
  nextStopLabel: string;
}

export function OnBusBanner({
  nextStop,
  etaMinutes,
  title,
  nextStopLabel,
}: OnBusBannerProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
      onClick={() => router.push("/en/live-map")}
      className="w-full bg-success-container dark:bg-green-900/80 border-b border-green-200 dark:border-green-800 px-4 py-3 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900 transition-colors sticky top-14 z-40"
    >
      <div className="max-w-3xl mx-auto flex items-center gap-3">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex-shrink-0"
        >
          <span className="material-symbols-outlined text-success dark:text-green-300 text-2xl">
            directions_bus
          </span>
        </motion.div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-success dark:text-green-300">
            {title}
          </p>
          <p className="text-xs text-success dark:text-green-400 truncate">
            {nextStopLabel}:{" "}
            <span className="font-semibold">
              {nextStop?.name || "—"}
            </span>
            {etaMinutes != null && etaMinutes > 0
              ? ` (~${etaMinutes} min)`
              : ""}
          </p>
        </div>
        <span className="material-symbols-outlined text-success dark:text-green-400 flex-shrink-0">
          open_in_new
        </span>
      </div>
    </motion.div>
  );
}
