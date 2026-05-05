"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

export default function LiveMapPage() {
  const Map = useMemo(() => dynamic(
    () => import("@/components/LiveMap"),
    { 
      loading: () => (
        <div className="h-[calc(100vh-136px)] w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-container dark:border-blue-400"></div>
        </div>
      ),
      ssr: false 
    }
  ), []);

  return (
    <main className="flex-grow w-full h-full relative">
      <Map />
    </main>
  );
}
