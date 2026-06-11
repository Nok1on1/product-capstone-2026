"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getAllSnapshots, getQueuedReports } from "@/lib/offline-db";
import { seedScheduleSnapshot } from "@/lib/offline-schedule";
import { startOfflineSyncListeners } from "@/lib/offline-sync";

interface OfflineStatusValue {
  isOnline: boolean;
  latestSnapshotAt: number | null;
  queuedReportCount: number;
}

const OfflineStatusContext = createContext<OfflineStatusValue>({
  isOnline: true,
  latestSnapshotAt: null,
  queuedReportCount: 0,
});

export function OfflineStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOnline, setIsOnline] = useState(true);
  const [latestSnapshotAt, setLatestSnapshotAt] = useState<number | null>(null);
  const [queuedReportCount, setQueuedReportCount] = useState(0);

  useEffect(() => {
    const refresh = async () => {
      setIsOnline(navigator.onLine);
      const [snapshots, queuedReports] = await Promise.all([
        getAllSnapshots(),
        getQueuedReports(),
      ]);
      setLatestSnapshotAt(
        snapshots.reduce<number | null>(
          (latest, snapshot) =>
            latest === null
              ? snapshot.updatedAt
              : Math.max(latest, snapshot.updatedAt),
          null
        )
      );
      setQueuedReportCount(queuedReports.length);
    };

    const markOnline = () => {
      setIsOnline(true);
      void refresh();
    };
    const markOffline = () => {
      setIsOnline(false);
      void refresh();
    };

    void seedScheduleSnapshot().then(refresh);
    const stopSyncListeners = startOfflineSyncListeners();

    window.addEventListener("online", markOnline);
    window.addEventListener("offline", markOffline);
    window.addEventListener("bandersnatch-offline-state-change", refresh);

    return () => {
      stopSyncListeners();
      window.removeEventListener("online", markOnline);
      window.removeEventListener("offline", markOffline);
      window.removeEventListener("bandersnatch-offline-state-change", refresh);
    };
  }, []);

  const value = useMemo(
    () => ({ isOnline, latestSnapshotAt, queuedReportCount }),
    [isOnline, latestSnapshotAt, queuedReportCount]
  );

  return (
    <OfflineStatusContext.Provider value={value}>
      {children}
    </OfflineStatusContext.Provider>
  );
}

export function useOfflineStatus() {
  return useContext(OfflineStatusContext);
}
