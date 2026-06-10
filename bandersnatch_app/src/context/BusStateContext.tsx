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

import {
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  reportBusStatus,
  reportBusTrackingEvent,
} from "@/lib/bus-reporting";
import {
  incrementTrustScore,
  decrementTrustScore,
  incrementReportCount,
} from "@/lib/trust-utils";

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
  boardBus: () => Promise<void>;
  disembark: () => Promise<void>;
  reportNotHere: () => Promise<void>;
  reportBusIsHere: () => Promise<void>;
  reportCrowding: (level: "Low" | "Medium" | "High") => Promise<void>;
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

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid || !isLocationSharing || !currentUserLocation) {
      if (uid) {
        deleteDoc(doc(db, "peer_locations", uid)).catch(() => {});
      }
      return;
    }

    const peerRef = doc(db, "peer_locations", uid);
    const interval = setInterval(() => {
      setDoc(peerRef, {
        lat: currentUserLocation.lat,
        lng: currentUserLocation.lng,
        heading: currentUserLocation.heading,
        accuracy: currentUserLocation.accuracy,
        direction,
        isOnBus: true,
        displayName: auth.currentUser?.displayName || "Student",
        timestamp: serverTimestamp(),
      }).catch(() => {});
    }, 5000);

    setDoc(peerRef, {
      lat: currentUserLocation.lat,
      lng: currentUserLocation.lng,
      heading: currentUserLocation.heading,
      accuracy: currentUserLocation.accuracy,
      direction,
      isOnBus: true,
      displayName: auth.currentUser?.displayName || "Student",
      timestamp: serverTimestamp(),
    }).catch(() => {});

    return () => {
      clearInterval(interval);
      deleteDoc(peerRef).catch(() => {});
    };
  }, [isLocationSharing, currentUserLocation, direction]);

  const setIsOnBus = useCallback((on: boolean) => {
    setIsOnBusRaw(on);
    if (!on) {
      setDirection(null);
      setCurrentStop(null);
      setNextStop(null);
      setIsLocationSharing(false);
    }
  }, []);

  const boardBus = useCallback(async () => {
    const loc = currentUserLocationRef.current;
    let boardDirection: Direction | null = null;
    let boardStopId: number | undefined;
    let boardStopName: string | undefined;

    if (loc) {
      const nearest = findNearestStopOnRoute(loc.lat, loc.lng);
      if (nearest) {
        setCurrentStop(nearest.stop);
        setDirection(nearest.direction);
        boardDirection = nearest.direction;
        boardStopId = nearest.stop.id;
        boardStopName =
          typeof nearest.stop.name === "string"
            ? nearest.stop.name
            : nearest.stop.name.en;
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

    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      await reportBusTrackingEvent({
        action: "boarded",
        direction: boardDirection,
        stopId: boardStopId,
        stopName: boardStopName,
        location: loc
          ? {
              lat: loc.lat,
              lng: loc.lng,
              accuracy: loc.accuracy,
              heading: loc.heading,
              speed: loc.speed,
            }
          : null,
      });
      await incrementTrustScore(uid, 1);
      await incrementReportCount(uid);
    } catch (err) {
      console.error("Failed to report boarding:", err);
    }
  }, [setIsOnBus]);

  const disembark = useCallback(async () => {
    const loc = currentUserLocationRef.current;
    const lastStop = currentStop;
    const lastDirection = direction;

    setIsOnBus(false);

    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      await reportBusTrackingEvent({
        action: "disembarked",
        direction: lastDirection,
        stopId: lastStop?.id,
        stopName:
          typeof lastStop?.name === "string"
            ? lastStop.name
            : lastStop?.name.en,
        location: loc
          ? {
              lat: loc.lat,
              lng: loc.lng,
              accuracy: loc.accuracy,
              heading: loc.heading,
              speed: loc.speed,
            }
          : null,
      });
      await incrementTrustScore(uid, 1);
    } catch (err) {
      console.error("Failed to report disembark:", err);
    }
  }, [setIsOnBus, currentStop, direction]);

  const reportNotHere = useCallback(async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const loc = currentUserLocationRef.current;
      await reportBusStatus({
        type: "not_here",
        direction,
        stopId: currentStop?.id,
        stopName:
          typeof currentStop?.name === "string"
            ? currentStop.name
            : currentStop?.name.en,
        location: loc
          ? {
              lat: loc.lat,
              lng: loc.lng,
              accuracy: loc.accuracy,
              heading: loc.heading,
              speed: loc.speed,
            }
          : null,
      });
      await decrementTrustScore(uid, 1);
      await incrementReportCount(uid);
    } catch (err) {
      console.error("Failed to report not here:", err);
    }
  }, [currentStop, direction]);

  const reportBusIsHere = useCallback(async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const loc = currentUserLocationRef.current;
      await reportBusStatus({
        type: "bus_is_here",
        direction,
        stopId: currentStop?.id,
        stopName:
          typeof currentStop?.name === "string"
            ? currentStop.name
            : currentStop?.name.en,
        location: loc
          ? {
              lat: loc.lat,
              lng: loc.lng,
              accuracy: loc.accuracy,
              heading: loc.heading,
              speed: loc.speed,
            }
          : null,
      });
      await incrementTrustScore(uid, 2);
      await incrementReportCount(uid);
    } catch (err) {
      console.error("Failed to report bus is here:", err);
    }
  }, [currentStop, direction]);

  const reportCrowding = useCallback(async (level: "Low" | "Medium" | "High") => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      const loc = currentUserLocationRef.current;
      await reportBusStatus({
        type: "crowding_report",
        level,
        direction,
        stopId: currentStop?.id,
        stopName:
          typeof currentStop?.name === "string"
            ? currentStop.name
            : currentStop?.name.en,
        location: loc
          ? {
              lat: loc.lat,
              lng: loc.lng,
              accuracy: loc.accuracy,
              heading: loc.heading,
              speed: loc.speed,
            }
          : null,
      });
      await incrementTrustScore(uid, 1);
      await incrementReportCount(uid);
    } catch (err) {
      console.error("Failed to report crowding:", err);
    }
  }, [currentStop, direction]);

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
