"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

interface AlertData {
  active: boolean;
  message: { en: string; ka: string };
  severity: "info" | "warning" | "critical";
  link?: string;
  expiresAt?: { toDate: () => Date };
}

const severityConfig = {
  info: {
    bg: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
    text: "text-blue-700 dark:text-blue-300",
    icon: "info",
  },
  warning: {
    bg: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
    text: "text-amber-700 dark:text-amber-300",
    icon: "warning",
  },
  critical: {
    bg: "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800",
    text: "text-red-700 dark:text-red-300",
    icon: "error",
  },
};

export function AlertBanner() {
  const [alert, setAlert] = useState<AlertData | null>(null);
  const [dismissedId, setDismissedId] = useState<string | null>(null);
  const pathname = usePathname();

  const lang = pathname.startsWith("/ka") ? "ka" : "en";

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDismissedId(localStorage.getItem("bandersnatch_dismissed_alert"));
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "bus_data", "alert"), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as AlertData;
        if (data.active) {
          const expiresAt = data.expiresAt?.toDate();
          if (expiresAt && expiresAt < new Date()) {
            setAlert(null);
            return;
          }
          setAlert(data);
        } else {
          setAlert(null);
        }
      }
    });
    return () => unsub();
  }, []);

  const handleDismiss = () => {
    if (alert) {
      const id = alert.message.en + alert.message.ka;
      setDismissedId(id);
      localStorage.setItem("bandersnatch_dismissed_alert", id);
    }
  };

  if (!alert) return null;

  const currentId = alert.message.en + alert.message.ka;
  if (dismissedId === currentId) return null;

  const cfg = severityConfig[alert.severity] || severityConfig.info;
  const message = alert.message[lang as keyof typeof alert.message] || alert.message.en;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`overflow-hidden border-b ${cfg.bg} transition-colors duration-200`}
      >
        <div className="flex items-center gap-2 px-4 py-2 max-w-3xl mx-auto">
          <span className={`material-symbols-outlined text-lg ${cfg.text} shrink-0`}>
            {cfg.icon}
          </span>
          <p className={`text-xs sm:text-sm font-medium ${cfg.text} flex-1`}>
            {message}
          </p>
          <button
            onClick={handleDismiss}
            className={`${cfg.text} hover:opacity-70 transition-opacity shrink-0`}
            aria-label="Dismiss"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
