"use client";

import { BusStateProvider } from "@/context/BusStateContext";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return <BusStateProvider>{children}</BusStateProvider>;
}
