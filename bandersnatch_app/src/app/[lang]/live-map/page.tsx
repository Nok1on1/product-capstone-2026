"use client";

import dynamic from "next/dynamic";
import Skeleton from "@/components/Skeleton";

const LiveMap = dynamic(
  () => import("@/components/LiveMap"),
  {
    loading: () => <Skeleton.Map />,
    ssr: false,
  },
);

export default function LiveMapPage() {
  return (
    <main className="flex-grow w-full h-full relative">
      <LiveMap />
    </main>
  );
}
