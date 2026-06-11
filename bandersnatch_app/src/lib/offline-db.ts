"use client";

export type SnapshotKey =
  | "busStatus"
  | "buses"
  | "alerts"
  | "recentBusReports"
  | "schedule";

export interface OfflineSnapshot<T = unknown> {
  key: SnapshotKey;
  value: T;
  updatedAt: number;
}

export type QueuedReportTarget =
  | "bus_reports"
  | "bus_tracking"
  | "alerts"
  | "trust_metric";

export interface QueuedReport {
  id: string;
  target: QueuedReportTarget;
  payload: Record<string, unknown>;
  userId: string;
  clientCreatedAt: string;
  retryCount: number;
  lastError?: string;
}

interface OfflineDbSchema {
  snapshots: OfflineSnapshot;
  reportQueue: QueuedReport;
  syncMeta: { key: string; value: unknown; updatedAt: number };
  settings: { key: string; value: unknown; updatedAt: number };
}

const DB_NAME = "bandersnatch-offline";
const DB_VERSION = 1;

function assertBrowser() {
  return typeof window !== "undefined" && "indexedDB" in window;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openOfflineDb() {
  if (!assertBrowser()) {
    return Promise.reject(new Error("IndexedDB is not available."));
  }

  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains("snapshots")) {
          db.createObjectStore("snapshots", { keyPath: "key" });
        }
        if (!db.objectStoreNames.contains("reportQueue")) {
          db.createObjectStore("reportQueue", { keyPath: "id" });
        }
        if (!db.objectStoreNames.contains("syncMeta")) {
          db.createObjectStore("syncMeta", { keyPath: "key" });
        }
        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "key" });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  return dbPromise;
}

async function withStore<K extends keyof OfflineDbSchema, T>(
  storeName: K,
  mode: IDBTransactionMode,
  callback: (store: IDBObjectStore) => IDBRequest<T> | void
) {
  const db = await openOfflineDb();

  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(String(storeName), mode);
    const store = tx.objectStore(String(storeName));
    const request = callback(store);
    let result = undefined as T;

    if (request) {
      request.onsuccess = () => {
        result = request.result;
      };
      request.onerror = () => reject(request.error);
    }

    tx.oncomplete = () => resolve(result);
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

export async function putSnapshot<T>(key: SnapshotKey, value: T) {
  if (!assertBrowser()) return;
  await withStore("snapshots", "readwrite", (store) =>
    store.put({ key, value, updatedAt: Date.now() })
  );
  window.dispatchEvent(new CustomEvent("bandersnatch-offline-state-change"));
}

export async function getSnapshot<T>(key: SnapshotKey) {
  if (!assertBrowser()) return null;
  const snapshot = await withStore<"snapshots", OfflineSnapshot<T> | undefined>(
    "snapshots",
    "readonly",
    (store) => store.get(key)
  );
  return snapshot ?? null;
}

export async function getAllSnapshots() {
  if (!assertBrowser()) return [];
  return withStore<"snapshots", OfflineSnapshot[]>(
    "snapshots",
    "readonly",
    (store) => store.getAll()
  );
}

export async function enqueueReport(
  report: Omit<QueuedReport, "id" | "retryCount">
) {
  if (!assertBrowser()) throw new Error("Cannot queue report outside browser.");

  const queued: QueuedReport = {
    ...report,
    id: `${Date.now()}-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`,
    retryCount: 0,
  };

  await withStore("reportQueue", "readwrite", (store) => store.put(queued));
  window.dispatchEvent(new CustomEvent("bandersnatch-offline-state-change"));
  return queued;
}

export async function getQueuedReports() {
  if (!assertBrowser()) return [];
  return withStore<"reportQueue", QueuedReport[]>(
    "reportQueue",
    "readonly",
    (store) => store.getAll()
  );
}

export async function deleteQueuedReport(id: string) {
  if (!assertBrowser()) return;
  await withStore("reportQueue", "readwrite", (store) => store.delete(id));
  window.dispatchEvent(new CustomEvent("bandersnatch-offline-state-change"));
}

export async function updateQueuedReport(report: QueuedReport) {
  if (!assertBrowser()) return;
  await withStore("reportQueue", "readwrite", (store) => store.put(report));
  window.dispatchEvent(new CustomEvent("bandersnatch-offline-state-change"));
}

export async function setSyncMeta(key: string, value: unknown) {
  if (!assertBrowser()) return;
  await withStore("syncMeta", "readwrite", (store) =>
    store.put({ key, value, updatedAt: Date.now() })
  );
  window.dispatchEvent(new CustomEvent("bandersnatch-offline-state-change"));
}
