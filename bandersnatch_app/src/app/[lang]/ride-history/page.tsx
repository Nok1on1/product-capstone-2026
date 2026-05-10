"use client";

import { useState, useEffect, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { getDictionary, Locale } from "@/i18n/dictionaries";
import Skeleton from "@/components/Skeleton";

interface BusReport {
  id: string;
  userId: string;
  action?: string;
  type?: string;
  direction?: string | null;
  currentStopId?: number;
  lastStopId?: number;
  level?: string;
  timestamp: Timestamp | null;
}

interface Ride {
  id: string;
  date: Date;
  direction: string | null;
  reports: BusReport[];
  boardingStop?: number;
  disembarkStop?: number;
}

function groupReportsIntoRides(reports: BusReport[]): Ride[] {
  const sorted = [...reports].sort((a, b) => {
    const ta = a.timestamp?.toMillis?.() ?? 0;
    const tb = b.timestamp?.toMillis?.() ?? 0;
    return tb - ta;
  });

  const rides: Ride[] = [];
  let currentRide: BusReport[] = [];

  for (const report of sorted) {
    if (report.action === "boarded" || report.type === "boarded") {
      if (currentRide.length > 0) {
        rides.push(buildRide(currentRide));
      }
      currentRide = [report];
    } else if (
      report.action === "disembarked" ||
      report.type === "disembarked"
    ) {
      currentRide.push(report);
      rides.push(buildRide(currentRide));
      currentRide = [];
    } else {
      currentRide.push(report);
    }
  }

  if (currentRide.length > 0) {
    rides.push(buildRide(currentRide));
  }

  return rides;
}

function buildRide(reports: BusReport[]): Ride {
  const boarding = reports.find(
    (r) => r.action === "boarded" || r.type === "boarded"
  );
  const disembark = reports.find(
    (r) => r.action === "disembarked" || r.type === "disembarked"
  );

  const timestamps = reports
    .map((r) => r.timestamp?.toMillis?.())
    .filter((t): t is number => t != null);

  return {
    id: boarding?.id || reports[0]?.id || `ride_${Date.now()}`,
    date: new Date(timestamps[0] || Date.now()),
    direction: boarding?.direction || reports[0]?.direction || null,
    reports,
    boardingStop: boarding?.currentStopId,
    disembarkStop: disembark?.lastStopId,
  };
}

function getDuration(reports: BusReport[]): string | null {
  const timestamps = reports
    .map((r) => r.timestamp?.toMillis?.())
    .filter((t): t is number => t != null);
  if (timestamps.length < 2) return null;
  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);
  const diffMs = maxTime - minTime;
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "<1 min";
  return `${diffMin} min`;
}

export default function RideHistoryPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const dict = getDictionary(lang as Locale).rideHistory;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [reports, setReports] = useState<BusReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRide, setExpandedRide] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push(`/${lang}/login`);
      return;
    }

    const fetchReports = async () => {
      try {
        const q = query(
          collection(db, "bus_reports"),
          where("userId", "==", user.uid),
          orderBy("timestamp", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            } as BusReport)
        );
        setReports(data);
      } catch {
        console.error("Failed to fetch ride history");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [user, authLoading, lang, router]);

  const rides = useMemo(() => groupReportsIntoRides(reports), [reports]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(lang === "ka" ? "ka-GE" : "en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const actionLabel = (report: BusReport) => {
    const action = report.action || report.type;
    switch (action) {
      case "boarded":
        return dict.boarding;
      case "disembarked":
        return dict.disembarking;
      case "crowding_report":
        return `${dict.report}: ${report.level}`;
      case "not_here":
        return `${dict.report}: Not Here`;
      case "bus_is_here":
        return `${dict.report}: Bus is Here`;
      default:
        return action || dict.report;
    }
  };

  if (authLoading || loading) {
    return (
      <main className="flex-grow">
        <Skeleton.Account />
      </main>
    );
  }

  return (
    <main className="flex-grow p-5 pb-32 max-w-md mx-auto w-full">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push(`/${lang}/account`)}
        className="flex items-center gap-2 text-on-surface dark:text-slate-200 font-medium hover:text-primary-container dark:hover:text-blue-400 transition-colors mb-6"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        <span>{dict.title}</span>
      </motion.button>

      {rides.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-6xl text-outline-variant dark:text-slate-700 mb-4">
            directions_bus
          </span>
          <p className="text-on-surface-variant dark:text-slate-400">
            {dict.noRides}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {rides.map((ride) => {
            const isExpanded = expandedRide === ride.id;
            const duration = getDuration(ride.reports);
            return (
              <motion.div
                key={ride.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-colors"
              >
                <button
                  onClick={() =>
                    setExpandedRide(isExpanded ? null : ride.id)
                  }
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-primary-container dark:text-blue-400 text-lg">
                        directions_bus
                      </span>
                      <span className="font-bold text-on-surface dark:text-slate-100 text-sm">
                        {dict.ride} #{rides.length - rides.indexOf(ride)}
                      </span>
                      {ride.direction && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            ride.direction === "station"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                              : "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                          }`}
                        >
                          {ride.direction === "station"
                            ? dict.toStation
                            : dict.toCity}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-on-surface-variant dark:text-slate-400">
                      {formatDate(ride.date)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-bold text-on-surface dark:text-slate-200">
                        {ride.reports.length}
                      </p>
                      <p className="text-[10px] text-on-surface-variant dark:text-slate-400 uppercase tracking-wider">
                        {dict.reports}
                      </p>
                    </div>
                    <span
                      className={`material-symbols-outlined text-on-surface-variant dark:text-slate-400 transition-transform duration-200 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      expand_more
                    </span>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 border-t border-outline-variant dark:border-slate-800 pt-3 space-y-2">
                        {duration && (
                          <div className="flex items-center gap-2 text-xs text-on-surface-variant dark:text-slate-400">
                            <span className="material-symbols-outlined text-[14px]">
                              schedule
                            </span>
                            <span>
                              {dict.duration}: {duration}
                            </span>
                          </div>
                        )}

                        {ride.boardingStop && (
                          <div className="flex items-center gap-2 text-xs text-on-surface-variant dark:text-slate-400">
                            <span className="material-symbols-outlined text-[14px]">
                              login
                            </span>
                            <span>
                              {dict.boarding}: Stop #{ride.boardingStop}
                            </span>
                          </div>
                        )}

                        {ride.disembarkStop && (
                          <div className="flex items-center gap-2 text-xs text-on-surface-variant dark:text-slate-400">
                            <span className="material-symbols-outlined text-[14px]">
                              logout
                            </span>
                            <span>
                              {dict.disembarking}: Stop #{ride.disembarkStop}
                            </span>
                          </div>
                        )}

                        <div className="pt-2 space-y-1">
                          <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant dark:text-slate-400">
                            {dict.reports}
                          </p>
                          {ride.reports.map((report) => (
                            <div
                              key={report.id}
                              className="flex items-center justify-between text-xs py-1"
                            >
                              <span className="text-on-surface dark:text-slate-200">
                                {actionLabel(report)}
                              </span>
                              <span className="text-on-surface-variant dark:text-slate-400">
                                {report.timestamp?.toMillis
                                  ? formatDate(
                                      new Date(
                                        report.timestamp.toMillis()
                                      )
                                    )
                                  : "—"}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </main>
  );
}
