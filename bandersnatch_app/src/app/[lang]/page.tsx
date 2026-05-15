"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, use, useMemo, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useBusState } from "@/context/BusStateContext";
import { StopSelect } from "@/components/StopSelect";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { getDictionary, Locale } from "@/i18n/dictionaries";
import { useUserLocation } from "@/hooks/useUserLocation";
import { findNearestStopOnRoute } from "@/lib/location-utils";
import { OnBusBanner } from "@/components/OnBusBanner";
import { OnBusButton } from "@/components/OnBusButton";
import { ReportButton } from "@/components/ReportButton";
import { getNextScheduledBus } from "@/lib/timetable";
import Skeleton from "@/components/Skeleton";

function BackgroundAnimation() {
  const buses = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => ({
      startX: `${15 + (i * 17) % 70}%`,
      startY: `${10 + (i * 23) % 75}%`,
      endX: `${80 - (i * 13) % 60}%`,
      endY: `${15 + (i * 29 + 10) % 70}%`,
      scale: 0.5 + i * 0.1,
      duration: 20 + i * 8,
      delay: i * 4,
    })),
    []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {buses.map((bus, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ x: bus.startX, y: bus.startY, rotate: 0, opacity: 0 }}
          animate={{
            x: bus.endX,
            y: bus.endY,
            rotate: [0, 10, -10, 0],
            opacity: [0, 0.12, 0.12, 0],
          }}
          transition={{
            duration: bus.duration,
            repeat: Infinity,
            ease: "linear",
            delay: bus.delay,
          }}
        >
          <span
            className="material-symbols-outlined text-blue-300/30 dark:text-blue-500/20"
            style={{ fontSize: `${24 * bus.scale}px` }}
          >
            directions_bus
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export default function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const dict = getDictionary(lang as Locale).home;
  const onBusDict = getDictionary(lang as Locale).onBus;
  const tripDict = getDictionary(lang as Locale).tripDetails;
  const router = useRouter();

  const { user, profile, updateProfile, loading } = useAuth();

  const [onboardingCheckDone, setOnboardingCheckDone] = useState(false);

  useEffect(() => {
    if (loading || onboardingCheckDone) return;

    if (user) {
      setOnboardingCheckDone(true);
      return;
    } else {
      const done = localStorage.getItem("bandersnatch_onboarding_done");
      if (!done) {
        router.replace(`/${lang}/onboarding`);
        return;
      }
    }
    setOnboardingCheckDone(true);
  }, [loading, user, profile, lang, router, onboardingCheckDone]);
  const {
    hydrated,
    isOnBus,
    currentStop: ctxCurrentStop,
    setCurrentUserLocation,
    setDestination,
    hasLiveData,
    setHasLiveData,
  } = useBusState();

  const [stop, setStop] = useState("10");
  const [destinationStop, setDestinationStop] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [crowding, setCrowding] = useState<"Low" | "Medium" | "High" | null>(null);
  const [showDetectedIndicator, setShowDetectedIndicator] = useState(false);
  const [timetableETA, setTimetableETA] = useState<number | null>(null);
  const [activeBusCount, setActiveBusCount] = useState(0);
  const [alertCount, setAlertCount] = useState(0);
  const [alertedBuses, setAlertedBuses] = useState<{ [busId: string]: string[] }>({});
  const manualSelectionTimeRef = useRef<number>(0);

  const { location, startTracking } = useUserLocation();

  useEffect(() => {
    if (location) {
      setCurrentUserLocation(location);
    }
  }, [location, setCurrentUserLocation]);

  useEffect(() => {
    if (profile?.defaultStop) {
      setStop(profile.defaultStop);
    } else if (!user) {
      const stored = localStorage.getItem("bandersnatch_default_stop");
      if (stored) setStop(stored);
    }
  }, [profile, user]);

  useEffect(() => {
    startTracking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location && !isOnBus) {
      if (Date.now() - manualSelectionTimeRef.current < 10000) {
        return;
      }
      const nearest = findNearestStopOnRoute(location.lat, location.lng);
      if (nearest) {
        const stopId = nearest.stop.id.toString();
        if (stop !== stopId) {
          setStop(stopId);
          updateProfile({ defaultStop: stopId });
          setShowDetectedIndicator(true);
        }
      }
    }
  }, [location, isOnBus, updateProfile, stop]);

  useEffect(() => {
    if (showDetectedIndicator) {
      const timer = setTimeout(() => setShowDetectedIndicator(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showDetectedIndicator]);

  useEffect(() => {
    const { minutes } = getNextScheduledBus("station");
    setTimetableETA(minutes);
    const interval = setInterval(() => {
      const { minutes: m } = getNextScheduledBus("station");
      setTimetableETA(m);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Fetch active buses and alerts
  useEffect(() => {
    const fetchBusesAndAlerts = async () => {
      try {
        // Fetch all buses
        const busesSnapshot = await getDocs(collection(db, "buses"));

        // Fetch all alerts with status open
        const alertsSnapshot = await getDocs(collection(db, "alerts"));
        const openAlerts = alertsSnapshot.docs.filter(
          (doc) => doc.data().status === "open"
        );

        // Build a set of bus IDs that have alerts
        const busIdsWithAlerts = new Set<string>();
        const busAlerts: { [busId: string]: string[] } = {};

        openAlerts.forEach((doc) => {
          const data = doc.data();
          busIdsWithAlerts.add(data.busId);
          if (!busAlerts[data.busId]) {
            busAlerts[data.busId] = [];
          }
          busAlerts[data.busId].push(data.reason);
        });

        setAlertedBuses(busAlerts);

        // Count buses: total active buses minus those with alerts
        const totalBuses = busesSnapshot.docs.length;
        const activeBusesWithoutAlerts = totalBuses - busIdsWithAlerts.size;

        setActiveBusCount(activeBusesWithoutAlerts);
        setAlertCount(openAlerts.length);
      } catch (error) {
        console.error("Error fetching buses and alerts:", error);
      }
    };

    fetchBusesAndAlerts();
    // Refresh every 30 seconds
    const interval = setInterval(fetchBusesAndAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStopChange = (newStop: string) => {
    manualSelectionTimeRef.current = Date.now();
    setStop(newStop);
    updateProfile({ defaultStop: newStop });
    setShowDetectedIndicator(false);
  };

  const handleCheckStatus = async () => {
    setStatus("loading");

    try {
      const docRef = doc(db, "bus_data", "current_status");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.crowding) {
          setCrowding(data.crowding as "Low" | "Medium" | "High");
          setHasLiveData(true);
        } else {
          setCrowding(null);
          setHasLiveData(false);
        }
      } else {
        setCrowding(null);
        setHasLiveData(false);
      }
    } catch (e) {
      console.error("Error fetching live status", e);
      setCrowding(null);
      setHasLiveData(false);
    }

    setTimeout(() => {
      setStatus("success");
    }, 1500);
  };

  const handleLiveTracker = () => {
    const dir = isOnBus && ctxCurrentStop
      ? (ctxCurrentStop.id >= 1 && ctxCurrentStop.id <= 14 ? "station" : "city")
      : "station";
    const params = new URLSearchParams();
    params.set("currentStop", stop);
    if (destinationStop) params.set("destination", destinationStop);
    params.set("direction", dir);
    router.push(`/${lang}/trip-details?${params.toString()}`);
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-5 pb-32">
      <BackgroundAnimation />
      <AnimatePresence>
        {hydrated && isOnBus && (
          <OnBusBanner
            nextStop={null}
            etaMinutes={null}
            title={onBusDict.bannerTitle}
            nextStopLabel={onBusDict.nextStop}
          />
        )}
      </AnimatePresence>

      <motion.div
        layout
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl p-6 relative overflow-visible shadow-sm transition-colors duration-200"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-primary-container dark:bg-blue-500 rounded-t-xl"></div>

        <motion.div layout="position" className="mb-6">
          <h1 className="text-3xl font-bold text-on-surface dark:text-slate-100 mb-2 tracking-tight">
            {dict.title}
          </h1>
          <p className="text-on-surface-variant dark:text-slate-400">{dict.subtitle}</p>
        </motion.div>

        <motion.div layout="position" className="mb-4 z-30 relative">
          <label
            className="block font-bold text-on-surface dark:text-slate-200 mb-1 text-sm tracking-wide"
            htmlFor="stop-selector"
          >
            {dict.currentStop}
          </label>
          <StopSelect value={stop} onChange={handleStopChange} />
          <AnimatePresence>
            {showDetectedIndicator && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="text-xs text-success dark:text-green-400 mt-1 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">location_on</span>
                {onBusDict.nearestStopDetected}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div layout="position" className="mb-6 relative">
          <label
            className="block font-bold text-on-surface dark:text-slate-200 mb-1 text-sm tracking-wide"
            htmlFor="destination-selector"
          >
            {tripDict.destinationOptional}
          </label>
          <StopSelect
            value={destinationStop ?? ""}
            onChange={(val) => {
              setDestinationStop(val || null);
              setDestination(val || null);
            }}
          />
        </motion.div>

        <AnimatePresence mode="popLayout">
          {!isOnBus && status === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleCheckStatus}
                className="w-full bg-primary-container dark:bg-blue-600 text-on-primary font-semibold text-xl py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <span className="material-symbols-outlined">search</span>
                {dict.checkStatus}
              </motion.button>
              <div className="mt-4 text-center">
                <p className="text-sm font-medium text-outline dark:text-slate-500 flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">schedule</span>
                  {dict.typically}
                </p>
              </div>
            </motion.div>
          )}

          {!isOnBus && status === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <Skeleton.Card />
            </motion.div>
          )}

          {!isOnBus && status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-surface-container dark:bg-slate-800 rounded-lg border border-outline-variant dark:border-slate-700 p-4 space-y-4 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2 ${hasLiveData
                      ? "bg-success-container dark:bg-green-900 text-success dark:text-green-300"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                      }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {hasLiveData ? "check_circle" : "help_outline"}
                    </span>
                    {hasLiveData ? dict.confirmed : tripDict.unconfirmed}
                  </div>
                  <h2 className="text-4xl font-black text-on-surface dark:text-slate-100 tracking-tighter">
                    {hasLiveData
                      ? "7"
                      : timetableETA ?? "?"}{" "}
                    <span className="text-lg font-medium text-on-surface-variant dark:text-slate-400">
                      {dict.mins}
                    </span>
                  </h2>
                  <p className="text-sm text-on-surface-variant dark:text-slate-400 mt-1">
                    {dict.arrivingSoon}
                  </p>
                </div>
                <div className="flex flex-col items-end text-right">
                  <div className="text-xs font-bold text-on-surface-variant dark:text-slate-400 uppercase tracking-wider mb-1">
                    {dict.crowding}
                  </div>
                  {hasLiveData && crowding ? (
                    <div
                      className={`flex items-center gap-1 ${crowding === "Low"
                        ? "text-success dark:text-green-400"
                        : crowding === "Medium"
                          ? "text-warning dark:text-yellow-400"
                          : "text-red-600 dark:text-red-400"
                        }`}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        groups
                      </span>
                      <span className="font-bold text-sm">{crowding}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <span className="material-symbols-outlined text-[18px]">help_outline</span>
                      <span className="font-bold text-sm">{tripDict.unknown}</span>
                    </div>
                  )}
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleLiveTracker}
                className="w-full bg-primary-container dark:bg-blue-600 text-on-primary font-semibold text-xl py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <span className="material-symbols-outlined">route</span>
                {tripDict.title}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setStatus("idle")}
                className="w-full border border-outline-variant dark:border-slate-700 text-on-surface dark:text-slate-200 font-semibold py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              >
                {dict.checkAgain}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full max-w-md mt-8 grid grid-cols-2 gap-4"
      >
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="bg-surface-container dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-lg p-3 flex flex-col justify-between h-24 shadow-sm cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400">
            <span className="material-symbols-outlined text-lg">directions_bus</span>
            <span className="font-bold text-sm">{dict.activeBuses}</span>
          </div>
          <div className="text-3xl font-black text-primary-container dark:text-blue-400">{activeBusCount}</div>
        </motion.div>
        <motion.div
          whileTap={{ scale: 0.95 }}
          className="bg-surface-container dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-lg p-3 flex flex-col justify-between h-24 shadow-sm cursor-pointer hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-2 text-on-surface-variant dark:text-slate-400">
            <span className="material-symbols-outlined text-lg">warning</span>
            <span className="font-bold text-sm">{dict.alerts}</span>
          </div>
          <div className="text-2xl font-black text-on-surface dark:text-slate-200">
            {alertCount > 0 ? alertCount : dict.none}
          </div>
        </motion.div>
      </motion.div>

      {/* Alert Details Section */}
      <AnimatePresence>
        {alertCount > 0 && Object.keys(alertedBuses).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full max-w-md mt-4 bg-error-container dark:bg-red-900 border border-error dark:border-red-700 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-start gap-2">
              <span className="material-symbols-outlined text-error dark:text-red-300 mt-0.5">
                error_outline
              </span>
              <div className="flex-1">
                <h3 className="font-bold text-on-error-container dark:text-red-100">
                  {dict.activeIssuesReported}
                </h3>
                <p className="text-sm text-on-error-container dark:text-red-200 mt-1">
                  {dict.followingBusesIssues}
                </p>
              </div>
            </div>
            <div className="space-y-2 mt-2">
              {Object.entries(alertedBuses).map(([busId, reasons]) => (
                <div
                  key={busId}
                  className="bg-white dark:bg-slate-800 rounded p-2 text-sm"
                >
                  <p className="font-semibold text-on-surface dark:text-slate-100">
                    {dict.busId} {busId}
                  </p>
                  <ul className="text-on-surface-variant dark:text-slate-300 mt-1 space-y-1">
                    {reasons.map((reason, idx) => (
                      <li key={idx} className="text-xs flex items-start gap-2">
                        <span className="text-error dark:text-red-400 mt-1">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {hydrated && (
        <AnimatePresence>
          <div key="report-button">
            <ReportButton />
          </div>
          <div key="onbus-button">
            <OnBusButton />
          </div>
        </AnimatePresence>
      )}
    </main>
  );
}
