"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getDictionary, Locale } from "@/i18n/dictionaries";
import { useBusState } from "@/context/BusStateContext";
import { useUserLocation } from "@/hooks/useUserLocation";
import { findNearestStopOnRoute } from "@/lib/location-utils";
import {
  getNext3Stops,
  getNextScheduledBus,
  getETAtoDestination,
  getNextStopFromCurrent,
} from "@/lib/timetable";
import { toStationStops, toCityCentreStops, getBusStopName } from "@/data/route3";
import { motion, AnimatePresence } from "framer-motion";
import {
  Locate,
  EyeOff,
  CheckCircle,
  Users,
  Radio,
  Armchair,
  User,
  Ban,
  Check,
  MapPin,
  Car,
} from "lucide-react";
import { StopSelect } from "@/components/StopSelect";

export default function TripDetailsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const dict = getDictionary(lang as Locale).tripDetails;

  const {
    isOnBus,
    setIsOnBus,
    direction,
    setDirection,
    currentStop,
    setCurrentStop,
    nextStop,
    setNextStop,
    destination,
    setDestination,
    setCurrentUserLocation,
    isLocationSharing,
    setIsLocationSharing,
    hasLiveData,
    liveTrackingUserCount,
    boardBus,
    disembark,
    reportNotHere,
    reportBusIsHere,
    reportCrowding,
  } = useBusState();

  const { location, startTracking } = useUserLocation();
  const [selectedCrowding, setSelectedCrowding] = useState<
    "seats" | "standing" | "full" | null
  >(null);
  const [timetableETA, setTimetableETA] = useState<number | null>(null);
  const [showDestinationPicker, setShowDestinationPicker] = useState(false);
  const [reportFeedback, setReportFeedback] = useState<string | null>(null);

  const currentStopParam = searchParams.get("currentStop");
  const destinationParam = searchParams.get("destination");
  const directionParam = searchParams.get("direction") as
    | "station"
    | "city"
    | null;

  useEffect(() => {
    startTracking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location) {
      setCurrentUserLocation(location);
    }
  }, [location, setCurrentUserLocation]);

  useEffect(() => {
    if (directionParam && !direction) {
      setDirection(directionParam);
    }
  }, [directionParam, direction, setDirection]);

  useEffect(() => {
    if (destinationParam && !destination) {
      setDestination(destinationParam);
    }
  }, [destinationParam, destination, setDestination]);

  useEffect(() => {
    const updateETA = () => {
      if (isOnBus && isLocationSharing && destination && currentStop && direction) {
        const eta = getETAtoDestination(
          currentStop.id,
          parseInt(destination),
          direction
        );
        setTimetableETA(eta);
      } else if (!isOnBus && direction) {
        const { minutes } = getNextScheduledBus(direction);
        if (currentStop) {
          const stops = direction === "station"
            ? toStationStops
            : toCityCentreStops;
          const idx = stops.findIndex(
            (s) => s.id === currentStop.id
          );
          setTimetableETA(minutes + idx * 7);
        } else {
          setTimetableETA(minutes);
        }
      } else {
        const { minutes } = getNextScheduledBus("station");
        setTimetableETA(minutes);
      }
    };

    updateETA();
    const interval = setInterval(updateETA, 60000);
    return () => clearInterval(interval);
  }, [isOnBus, isLocationSharing, destination, currentStop, direction]);

  useEffect(() => {
    if (isOnBus && isLocationSharing && location) {
      const nearest = findNearestStopOnRoute(location.lat, location.lng);
      if (nearest) {
        setCurrentStop(nearest.stop);
        if (!direction) {
          setDirection(nearest.direction);
        }
        const stops =
          nearest.direction === "station"
            ? toStationStops
            : toCityCentreStops;
        const idx = stops.findIndex(
          (s) => s.id === nearest.stop.id
        );
        if (idx < stops.length - 1) {
          setNextStop(stops[idx + 1]);
        } else {
          setNextStop(null);
        }
      }
    }
  }, [isOnBus, isLocationSharing, location, direction, setCurrentStop, setDirection, setNextStop]);

  const handleToggleLocationSharing = async () => {
    if (!isLocationSharing) {
      try {
        const permission = await navigator.permissions.query({
          name: "geolocation" as PermissionName,
        });
        if (permission.state === "prompt" || permission.state === "denied") {
          await navigator.geolocation.getCurrentPosition(() => { }, () => { }, {
            enableHighAccuracy: true,
          });
        }
        setIsLocationSharing(true);
        boardBus();
        setIsOnBus(true);
        if (location) {
          const nearest = findNearestStopOnRoute(location.lat, location.lng);
          if (nearest) {
            setCurrentStop(nearest.stop);
            setDirection(nearest.direction);
          }
        }
      } catch {
        // GPS permission denied
      }
    } else {
      setIsLocationSharing(false);
      disembark();
    }
  };

  const handleNotHere = () => {
    reportNotHere();
    setReportFeedback(dict.reported);
    setTimeout(() => setReportFeedback(null), 2000);
  };

  const handleBusIsHere = () => {
    reportBusIsHere();
    setReportFeedback(dict.reported);
    setTimeout(() => setReportFeedback(null), 2000);
  };

  const handleCrowdingSelect = (level: "seats" | "standing" | "full") => {
    setSelectedCrowding(level);
    const mapping = {
      seats: "Low",
      standing: "Medium",
      full: "High",
    } as const;
    reportCrowding(mapping[level]);
  };

  const upcomingStops =
    isOnBus && currentStop && direction
      ? getNext3Stops(currentStop.id, direction)
      : direction
        ? getNext3Stops(parseInt(currentStopParam || "1"), direction)
        : [];

  const _nextStopFromCurrent = direction
    ? getNextStopFromCurrent(parseInt(currentStopParam || "1"), direction)
    : undefined;

  const displayNextStop =
    isOnBus && isLocationSharing && nextStop
      ? getBusStopName(nextStop, lang)
      : _nextStopFromCurrent
        ? getBusStopName(_nextStopFromCurrent, lang)
        : "—";

  const isLiveTracking =
    liveTrackingUserCount > 0 || (isOnBus && isLocationSharing);

  return (
    <main className="flex-grow bg-slate-50 dark:bg-slate-950 p-5 pb-32 max-w-md mx-auto w-full space-y-4">
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push(`/${lang}`)}
        className="flex items-center gap-2 text-on-surface dark:text-slate-200 font-medium hover:text-primary-container dark:hover:text-blue-400 transition-colors"
      >
        <span className="material-symbols-outlined">arrow_back</span>
        <span>{dict.title}</span>
      </motion.button>

      <AnimatePresence>
        {reportFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -12, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -12, height: 0 }}
            transition={{ type: "spring", bounce: 0, duration: 0.35 }}
            className="bg-success-container dark:bg-green-900/30 text-success dark:text-green-400 text-sm font-medium py-2 px-4 rounded-lg text-center overflow-hidden"
          >
            {reportFeedback}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 shadow-sm rounded-xl border-t-4 p-5 transition-colors"
        style={{
          borderTopColor: hasLiveData ? "#22c55e" : "#9ca3af",
        }}
      >
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider ${hasLiveData
                ? "bg-green-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              }`}
          >
            {hasLiveData ? dict.confirmed : dict.unconfirmed}
          </span>
          {isLiveTracking && (
            <span className="inline-flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
              <Radio className="w-3 h-3" />
              {dict.liveTracking}
            </span>
          )}
        </div>

        <div className="text-center py-3">
          {isOnBus && isLocationSharing && destination ? (
            <>
              <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                {dict.timeToDestination}
              </p>
              <p className="text-5xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                {timetableETA ?? "?"}{" "}
                <span className="text-xl font-medium">{dict.min}</span>
              </p>
            </>
          ) : isOnBus && !destination ? (
            <>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight mb-2">
                {dict.happyDriving}
              </p>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setShowDestinationPicker(!showDestinationPicker)}
                className="text-sm text-blue-600 dark:text-blue-400 underline"
              >
                {dict.selectDestination}
              </motion.button>
              {showDestinationPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <StopSelect
                    value={destination ?? ""}
                    onChange={(val) => {
                      setDestination(val || null);
                      if (val) setShowDestinationPicker(false);
                    }}
                  />
                </motion.div>
              )}
            </>
          ) : (
            <>
              <p className="text-5xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
                {timetableETA ?? "?"}{" "}
                <span className="text-xl font-medium">{dict.min}</span>
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {dict.estimatedArrival}
              </p>
            </>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium">
            {hasLiveData ? dict.capacity : dict.capacityUnknown}
          </span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={handleToggleLocationSharing}
        className={`bg-white dark:bg-slate-900 shadow-sm rounded-xl p-4 flex items-center gap-4 transition-colors cursor-pointer ${isLocationSharing
            ? "ring-2 ring-blue-500 dark:ring-blue-400"
            : ""
          }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isLocationSharing
              ? "bg-blue-500 text-white"
              : "bg-blue-50 dark:bg-blue-900/30"
            }`}
        >
          <Locate
            className={`w-5 h-5 ${isLocationSharing
                ? "text-white"
                : "text-blue-600 dark:text-blue-400"
              }`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-on-surface dark:text-slate-200">
            {dict.imOnBus}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {dict.broadcastHelp}
          </p>
        </div>
        <div
          className={`w-12 h-7 rounded-full relative flex-shrink-0 ${isLocationSharing
              ? "bg-blue-500"
              : "bg-slate-200 dark:bg-slate-700"
            }`}
        >
          <motion.div
            className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm"
            animate={{ x: isLocationSharing ? 22 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 gap-4"
      >
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleNotHere}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <EyeOff className="w-5 h-5" />
          {dict.notHere}
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleBusIsHere}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
        >
          <CheckCircle className="w-5 h-5" />
          {dict.busIsHere}
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-4 flex items-center gap-3 shadow-sm"
      >
        <div className="w-10 h-10 rounded-full bg-black/15 flex items-center justify-center flex-shrink-0">
          <Car className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white uppercase tracking-wide">
            {dict.splitRide}
          </p>
          <p className="text-xs text-white/90">{dict.splitRideSub}</p>
        </div>
        <button
          onClick={() => router.push(`/${lang}/find-ride`)}
          className="bg-black/20 text-white text-xs font-medium px-3 py-1.5 rounded-full hover:bg-black/30 transition-colors flex-shrink-0"
        >
          {dict.findGroup}
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-colors">
          <div className="flex items-center gap-1.5 mb-2">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">
              {dict.capacityLabel}
            </p>
          </div>
          <p className="text-xl font-black text-slate-800 dark:text-slate-200">
            {hasLiveData ? dict.capacityFull : dict.capacityUnknown}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-colors">
          <div className="flex items-center gap-1.5 mb-2">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">
              {dict.nextStopLabel}
            </p>
          </div>
          <p className="text-xl font-black text-slate-800 dark:text-slate-200 truncate">
            {displayNextStop}
          </p>
        </div>
      </motion.div>

      {isOnBus && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 transition-colors"
        >
          <h3 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3">
            {dict.reportCrowding}
          </h3>

          <div className="space-y-2">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCrowdingSelect("seats")}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${selectedCrowding === "seats"
                  ? "bg-green-50 dark:bg-green-900/20 border-green-600 text-green-700 dark:text-green-400"
                  : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
            >
              <Armchair className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium">{dict.seatsAvailable}</span>
              {selectedCrowding === "seats" && (
                <Check className="w-4 h-4 ml-auto text-green-600 flex-shrink-0" />
              )}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCrowdingSelect("standing")}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${selectedCrowding === "standing"
                  ? "bg-amber-50 dark:bg-amber-900/20 border-amber-500 text-amber-700 dark:text-amber-400"
                  : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
            >
              <User className="w-5 h-5 text-amber-500" />
              <span className="text-sm font-medium">{dict.standingRoom}</span>
              {selectedCrowding === "standing" && (
                <Check className="w-4 h-4 ml-auto text-amber-500 flex-shrink-0" />
              )}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCrowdingSelect("full")}
              className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors text-left ${selectedCrowding === "full"
                  ? "bg-red-50 dark:bg-red-900/20 border-red-600 text-red-700 dark:text-red-400"
                  : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
            >
              <Ban className="w-5 h-5 text-red-600" />
              <span className="text-sm font-medium">{dict.fullDoNotBoard}</span>
              {selectedCrowding === "full" && (
                <Check className="w-4 h-4 ml-auto text-red-600 flex-shrink-0" />
              )}
            </motion.button>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white dark:bg-slate-900 shadow-sm rounded-xl p-5 transition-colors"
      >
        <h3 className="text-lg font-medium text-on-surface dark:text-slate-100 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          {dict.upcomingStops}
        </h3>

        {isOnBus && !destination && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 flex items-center gap-3"
          >
            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">
              directions_bus
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                {dict.happyDriving}
              </p>
              <button
                onClick={() => setShowDestinationPicker(!showDestinationPicker)}
                className="text-xs text-blue-600 dark:text-blue-400 underline mt-1"
              >
                {dict.selectDestination}
              </button>
            </div>
            {showDestinationPicker && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2"
              >
                <StopSelect
                  value={destination ?? ""}
                  onChange={(val) => {
                    setDestination(val || null);
                    if (val) setShowDestinationPicker(false);
                  }}
                />
              </motion.div>
            )}
          </motion.div>
        )}

        <div className="relative">
          <div className="absolute left-[7px] top-3 bottom-3 w-0.5 bg-slate-200 dark:bg-slate-700" />

          <div className="space-y-5">
            {upcomingStops.map((stopInfo, index) => (
              <div key={stopInfo.stop.id} className="relative flex items-start">
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${index === 0
                        ? "bg-blue-600 border-blue-600"
                        : "bg-white dark:bg-slate-900 border-blue-400"
                      }`}
                  />
                </div>

                <div className="ml-4 flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface dark:text-slate-200">
                    {getBusStopName(stopInfo.stop, lang)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {dict.stop} {stopInfo.stop.id}
                    {destination &&
                      stopInfo.stop.id === parseInt(destination)
                      ? ` • ${dict.currentDestination}`
                      : ""}
                  </p>
                </div>

                <p
                  className={`text-sm font-bold flex-shrink-0 ${index === 0
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-on-surface dark:text-slate-200"
                    }`}
                >
                  {stopInfo.etaMinutes} {dict.min}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </main>
  );
}
