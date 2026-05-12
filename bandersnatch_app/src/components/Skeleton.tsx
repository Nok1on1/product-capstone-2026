"use client";

function shimmer() {
  return `relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent`;
}

function Box({ className = "", style = {} }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`${shimmer()} rounded-lg bg-slate-200 dark:bg-slate-700 ${className}`}
      style={style}
    />
  );
}

function Circle({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`${shimmer()} rounded-full bg-slate-200 dark:bg-slate-700 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

function Text({ lines = 1, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`${shimmer()} h-4 rounded bg-slate-200 dark:bg-slate-700`}
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}

function Card() {
  return (
    <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl p-6 relative overflow-hidden shadow-sm">
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-200 dark:bg-slate-700 rounded-t-xl" />
      <div className="space-y-4">
        <Box className="h-7 w-48" />
        <Box className="h-4 w-64" />
        <Box className="h-10 w-full" />
        <Box className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}

function Map() {
  return (
    <div className="h-[calc(100vh-136px)] w-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 transition-colors duration-200">
      <div className="flex flex-col items-center gap-4">
        <Box className="h-24 w-24 rounded-full" />
        <Box className="h-4 w-40" />
        <Box className="h-3 w-28" />
      </div>
    </div>
  );
}

function TripDetails() {
  return (
    <div className="max-w-md mx-auto w-full space-y-4 p-5 pb-32">
      <Box className="h-5 w-32" />
      <div className="bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl p-5 border-t-4 border-t-slate-200 dark:border-t-slate-700">
        <Box className="h-4 w-24 mb-4" />
        <Box className="h-12 w-40 mx-auto mb-2" />
        <Box className="h-4 w-32 mx-auto" />
      </div>
      <Box className="h-16 w-full rounded-xl" />
      <div className="grid grid-cols-2 gap-4">
        <Box className="h-14 rounded-xl" />
        <Box className="h-14 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Box className="h-20 rounded-xl" />
        <Box className="h-20 rounded-xl" />
      </div>
      <div className="bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl p-5">
        <Box className="h-5 w-28 mb-4" />
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <Circle size={16} />
              <Box className="h-4 flex-1" />
              <Box className="h-4 w-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Account() {
  return (
    <div className="w-full max-w-md mx-auto space-y-4 p-5 pb-32 pt-8">
      <div className="bg-white dark:bg-slate-900 border border-outline-variant dark:border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-8">
          <Circle size={64} />
          <div className="space-y-2">
            <Box className="h-6 w-32" />
            <Box className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Box className="h-20 rounded-lg" />
          <Box className="h-20 rounded-lg" />
        </div>
        <Box className="h-10 w-full" />
        <Box className="h-12 w-full mt-4 rounded-lg" />
      </div>
    </div>
  );
}

const Skeleton = { Box, Circle, Text, Card, Map, TripDetails, Account };
export default Skeleton;
