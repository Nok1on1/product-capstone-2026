import { toStationStops, toCityCentreStops, BusStop } from "@/data/route3";

export const STOP_TRAVEL_MINUTES = 7;

export const BUS_OPERATING_HOURS = {
  start: "07:30",
  end: "22:00",
  frequencyMin: 30,
};

export function getStopsInDirection(
  direction: "station" | "city"
): BusStop[] {
  return direction === "station" ? toStationStops : toCityCentreStops;
}

export function getETAtoDestination(
  currentStopId: number,
  destinationId: number,
  direction: "station" | "city"
): number | null {
  const stops = getStopsInDirection(direction);
  const currentIdx = stops.findIndex((s) => s.id === currentStopId);
  const destIdx = stops.findIndex((s) => s.id === destinationId);
  if (currentIdx < 0 || destIdx < 0 || destIdx <= currentIdx) return null;
  return (destIdx - currentIdx) * STOP_TRAVEL_MINUTES;
}

export function getNext3Stops(
  currentStopId: number,
  direction: "station" | "city"
): { stop: BusStop; etaMinutes: number }[] {
  const stops = getStopsInDirection(direction);
  const currentIdx = stops.findIndex((s) => s.id === currentStopId);
  if (currentIdx < 0) return [];
  const remaining = stops.slice(currentIdx + 1, currentIdx + 4);
  return remaining.map((stop, i) => ({
    stop,
    etaMinutes: (i + 1) * STOP_TRAVEL_MINUTES,
  }));
}

export function getNextScheduledBus(
  _direction: "station" | "city"
): { minutes: number; departureTime: Date } {
  const now = new Date();
  const [startH, startM] = BUS_OPERATING_HOURS.start.split(":").map(Number);
  const [endH, endM] = BUS_OPERATING_HOURS.end.split(":").map(Number);

  const startMin = startH * 60 + startM;
  const endMin = endH * 60 + endM;
  const currentMin = now.getHours() * 60 + now.getMinutes();

  if (currentMin >= endMin) {
    const tomorrowDeparture = new Date(now);
    tomorrowDeparture.setDate(tomorrowDeparture.getDate() + 1);
    tomorrowDeparture.setHours(startH, startM, 0, 0);
    return {
      minutes: Math.round(
        (tomorrowDeparture.getTime() - now.getTime()) / 60000
      ),
      departureTime: tomorrowDeparture,
    };
  }

  let nextDepartureMin = startMin;
  while (nextDepartureMin <= currentMin) {
    nextDepartureMin += BUS_OPERATING_HOURS.frequencyMin;
  }

  if (nextDepartureMin > endMin) {
    const tomorrowDeparture = new Date(now);
    tomorrowDeparture.setDate(tomorrowDeparture.getDate() + 1);
    tomorrowDeparture.setHours(startH, startM, 0, 0);
    return {
      minutes: Math.round(
        (tomorrowDeparture.getTime() - now.getTime()) / 60000
      ),
      departureTime: tomorrowDeparture,
    };
  }

  const depHour = Math.floor(nextDepartureMin / 60);
  const depMin = nextDepartureMin % 60;
  const departureTime = new Date(now);
  departureTime.setHours(depHour, depMin, 0, 0);

  return {
    minutes: nextDepartureMin - currentMin,
    departureTime,
  };
}

export function getTimetableETAFromNow(
  currentStopId: number,
  direction: "station" | "city"
): number | null {
  const stops = getStopsInDirection(direction);
  const currentIdx = stops.findIndex((s) => s.id === currentStopId);
  if (currentIdx < 0) return null;

  const { minutes: busETA } = getNextScheduledBus(direction);
  const timeToStop = currentIdx * STOP_TRAVEL_MINUTES;
  return busETA + timeToStop;
}

export function getNextStopFromCurrent(
  currentStopId: number,
  direction: "station" | "city"
): BusStop | null {
  const stops = getStopsInDirection(direction);
  const currentIdx = stops.findIndex((s) => s.id === currentStopId);
  if (currentIdx < 0 || currentIdx >= stops.length - 1) return null;
  return stops[currentIdx + 1];
}
