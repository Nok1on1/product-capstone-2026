import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { writeOrQueueReport } from "@/lib/offline-sync";

export type BusDirection = "station" | "city";

interface LocationPayload {
  lat: number;
  lng: number;
  accuracy?: number | null;
  heading?: number | null;
  speed?: number | null;
}

export interface BusStatusReport {
  type: "bus_is_here" | "not_here" | "crowding_report";
  stopId?: number | string | null;
  stopName?: string | null;
  direction?: BusDirection | null;
  level?: "Low" | "Medium" | "High";
  location?: LocationPayload | null;
}

export interface BusTrackingEvent {
  action: "boarded" | "disembarked";
  stopId?: number | string | null;
  stopName?: string | null;
  direction?: BusDirection | null;
  location?: LocationPayload | null;
}

function requireUserId() {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error("You must be signed in to submit live bus updates.");
  }
  return uid;
}

function cleanPayload<T>(payload: T): T {
  if (Array.isArray(payload)) {
    return payload.map(cleanPayload) as T;
  }
  if (payload && typeof payload === "object") {
    return Object.fromEntries(
      Object.entries(payload)
        .filter(([, value]) => value !== undefined)
        .map(([key, value]) => [key, cleanPayload(value)])
    ) as T;
  }
  return payload;
}

export async function reportBusStatus(report: BusStatusReport) {
  const userId = requireUserId();
  const payload = cleanPayload({
    ...report,
    userId,
    source: "web_app",
    clientCreatedAt: new Date().toISOString(),
  });

  return writeOrQueueReport(
    "bus_reports",
    payload as Record<string, unknown>,
    () =>
      addDoc(collection(db, "bus_reports"), {
        ...payload,
        timestamp: serverTimestamp(),
      }),
    { label: "Bus status report write", userId }
  );
}

export async function reportBusTrackingEvent(event: BusTrackingEvent) {
  const userId = requireUserId();
  const payload = cleanPayload({
    ...event,
    userId,
    source: "web_app",
    clientCreatedAt: new Date().toISOString(),
  });

  return writeOrQueueReport(
    "bus_tracking",
    payload as Record<string, unknown>,
    () =>
      addDoc(collection(db, "bus_tracking"), {
        ...payload,
        timestamp: serverTimestamp(),
      }),
    { label: "Bus tracking event write", userId }
  );
}

export async function reportBusIssue(issue: {
  busId: string;
  reason: string;
  userId?: string;
}) {
  const userId = issue.userId || auth.currentUser?.uid || "anonymous";
  const payload = {
    busId: issue.busId,
    reason: issue.reason,
    userId,
    status: "open",
    clientCreatedAt: new Date().toISOString(),
  };

  return writeOrQueueReport(
    "alerts",
    payload,
    () =>
      addDoc(collection(db, "alerts"), {
        ...payload,
        timestamp: new Date(),
      }),
    { label: "Bus issue report write", userId }
  );
}
