"use client";

import {
  addDoc,
  collection,
  doc,
  increment,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import {
  deleteQueuedReport,
  enqueueReport,
  getQueuedReports,
  QueuedReport,
  QueuedReportTarget,
  setSyncMeta,
  updateQueuedReport,
} from "@/lib/offline-db";
import { withFirebaseRetry } from "@/lib/firebase-retry";

export type TrustMetricPayload = {
  userId: string;
  trustScoreDelta?: number;
  reportCountDelta?: number;
};

function canUseNetwork() {
  return typeof navigator === "undefined" || navigator.onLine;
}

function normalizeError(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

export async function queueReport(
  target: QueuedReportTarget,
  payload: Record<string, unknown>,
  userId: string
) {
  return enqueueReport({
    target,
    payload,
    userId,
    clientCreatedAt: new Date().toISOString(),
  });
}

export async function registerReportSync() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    const syncRegistration = registration as ServiceWorkerRegistration & {
      sync?: { register: (tag: string) => Promise<void> };
    };
    await syncRegistration.sync?.register("bandersnatch-report-sync");
  } catch {
    // Background Sync is optional; foreground sync covers unsupported browsers.
  }
}

async function persistQueuedReport(report: QueuedReport) {
  if (report.target === "trust_metric") {
    const payload = report.payload as TrustMetricPayload;
    const updatePayload: Record<string, unknown> = {};
    if (payload.trustScoreDelta !== undefined) {
      updatePayload.trustScore = increment(payload.trustScoreDelta);
    }
    if (payload.reportCountDelta !== undefined) {
      updatePayload.totalReportsMade = increment(payload.reportCountDelta);
    }
    if (Object.keys(updatePayload).length > 0) {
      await updateDoc(doc(db, "users", payload.userId), updatePayload);
    }
    return;
  }

  await addDoc(collection(db, report.target), {
    ...report.payload,
    timestamp: serverTimestamp(),
    queuedAt: report.clientCreatedAt,
    syncedAt: serverTimestamp(),
  });
}

export async function syncQueuedReports() {
  if (!canUseNetwork()) return { synced: 0, remaining: 0 };

  const reports = await getQueuedReports();
  let synced = 0;

  for (const report of reports) {
    try {
      await withFirebaseRetry(() => persistQueuedReport(report), {
        label: `Queued ${report.target} sync`,
      });
      await deleteQueuedReport(report.id);
      synced += 1;
    } catch (error) {
      await updateQueuedReport({
        ...report,
        retryCount: report.retryCount + 1,
        lastError: normalizeError(error),
      });
    }
  }

  const remaining = (await getQueuedReports()).length;
  await setSyncMeta("lastReportSync", { synced, remaining });
  return { synced, remaining };
}

export async function writeOrQueueReport<T>(
  target: QueuedReportTarget,
  payload: Record<string, unknown>,
  writeNetwork: () => Promise<T>,
  options: { label: string; userId?: string } 
) {
  const userId = options.userId ?? auth.currentUser?.uid ?? "anonymous";

  if (!canUseNetwork()) {
    await queueReport(target, payload, userId);
    await registerReportSync();
    return { status: "queued" as const, result: null };
  }

  try {
    const result = await withFirebaseRetry(writeNetwork, { label: options.label });
    return { status: "sent" as const, result };
  } catch (error) {
    await queueReport(target, payload, userId);
    await registerReportSync();
    console.warn(`${options.label} queued after write failure.`, error);
    return { status: "queued" as const, result: null };
  }
}

export function startOfflineSyncListeners() {
  if (typeof window === "undefined") return () => {};

  const sync = () => {
    void syncQueuedReports();
  };

  window.addEventListener("online", sync);
  window.addEventListener("bandersnatch-sync-reports", sync);
  window.setTimeout(sync, 500);

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "SYNC_REPORTS") sync();
    });
  }

  return () => {
    window.removeEventListener("online", sync);
    window.removeEventListener("bandersnatch-sync-reports", sync);
  };
}
