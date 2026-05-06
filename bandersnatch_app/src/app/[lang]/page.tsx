"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useEffect, use } from "react";
import { useAuth } from "@/context/AuthContext";
import { StopSelect } from "@/components/StopSelect";
import { motion, AnimatePresence } from "framer-motion";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getDictionary, Locale } from "@/i18n/dictionaries";
import { useUserLocation } from "@/hooks/useUserLocation";
import { useBusTracking } from "@/hooks/useBusTracking";
import { findNearestStopOnRoute } from "@/lib/location-utils";
import { OnBusBanner } from "@/components/OnBusBanner";
import { OnBusButton } from "@/components/OnBusButton";

export default function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const dict = getDictionary(lang as Locale).home;
  const onBusDict = getDictionary(lang as Locale).onBus;

  const { profile, updateProfile } = useAuth();
  const [stop, setStop] = useState("10");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [loadingMessage, setLoadingMessage] = useState(dict.checking);
  const [crowding, setCrowding] = useState<"Low" | "Medium" | "High">("Medium");
  const [showDetectedIndicator, setShowDetectedIndicator] = useState(false);

  const {
    location,
    startTracking,
    stopTracking,
  } = useUserLocation();

  const {
    isOnBus,
    currentStop,
    nextStop,
    direction,
    etaMinutes,
    boardBus,
    disembark,
  } = useBusTracking(location);

  useEffect(() => {
    if (profile?.defaultStop) {
      setStop(profile.defaultStop);
    }
  }, [profile]);

  useEffect(() => {
    startTracking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location && !isOnBus) {
      const nearest = findNearestStopOnRoute(location.lat, location.lng);
      if (nearest) {
        const stopId = nearest.stop.id.toString();
        setStop(stopId);
        updateProfile(stopId);
        setShowDetectedIndicator(true);
        stopTracking();
      }
    }
  }, [location, isOnBus, stopTracking, updateProfile]);

  useEffect(() => {
    if (showDetectedIndicator) {
      const timer = setTimeout(() => setShowDetectedIndicator(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showDetectedIndicator]);

  const handleStopChange = (newStop: string) => {
    setStop(newStop);
    updateProfile(newStop);
  };

  const handleCheckStatus = async () => {
    setStatus("loading");
    setLoadingMessage(dict.checking);

    const timeoutId = setTimeout(() => setLoadingMessage(dict.stillChecking), 3000);

    try {
      const docRef = doc(db, "bus_data", "current_status");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.crowding) setCrowding(data.crowding as "Low" | "Medium" | "High");
      }
    } catch (e) {
      console.error("Error fetching live status", e);
    }

    setTimeout(() => {
      clearTimeout(timeoutId);
      setStatus("success");
    }, 1500);
  };

  const handleBoardBus = () => {
    startTracking();
    boardBus();
  };

  const handleDisembark = () => {
    disembark();
    stopTracking();
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-5 pb-32">
      <AnimatePresence>
        {isOnBus && (
          <OnBusBanner
            nextStop={nextStop}
            etaMinutes={etaMinutes}
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

        <motion.div layout="position" className="mb-6 z-20 relative">
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

        <AnimatePresence mode="popLayout">
          {isOnBus && (
            <motion.div
              key="on-bus"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full bg-surface-container dark:bg-slate-800 rounded-lg border border-outline-variant dark:border-slate-700 p-4 space-y-4 transition-colors"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-success dark:text-green-400 text-2xl">
                  directions_bus
                </span>
                <h2 className="text-lg font-bold text-on-surface dark:text-slate-100">
                  {onBusDict.onBusTitle}
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">
                    {onBusDict.currentStopLabel}
                  </p>
                  <p className="text-sm font-bold text-on-surface dark:text-slate-100 truncate">
                    {currentStop?.name || "—"}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">
                    {onBusDict.nextStopLabel}
                  </p>
                  <p className="text-sm font-bold text-on-surface dark:text-slate-100 truncate">
                    {nextStop?.name || "—"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700 rounded-lg p-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">
                    {onBusDict.etaLabel}
                  </p>
                  <p className="text-2xl font-black text-primary-container dark:text-blue-400">
                    {etaMinutes != null && etaMinutes > 0 ? `${etaMinutes} min` : onBusDict.noEta}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mb-1">
                    Direction
                  </p>
                  <p className="text-sm font-bold text-on-surface dark:text-slate-100">
                    {direction === "station"
                      ? onBusDict.tripDirectionStation
                      : onBusDict.tripDirectionCity}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

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
              className="w-full py-6 flex flex-col items-center justify-center space-y-4 bg-surface-container dark:bg-slate-800 rounded-lg border border-outline-variant dark:border-slate-700 transition-colors"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-container dark:border-blue-400"></div>
              <p className="text-on-surface dark:text-slate-200 font-medium animate-pulse">
                {loadingMessage}
              </p>
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
                  <div className="inline-flex items-center gap-1 bg-success-container dark:bg-green-900 text-success dark:text-green-300 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-2">
                    <span className="material-symbols-outlined text-[14px]">check_circle</span>
                    {dict.confirmed}
                  </div>
                  <h2 className="text-4xl font-black text-on-surface dark:text-slate-100 tracking-tighter">
                    7{" "}
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
                  <div
                    className={`flex items-center gap-1 ${
                      crowding === "Low"
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
                </div>
              </div>
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
          <div className="text-3xl font-black text-primary-container dark:text-blue-400">2</div>
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
            {dict.none}
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        <OnBusButton
          isOnBus={isOnBus}
          onBoard={handleBoardBus}
          onDisembark={handleDisembark}
          onBusLabel={onBusDict.onBusButton}
          offBusLabel={onBusDict.offBusButton}
        />
      </AnimatePresence>
    </main>
  );
}
