"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { LocationData } from "@/hooks/useUserLocation";
import { BusStop, toStationStops, toCityCentreStops } from "@/data/route3";
import { findNearestStopOnRoute } from "@/lib/location-utils";

// TODO: FIREBASE SETUP - Bus state reporting
// ============================================================
// What needs to be done:
// 1. Uncomment Firebase imports below
// 2. Create Firestore collections with security rules:
//
//    Collection: "bus_tracking"
//    Documents: { userId, action, data, timestamp }
//    Actions: "boarded", "disembarked", "location_update", "not_here", "bus_is_here", "crowding_report"
//    Rules: allow read, write: if request.auth != null;
//
//    Collection: "bus_live_status"
//    Documents: auto-generated (real-time tracking data)
//    Schema: { userId, lat, lng, speed, direction, currentStop, nextStop, timestamp }
//    Rules: allow read: if true; allow write: if request.auth != null;
//
//    Collection: "bus_reports"
//    Documents: auto-generated (user reports)
//    Schema: { userId, type, stop, crowding, timestamp }
//    Rules: allow read: if true; allow write: if request.auth != null;
//
// 3. Add realtime Firestore listeners for:
//    - Active trackers (to show "Live Student Tracking" badge)
//    - Live bus status (for confirmed ETA, crowding data)
//    - User reports (Not Here / Bus Is Here)
// ============================================================
// import {
//   doc,
//   setDoc,
//   serverTimestamp,
//   collection,
//   query,
//   where,
//   onSnapshot,
// } from "firebase/firestore";
// import { auth, db } from "@/lib/firebase";

type Direction = "station" | "city";

interface CrowdingData {
  level: "Low" | "Medium" | "High";
  userId: string;
  timestamp: number;
}

interface BusStateContextValue {
  hydrated: boolean;
  isOnBus: boolean;
  setIsOnBus: (on: boolean) => void;
  direction: Direction | null;
  setDirection: (d: Direction | null) => void;
  currentStop: BusStop | null;
  setCurrentStop: (s: BusStop | null) => void;
  nextStop: BusStop | null;
  setNextStop: (s: BusStop | null) => void;
  destination: string | null;
  setDestination: (id: string | null) => void;
  currentUserLocation: LocationData | null;
  setCurrentUserLocation: (l: LocationData | null) => void;
  isLocationSharing: boolean;
  setIsLocationSharing: (s: boolean) => void;
  hasLiveData: boolean;
  setHasLiveData: (b: boolean) => void;
  liveCrowding: CrowdingData | null;
  setLiveCrowding: (c: CrowdingData | null) => void;
  liveTrackingUserCount: number;
  setLiveTrackingUserCount: (n: number) => void;
  boardBus: () => void;
  disembark: () => void;
  reportNotHere: () => void;
  reportBusIsHere: () => void;
  reportCrowding: (level: "Low" | "Medium" | "High") => void;
}

const BusStateContext = createContext<BusStateContextValue | undefined>(
  undefined
);

