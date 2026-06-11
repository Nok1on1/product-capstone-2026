"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOfflineStatus } from "@/components/OfflineStatusProvider";

function formatAge(updatedAt: number | null) {
  if (!updatedAt) return "cached";
  const minutes = Math.max(0, Math.round((Date.now() - updatedAt) / 60000));
  if (minutes < 1) return "just now";
  if (minutes === 1) return "1 min ago";
  return `${minutes} min ago`;
}

export function OfflineBanner() {
  const { isOnline, latestSnapshotAt, queuedReportCount } = useOfflineStatus();
  const shouldShow = !isOnline || queuedReportCount > 0;

  const message = useMemo(() => {
    const parts: string[] = [];
    if (!isOnline) {
      parts.push(`Offline - data from ${formatAge(latestSnapshotAt)}`);
    }
    if (queuedReportCount > 0) {
      parts.push(
        `${queuedReportCount} report${queuedReportCount === 1 ? "" : "s"} waiting to sync`
      );
    }
    return parts.join(" · ");
  }, [isOnline, latestSnapshotAt, queuedReportCount]);

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="sticky top-14 z-40 border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm font-semibold text-amber-900 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/80 dark:text-amber-100"
          role="status"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
