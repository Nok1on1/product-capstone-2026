"use client";

import { BusStateProvider } from "@/context/BusStateContext";
import { OfflineBanner } from "@/components/OfflineBanner";
import { OfflineStatusProvider } from "@/components/OfflineStatusProvider";
import { ServiceWorkerRegistrar } from "@/components/ServiceWorkerRegistrar";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <OfflineStatusProvider>
      <BusStateProvider>
        <ServiceWorkerRegistrar />
        <OfflineBanner />
        {children}
      </BusStateProvider>
    </OfflineStatusProvider>
  );
}