export function BusStateProvider({ children }: { children: React.ReactNode }) {
  const [isOnBus, setIsOnBusRaw] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const [direction, setDirection] = useState<Direction | null>(null);
  const [currentStop, setCurrentStop] = useState<BusStop | null>(null);
  const [nextStop, setNextStop] = useState<BusStop | null>(null);
  const [destination, setDestination] = useState<string | null>(null);
  const [currentUserLocation, setCurrentUserLocation] =
    useState<LocationData | null>(null);
  const currentUserLocationRef = useRef<LocationData | null>(null);
  const [isLocationSharing, setIsLocationSharing] = useState(false);
  const [hasLiveData, setHasLiveData] = useState(false);
  const [liveCrowding, setLiveCrowding] = useState<CrowdingData | null>(null);
  const [liveTrackingUserCount, setLiveTrackingUserCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("bandersnatch_isOnBus");
    if (stored !== null) {
      setIsOnBusRaw(stored === "true");
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("bandersnatch_isOnBus", String(isOnBus));
  }, [isOnBus]);

  useEffect(() => {
    currentUserLocationRef.current = currentUserLocation;
  }, [currentUserLocation]);

  const setIsOnBus = useCallback((on: boolean) => {
    setIsOnBusRaw(on);
    if (!on) {
      setDirection(null);
      setCurrentStop(null);
      setNextStop(null);
      setIsLocationSharing(false);
    }
  }, []);

  // TODO: FIREBASE SETUP - Report boarding event
  // Collection: "bus_reports"
  // Schema: { userId, action: "boarded", direction, currentStopId, timestamp: serverTimestamp() }
  //
  // if (auth.currentUser) {
  //   await setDoc(doc(db, "bus_reports", `board_${auth.currentUser.uid}_${Date.now()}`), {
  //     userId: auth.currentUser.uid,
  //     action: "boarded",
  //     direction,
  //     currentStopId: currentStop?.id,
  //     timestamp: serverTimestamp(),
  //   });
  // }
  //
  // Also start location update interval that writes to "bus_tracking" collection
  const boardBus = useCallback(() => {
    const loc = currentUserLocationRef.current;
    if (loc) {
      const nearest = findNearestStopOnRoute(loc.lat, loc.lng);
      if (nearest) {
        setCurrentStop(nearest.stop);
        setDirection(nearest.direction);
        const stops = nearest.direction === "station" ? toStationStops : toCityCentreStops;
        const idx = stops.findIndex((s) => s.id === nearest.stop.id);
        if (idx < stops.length - 1) {
          setNextStop(stops[idx + 1]);
        } else {
          setNextStop(null);
        }
      }
    }
    setIsOnBus(true);
  }, [setIsOnBus]);

  // TODO: FIREBASE SETUP - Report disembarking event
  // Collection: "bus_reports"
  // Schema: { userId, action: "disembarked", lastStopId, timestamp: serverTimestamp() }
  //
  // if (auth.currentUser) {
  //   await setDoc(doc(db, "bus_reports", `disembark_${auth.currentUser.uid}_${Date.now()}`), {
  //     userId: auth.currentUser.uid,
  //     action: "disembarked",
  //     lastStopId: currentStop?.id,
  //     timestamp: serverTimestamp(),
  //   });
  // }
  //
  // Also stop the location update interval
  const disembark = useCallback(() => {
    setIsOnBus(false);
  }, [setIsOnBus]);

  // TODO: FIREBASE SETUP - Report "Not Here"
  // Collection: "bus_reports"
  // Schema: { userId, type: "not_here", timestamp: serverTimestamp() }
  const reportNotHere = useCallback(() => {
    // if (auth.currentUser) {
    //   await setDoc(doc(db, "bus_reports", `not_here_${auth.currentUser.uid}_${Date.now()}`), {
    //     userId: auth.currentUser.uid,
    //     type: "not_here",
    //     timestamp: serverTimestamp(),
    //   });
    // }
    console.log("[FIREBASE] Report: Bus is not here");
  }, []);

  // TODO: FIREBASE SETUP - Report "Bus is Here"
  // Collection: "bus_reports"
  // Schema: { userId, type: "bus_is_here", timestamp: serverTimestamp() }
  const reportBusIsHere = useCallback(() => {
    // if (auth.currentUser) {
    //   await setDoc(doc(db, "bus_reports", `bus_is_here_${auth.currentUser.uid}_${Date.now()}`), {
    //     userId: auth.currentUser.uid,
    //     type: "bus_is_here",
    //     timestamp: serverTimestamp(),
    //   });
    // }
    console.log("[FIREBASE] Report: Bus is here");
  }, []);

  // TODO: FIREBASE SETUP - Report crowding
  // Collection: "bus_reports"
  // Schema: { userId, type: "crowding_report", level, stopId, timestamp: serverTimestamp() }
  const reportCrowding = useCallback((_level: "Low" | "Medium" | "High") => {
    // if (auth.currentUser) {
    //   await setDoc(doc(db, "bus_reports", `crowding_${auth.currentUser.uid}_${Date.now()}`), {
    //     userId: auth.currentUser.uid,
    //     type: "crowding_report",
    //     level,
    //     stopId: currentStop?.id,
    //     timestamp: serverTimestamp(),
    //   });
    // }
    console.log("[FIREBASE] Report crowding:", _level);
  }, []);

  const value = useMemo(
    () => ({
      hydrated,
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
      currentUserLocation,
      setCurrentUserLocation,
      isLocationSharing,
      setIsLocationSharing,
      hasLiveData,
      setHasLiveData,
      liveCrowding,
      setLiveCrowding,
      liveTrackingUserCount,
      setLiveTrackingUserCount,
      boardBus,
      disembark,
      reportNotHere,
      reportBusIsHere,
      reportCrowding,
    }),
    [
      hydrated,
      isOnBus,
      setIsOnBus,
      direction,
      setDirection,
      currentStop,
      nextStop,
      destination,
      currentUserLocation,
      isLocationSharing,
      hasLiveData,
      liveCrowding,
      liveTrackingUserCount,
      boardBus,
      disembark,
      reportNotHere,
      reportBusIsHere,
      reportCrowding,
    ]
  );

  return (
    <BusStateContext.Provider value={value}>
      {children}
    </BusStateContext.Provider>
  );
}

export function useBusState() {
  const ctx = useContext(BusStateContext);
  if (!ctx) throw new Error("useBusState must be used within BusStateProvider");
  return ctx;
}
