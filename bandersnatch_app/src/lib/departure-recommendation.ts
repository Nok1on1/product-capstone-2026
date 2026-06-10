import { BusStop } from "@/data/route3";
import { haversineDistance } from "@/lib/location-utils";
import { getStopsInDirection, getTimetableETAFromNow } from "@/lib/timetable";
import { DelayPattern } from "@/lib/delay-prediction";

type Direction = "station" | "city";

interface DepartureRecommendationInput {
  stopId: number;
  direction: Direction;
  userLocation?: { lat: number; lng: number } | null;
  hasLiveData: boolean;
  liveEtaMinutes?: number | null;
  delayPattern?: DelayPattern | null;
  now?: Date;
}

export interface DepartureRecommendation {
  stop: BusStop | null;
  leaveBy: Date;
  expectedArrivalMinutes: number | null;
  walkingMinutes: number;
  confidence: "confirmed" | "historical" | "timetable";
  summary: string;
  detail: string;
}

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function getDepartureRecommendation({
  stopId,
  direction,
  userLocation,
  hasLiveData,
  liveEtaMinutes,
  delayPattern,
  now = new Date(),
}: DepartureRecommendationInput): DepartureRecommendation {
  const stops = getStopsInDirection(direction);
  const stop = stops.find((item) => item.id === stopId) ?? null;

  const walkingMinutes = stop && userLocation
    ? Math.max(
        1,
        Math.ceil(
          haversineDistance(userLocation.lat, userLocation.lng, stop.lat, stop.lng) / 80
        )
      )
    : 7;

  const timetableEta = getTimetableETAFromNow(stopId, direction);
  const historicalDelay = delayPattern?.averageDelayMinutes ?? 0;
  const expectedArrivalMinutes = hasLiveData && liveEtaMinutes != null
    ? liveEtaMinutes
    : timetableEta != null
      ? Math.max(0, timetableEta + historicalDelay)
      : null;

  const leaveInMinutes =
    expectedArrivalMinutes == null
      ? walkingMinutes
      : Math.max(0, expectedArrivalMinutes - walkingMinutes - 2);
  const leaveBy = new Date(now.getTime() + leaveInMinutes * 60000);

  const confidence: DepartureRecommendation["confidence"] =
    hasLiveData && liveEtaMinutes != null
      ? "confirmed"
      : delayPattern
        ? "historical"
        : "timetable";

  const stopName =
    typeof stop?.name === "string" ? stop.name : stop?.name.en ?? "your stop";
  const etaText =
    expectedArrivalMinutes == null
      ? "schedule unavailable"
      : `bus expected in ${expectedArrivalMinutes} min`;
  const confidenceText =
    confidence === "confirmed"
      ? "live report"
      : confidence === "historical"
        ? `${delayPattern?.confidence ?? "low"} confidence historical pattern`
        : "timetable estimate";

  return {
    stop,
    leaveBy,
    expectedArrivalMinutes,
    walkingMinutes,
    confidence,
    summary: `Leave by ${formatTime(leaveBy)}`,
    detail: `Bus #3 at ${stopName}: ${etaText}. ${walkingMinutes} min walk, ${confidenceText}.`,
  };
}
