import { getStopsInDirection, STOP_TRAVEL_MINUTES } from "@/lib/timetable";

type Direction = "station" | "city";

export interface DelayReportLike {
  type?: string;
  stopId?: number | string | null;
  direction?: Direction | null;
  timestamp?: { toDate?: () => Date } | Date | null;
  clientCreatedAt?: string | null;
  delayMinutes?: number | null;
}

export interface DelayPattern {
  averageDelayMinutes: number;
  sampleCount: number;
  confidence: "high" | "medium" | "low";
  dayOfWeek: number;
  hourBucket: number;
}

function getReportDate(report: DelayReportLike) {
  if (report.timestamp instanceof Date) return report.timestamp;
  if (report.timestamp?.toDate) return report.timestamp.toDate();
  if (report.clientCreatedAt) return new Date(report.clientCreatedAt);
  return null;
}

function confidenceFor(count: number): DelayPattern["confidence"] {
  if (count > 30) return "high";
  if (count >= 10) return "medium";
  return "low";
}

function expectedArrivalDelayMinutes(
  reportDate: Date,
  stopId: number,
  direction: Direction
) {
  const stops = getStopsInDirection(direction);
  const stopIndex = stops.findIndex((stop) => stop.id === stopId);
  if (stopIndex < 0) return null;

  const currentMinute = reportDate.getHours() * 60 + reportDate.getMinutes();
  const routeOffset = stopIndex * STOP_TRAVEL_MINUTES;
  const firstArrival = 7 * 60 + 30 + routeOffset;
  const lastArrival = 22 * 60 + routeOffset;
  if (currentMinute < firstArrival - 20 || currentMinute > lastArrival + 45) {
    return null;
  }

  const intervals = Math.round((currentMinute - firstArrival) / 30);
  const expectedMinute = firstArrival + intervals * 30;
  return Math.max(-10, Math.min(45, currentMinute - expectedMinute));
}

export function getDelayPatternForNow(
  reports: DelayReportLike[],
  direction: Direction,
  stopId: number,
  now = new Date()
): DelayPattern | null {
  const dayOfWeek = now.getDay();
  const hourBucket = Math.floor(now.getHours() / 2) * 2;
  const delays: number[] = [];

  for (const report of reports) {
    if (report.direction && report.direction !== direction) continue;
    if (report.stopId != null && Number(report.stopId) !== stopId) continue;

    const reportDate = getReportDate(report);
    if (!reportDate || reportDate.getDay() !== dayOfWeek) continue;
    if (Math.floor(reportDate.getHours() / 2) * 2 !== hourBucket) continue;

    const delay =
      typeof report.delayMinutes === "number"
        ? report.delayMinutes
        : report.type === "bus_is_here"
          ? expectedArrivalDelayMinutes(reportDate, stopId, direction)
          : null;

    if (delay != null && Number.isFinite(delay)) {
      delays.push(delay);
    }
  }

  if (!delays.length) return null;

  const averageDelayMinutes = Math.round(
    delays.reduce((sum, delay) => sum + delay, 0) / delays.length
  );

  return {
    averageDelayMinutes,
    sampleCount: delays.length,
    confidence: confidenceFor(delays.length),
    dayOfWeek,
    hourBucket,
  };
}

export function formatDelayPattern(pattern: DelayPattern | null) {
  if (!pattern) return "No historical delay pattern yet.";
  const absDelay = Math.abs(pattern.averageDelayMinutes);
  const timing =
    pattern.averageDelayMinutes > 1
      ? `~${absDelay} min late`
      : pattern.averageDelayMinutes < -1
        ? `~${absDelay} min early`
        : "close to schedule";

  return `Typically ${timing} around this time (${pattern.sampleCount} reports, ${pattern.confidence} confidence).`;
}
