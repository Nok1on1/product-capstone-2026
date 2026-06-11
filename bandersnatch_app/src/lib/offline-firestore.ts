"use client";

import { putSnapshot, getSnapshot, SnapshotKey } from "@/lib/offline-db";

export interface CachedResult<T> {
  data: T;
  isStale: boolean;
  updatedAt: number | null;
}

export async function cachedFirestoreRead<T>(
  key: SnapshotKey,
  readNetwork: () => Promise<T>,
  fallback: T
): Promise<CachedResult<T>> {
  const online = typeof navigator === "undefined" ? true : navigator.onLine;

  if (online) {
    try {
      const data = await readNetwork();
      await putSnapshot(key, data);
      return { data, isStale: false, updatedAt: Date.now() };
    } catch (error) {
      console.warn(`Network read failed for ${key}; trying offline snapshot.`, error);
    }
  }

  const cached = await getSnapshot<T>(key);
  if (cached) {
    return {
      data: cached.value,
      isStale: true,
      updatedAt: cached.updatedAt,
    };
  }

  return { data: fallback, isStale: true, updatedAt: null };
}

export function snapshotAgeMs(updatedAt: number | null) {
  if (!updatedAt) return null;
  return Math.max(0, Date.now() - updatedAt);
}
