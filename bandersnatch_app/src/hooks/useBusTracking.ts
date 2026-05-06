"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useCallback, useEffect, useRef } from "react";
import { BusStop, toStationStops, toCityCentreStops } from "@/data/route3";
import { findNearestStopOnRoute, isInCenterArea } from "@/lib/location-utils";
import { LocationData } from "@/hooks/useUserLocation";

// TODO: FIREBASE SETUP - Bus tracking reporting
// ============================================================
// What needs to be done:
// 1. Uncomment the Firebase imports below
// 2. Ensure Firestore security rules allow writes for authenticated users:
//    match /bus_tracking/{trackingId} {
//      allow read, write: if request.auth != null;
//    }
// 3. Verify Firebase is initialized in src/lib/firebase.ts
// ============================================================
// import { doc, setDoc, serverTimestamp } from "firebase/firestore";
// import { auth, db } from "@/lib/firebase";

interface UseBusTrackingReturn {
  isOnBus: boolean;
  currentStop: BusStop | null;
  nextStop: BusStop | null;
  direction: "station" | "city" | null;
  etaMinutes: number | null;
  boardBus: () => void;
  disembark: () => void;
}

const SLOW_SPEED_THRESHOLD_KMH = 5;
const SLOW_SPEED_TIMEOUT_MS = 5 * 60 * 1000;

export function useBusTracking(
  userLocation: LocationData | null,
  startTracking: () => void
): UseBusTrackingReturn {
  const [isOnBus, setIsOnBus] = useState(false);
  const [currentStop, setCurrentStop] = useState<BusStop | null>(null);
  const [nextStop, setNextStop] = useState<BusStop | null>(null);
  const [direction, setDirection] = useState<"station" | "city" | null>(null);
  const [etaMinutes, setEtaMinutes] = useState<number | null>(null);

  const slowSpeedStartRef = useRef<number | null>(null);
  const lastDirectionRef = useRef<"station" | "city" | null>(null);

  const boardBus = useCallback(() => {
    if (!userLocation) return;

    const nearest = findNearestStopOnRoute(userLocation.lat, userLocation.lng);
    if (!nearest) return;

    setCurrentStop(nearest.stop);
    setDirection(nearest.direction);
    lastDirectionRef.current = nearest.direction;

    const stops =
      nearest.direction === "station" ? toStationStops : toCityCentreStops;
    const idx = stops.findIndex((s) => s.id === nearest.stop.id);
    if (idx < stops.length - 1) {
      setNextStop(stops[idx + 1]);
    } else {
      setNextStop(null);
    }

    setIsOnBus(true);
    slowSpeedStartRef.current = null;

    // TODO: FIREBASE SETUP - Report boarding event
    // Collection: "bus_tracking"
    // Document: auto-generated ID (via addDoc or setDoc with doc())
    // Schema: {
    //   userId: auth.currentUser?.uid,
    //   action: "boarded",
    //   boardingStopId: nearest.stop.id,
    //   boardingStopName: nearest.stop.name,
    //   direction: nearest.direction,
    //   lat: userLocation.lat,
    //   lng: userLocation.lng,
    //   timestamp: serverTimestamp()
    // }
    // Security rules needed: allow write if request.auth != null;
    //
    // Example (uncomment after setup):
    // if (auth.currentUser) {
    //   const trackingRef = doc(db, "bus_tracking", `${auth.currentUser.uid}_${Date.now()}`);
    //   await setDoc(trackingRef, {
    //     userId: auth.currentUser.uid,
    //     action: "boarded",
    //     boardingStopId: nearest.stop.id,
    //     boardingStopName: nearest.stop.name,
    //     direction: nearest.direction,
    //     lat: userLocation.lat,
    //     lng: userLocation.lng,
    //     timestamp: serverTimestamp(),
    //   });
    // }
  }, [userLocation]);

  const disembark = useCallback(() => {
    // TODO: FIREBASE SETUP - Report disembarking event
    // Collection: "bus_tracking"
    // Schema: {
    //   userId: auth.currentUser?.uid,
    //   action: "disembarked",
    //   lastStopId: currentStop?.id,
    //   lastStopName: currentStop?.name,
    //   direction: lastDirectionRef.current,
    //   timestamp: serverTimestamp()
    // }
    //
    // Example (uncomment after setup):
    // if (auth.currentUser) {
    //   const trackingRef = doc(db, "bus_tracking", `${auth.currentUser.uid}_${Date.now()}`);
    //   await setDoc(trackingRef, {
    //     userId: auth.currentUser.uid,
    //     action: "disembarked",
    //     lastStopId: currentStop?.id,
    //     lastStopName: currentStop?.name,
    //     direction: lastDirectionRef.current,
    //     timestamp: serverTimestamp(),
    //   });
    // }

    setIsOnBus(false);
    setCurrentStop(null);
    setNextStop(null);
    setDirection(null);
    setEtaMinutes(null);
    slowSpeedStartRef.current = null;
  }, []);

  useEffect(() => {
    if (!isOnBus || !userLocation || !direction) return;

    const stops = direction === "station" ? toStationStops : toCityCentreStops;

    const currentIdx = stops.findIndex((s) => s.id === currentStop?.id);

    const nearest = findNearestStopOnRoute(userLocation.lat, userLocation.lng);
    if (!nearest) return;

    const nearestIdx = stops.findIndex((s) => s.id === nearest.stop.id);

    if (nearestIdx > currentIdx && currentIdx >= 0) {
      setCurrentStop(nearest.stop);
      lastDirectionRef.current = direction;
      if (nearestIdx < stops.length - 1) {
        setNextStop(stops[nearestIdx + 1]);
      } else {
        setNextStop(null);
      }
    }

    if (nextStop && userLocation.speed && userLocation.speed > 0) {
      const dx =
        (nextStop.lat - userLocation.lat) * 111000;
      const dy =
        (nextStop.lng - userLocation.lng) *
        111000 *
        Math.cos((userLocation.lat * Math.PI) / 180);
      const distance = Math.sqrt(dx * dx + dy * dy);
      const etaSec = distance / userLocation.speed;
      setEtaMinutes(Math.max(1, Math.round(etaSec / 60)));
    }

    const speedKmh = userLocation.speed ? userLocation.speed * 3.6 : 0;
    const inCenter = isInCenterArea(userLocation.lat, userLocation.lng);

    if (speedKmh < SLOW_SPEED_THRESHOLD_KMH && !inCenter) {
      if (slowSpeedStartRef.current === null) {
        slowSpeedStartRef.current = Date.now();
      } else if (
        Date.now() - slowSpeedStartRef.current >
        SLOW_SPEED_TIMEOUT_MS
      ) {
        disembark();
      }
    } else {
      slowSpeedStartRef.current = null;
    }
  }, [isOnBus, userLocation, direction, currentStop, nextStop, disembark]);

  return {
    isOnBus,
    currentStop,
    nextStop,
    direction,
    etaMinutes,
    boardBus,
    disembark,
  };
}
