"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useState, useCallback, useEffect, useRef } from "react";
import { BusStop, toStationStops, toCityCentreStops } from "@/data/route3";
import { findNearestStopOnRoute, isInCenterArea } from "@/lib/location-utils";
import { LocationData } from "@/hooks/useUserLocation";
import { reportBusTrackingEvent } from "@/lib/bus-reporting";

interface UseBusTrackingReturn {
  isOnBus: boolean;
  currentStop: BusStop | null;
  nextStop: BusStop | null;
  direction: "station" | "city" | null;
  etaMinutes: number | null;
  boardBus: () => Promise<void>;
  disembark: () => Promise<void>;
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

  const boardBus = useCallback(async () => {
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

    try {
      await reportBusTrackingEvent({
        action: "boarded",
        stopId: nearest.stop.id,
        stopName:
          typeof nearest.stop.name === "string"
            ? nearest.stop.name
            : nearest.stop.name.en,
        direction: nearest.direction,
        location: {
          lat: userLocation.lat,
          lng: userLocation.lng,
          accuracy: userLocation.accuracy,
          heading: userLocation.heading,
          speed: userLocation.speed,
        },
      });
    } catch (error) {
      console.error("Failed to persist boarding event:", error);
    }
  }, [userLocation]);

  const disembark = useCallback(async () => {
    try {
      await reportBusTrackingEvent({
        action: "disembarked",
        stopId: currentStop?.id,
        stopName:
          typeof currentStop?.name === "string"
            ? currentStop.name
            : currentStop?.name.en,
        direction: lastDirectionRef.current,
        location: userLocation
          ? {
              lat: userLocation.lat,
              lng: userLocation.lng,
              accuracy: userLocation.accuracy,
              heading: userLocation.heading,
              speed: userLocation.speed,
            }
          : null,
      });
    } catch (error) {
      console.error("Failed to persist disembarking event:", error);
    }

    setIsOnBus(false);
    setCurrentStop(null);
    setNextStop(null);
    setDirection(null);
    setEtaMinutes(null);
    slowSpeedStartRef.current = null;
  }, [currentStop, userLocation]);

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
        void disembark();
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
