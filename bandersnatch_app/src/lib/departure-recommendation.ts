import { BusStop } from "@/data/route3";
import { haversineDistance } from "@/lib/location-utils";
import { getStopsInDirection, getTimetableETAFromNow } from "@/lib/timetable";
import { DelayPattern } from "@/lib/delay-prediction";

type Direction = "station" | "city";
type Locale = "en" | "ka";

interface DepartureRecommendationInput {
  stopId: number;
  direction: Direction;
  userLocation?: { lat: number; lng: number } | null;
  hasLiveData: boolean;
  liveEtaMinutes?: number | null;
  delayPattern?: DelayPattern | null;
  now?: Date;
  locale?: Locale;
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

function formatTime(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ka" ? "ka-GE" : "en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getConfidenceLabel(
  confidence: DepartureRecommendation["confidence"],
  delayPattern: DelayPattern | null | undefined,
  locale: Locale
) {
  if (locale === "ka") {
    if (confidence === "confirmed") return "ლაივ შეტყობინება";
    if (confidence === "historical") {
      const confidenceLabels: Record<string, string> = {
        low: "დაბალი",
        medium: "საშუალო",
        high: "მაღალი",
      };
      const label = confidenceLabels[delayPattern?.confidence ?? "low"] ?? "დაბალი";
      return `${label} სანდოობის ისტორიული ნიმუში`;
    }
    return "განრიგის მიხედვით";
  }

  if (confidence === "confirmed") return "live report";
  if (confidence === "historical") {
    return `${delayPattern?.confidence ?? "low"} confidence historical pattern`;
  }
  return "timetable estimate";
}

export function getDepartureRecommendation({
  stopId,
  direction,
  userLocation,
  hasLiveData,
  liveEtaMinutes,
  delayPattern,
  now = new Date(),
  locale = "en",
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
    typeof stop?.name === "string"
      ? stop.name
      : stop?.name[locale] ?? stop?.name.en ?? (locale === "ka" ? "თქვენი გაჩერება" : "your stop");
  const etaText =
    expectedArrivalMinutes == null
      ? locale === "ka" ? "განრიგი მიუწვდომელია" : "schedule unavailable"
      : locale === "ka"
        ? `ავტობუსი მოსალოდნელია ${expectedArrivalMinutes} წთ-ში`
        : `bus expected in ${expectedArrivalMinutes} min`;
  const confidenceText = getConfidenceLabel(confidence, delayPattern, locale);
  const formattedLeaveBy = formatTime(leaveBy, locale);

  return {
    stop,
    leaveBy,
    expectedArrivalMinutes,
    walkingMinutes,
    confidence,
    summary: locale === "ka" ? `გადით ${formattedLeaveBy}-მდე` : `Leave by ${formattedLeaveBy}`,
    detail: locale === "ka"
      ? `ავტობუსი #3 გაჩერებაზე ${stopName}: ${etaText}. ${walkingMinutes} წთ ფეხით, ${confidenceText}.`
      : `Bus #3 at ${stopName}: ${etaText}. ${walkingMinutes} min walk, ${confidenceText}.`,
  };
}
