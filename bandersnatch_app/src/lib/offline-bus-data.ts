"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit as firestoreLimit,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cachedFirestoreRead } from "@/lib/offline-firestore";
import { DelayReportLike } from "@/lib/delay-prediction";

export interface BusRecord {
  id: string;
  name?: string;
  isActive?: boolean;
  status?: string;
  lastUpdated?: unknown;
}

export interface AlertRecord {
  id: string;
  busId?: string;
  reason?: string;
  status?: string;
  timestamp?: unknown;
  userId?: string;
}

export interface BusStatusSnapshot {
  exists: boolean;
  crowding?: "Low" | "Medium" | "High";
}

export async function readBusStatus() {
  return cachedFirestoreRead<BusStatusSnapshot>(
    "busStatus",
    async () => {
      const docSnap = await getDoc(doc(db, "bus_data", "current_status"));
      return docSnap.exists()
        ? { exists: true, ...docSnap.data() }
        : { exists: false };
    },
    { exists: false }
  );
}

export async function readBuses() {
  return cachedFirestoreRead<BusRecord[]>(
    "buses",
    async () => {
      const snapshot = await getDocs(collection(db, "buses"));
      return snapshot.docs.map((busDoc) => ({
        id: busDoc.id,
        ...busDoc.data(),
      }));
    },
    []
  );
}

export async function readAlerts() {
  return cachedFirestoreRead<AlertRecord[]>(
    "alerts",
    async () => {
      const snapshot = await getDocs(collection(db, "alerts"));
      return snapshot.docs.map((alertDoc) => ({
        id: alertDoc.id,
        ...alertDoc.data(),
      }));
    },
    []
  );
}

export async function readRecentBusReports(maxReports = 250) {
  return cachedFirestoreRead<DelayReportLike[]>(
    "recentBusReports",
    async () => {
      const reportsQuery = query(
        collection(db, "bus_reports"),
        orderBy("timestamp", "desc"),
        firestoreLimit(maxReports)
      );
      const snapshot = await getDocs(reportsQuery);
      return snapshot.docs.map((reportDoc) => reportDoc.data() as DelayReportLike);
    },
    []
  );
}
