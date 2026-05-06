import { BusStop, toStationStops, toCityCentreStops } from "@/data/route3";

export const COLCHIS_FOUNTAIN_CENTER = {
  lat: 42.271544,
  lng: 42.705447,
};

const CENTER_AREA_RADIUS_METERS = 800;

export function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findNearestStop(
  lat: number,
  lng: number,
  stops: BusStop[]
): BusStop {
  let nearest = stops[0];
  let minDist = Infinity;
  for (const stop of stops) {
    const dist = haversineDistance(lat, lng, stop.lat, stop.lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = stop;
    }
  }
  return nearest;
}

export function findNearestStopOnRoute(
  lat: number,
  lng: number
): { stop: BusStop; direction: "station" | "city" } | null {
  const nearestStation = findNearestStop(lat, lng, toStationStops);
  const nearestCity = findNearestStop(lat, lng, toCityCentreStops);

  const distStation = haversineDistance(lat, lng, nearestStation.lat, nearestStation.lng);
  const distCity = haversineDistance(lat, lng, nearestCity.lat, nearestCity.lng);

  if (distStation <= distCity) {
    return { stop: nearestStation, direction: "station" };
  }
  return { stop: nearestCity, direction: "city" };
}

export function pointToSegmentDistance(
  pointLat: number,
  pointLng: number,
  segALat: number,
  segALng: number,
  segBLat: number,
  segBLng: number
): number {
  const dLat = segBLat - segALat;
  const dLng = segBLng - segALng;
  const lengthSq = dLat * dLat + dLng * dLng;

  if (lengthSq === 0) {
    return haversineDistance(pointLat, pointLng, segALat, segALng);
  }

  let t =
    ((pointLat - segALat) * dLat + (pointLng - segALng) * dLng) / lengthSq;
  t = Math.max(0, Math.min(1, t));

  const projLat = segALat + t * dLat;
  const projLng = segALng + t * dLng;

  return haversineDistance(pointLat, pointLng, projLat, projLng);
}

export function isNearRoute(
  lat: number,
  lng: number,
  thresholdMeters = 50
): boolean {
  const allStops = [...toStationStops, ...toCityCentreStops];
  for (let i = 0; i < toStationStops.length - 1; i++) {
    const dist = pointToSegmentDistance(
      lat,
      lng,
      toStationStops[i].lat,
      toStationStops[i].lng,
      toStationStops[i + 1].lat,
      toStationStops[i + 1].lng
    );
    if (dist <= thresholdMeters) return true;
  }
  for (let i = 0; i < toCityCentreStops.length - 1; i++) {
    const dist = pointToSegmentDistance(
      lat,
      lng,
      toCityCentreStops[i].lat,
      toCityCentreStops[i].lng,
      toCityCentreStops[i + 1].lat,
      toCityCentreStops[i + 1].lng
    );
    if (dist <= thresholdMeters) return true;
  }

  for (const stop of allStops) {
    if (haversineDistance(lat, lng, stop.lat, stop.lng) <= thresholdMeters) {
      return true;
    }
  }
  return false;
}

export function isInCenterArea(
  lat: number,
  lng: number,
  radiusMeters = CENTER_AREA_RADIUS_METERS
): boolean {
  return (
    haversineDistance(lat, lng, COLCHIS_FOUNTAIN_CENTER.lat, COLCHIS_FOUNTAIN_CENTER.lng) <=
    radiusMeters
  );
}
