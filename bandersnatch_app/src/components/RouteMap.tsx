"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { toStationStops, toCityCentreStops, getBusStopName } from "@/data/route3";
import { STOP_TRAVEL_MINUTES } from "@/lib/timetable";
import { getDictionary, Locale } from "@/i18n/dictionaries";

type Direction = "station" | "city";

export default function RouteMap() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const dict = getDictionary(lang as Locale).routes;
  const [direction, setDirection] = useState<Direction>("station");

  const stops = direction === "station" ? toStationStops : toCityCentreStops;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm transition-colors duration-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-2xl font-bold text-on-surface dark:text-slate-100">{dict.title}</h3>
          <p className="text-sm text-on-surface-variant dark:text-slate-400 flex items-center gap-1 mt-0.5">
            <span className="material-symbols-outlined text-[16px]">route</span>
            {dict.routeMap}
          </p>
        </div>
        <div className="bg-[#16A34A] text-white text-[11px] font-bold px-2.5 py-1 rounded uppercase tracking-wider shadow-sm">
          {dict.active}
        </div>
      </div>

      {/* Direction Tabs */}
      <div className="flex gap-2 mb-5">
        <button
          onClick={() => setDirection("station")}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-95 ${direction === "station"
            ? "bg-blue-600 text-white shadow-sm"
            : "bg-surface-container dark:bg-slate-800 text-on-surface-variant dark:text-slate-400 hover:bg-blue-50 dark:hover:bg-slate-700"
            }`}
        >
          {dict.toStation}
        </button>
        <button
          onClick={() => setDirection("city")}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-95 ${direction === "city"
            ? "bg-amber-600 text-white shadow-sm"
            : "bg-surface-container dark:bg-slate-800 text-on-surface-variant dark:text-slate-400 hover:bg-amber-50 dark:hover:bg-slate-700"
            }`}
        >
          {dict.toCityCentre}
        </button>
      </div>

      {/* Timeline */}
      <div className="relative pl-3">
        {/* Vertical connecting line */}
        <div className="absolute left-[23px] top-6 bottom-8 w-1 bg-blue-600/40 dark:bg-blue-400/40 rounded-full" />

        {stops.map((stop, index) => {
          const isFirst = index === 0;
          const isLast = index === stops.length - 1;

          return (
            <div key={stop.id}>
              <div className="relative flex gap-4 mb-1">
                {/* Stop circle */}
                <div
                  className={`relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 shadow-sm transition-colors duration-200 ${isFirst || isLast
                    ? "bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500"
                    : "bg-surface-container-lowest dark:bg-slate-800 border-blue-600 dark:border-blue-400"
                    }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full transition-colors duration-200 ${isFirst || isLast
                      ? "bg-white"
                      : "bg-surface-container-lowest dark:bg-slate-800 border-2 border-blue-600 dark:border-blue-400"
                      }`}
                  />
                </div>

                {/* Stop info */}
                <div
                  className={`flex-1 pt-2 pb-3 ${!isLast
                    ? "border-b border-outline-variant/30 dark:border-slate-700/30"
                    : ""
                    }`}
                >
                  <h4 className="text-lg font-semibold text-on-surface dark:text-slate-100">
                    {getBusStopName(stop, lang)}
                  </h4>
                  {isFirst && (
                    <p className="text-sm text-on-surface-variant dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[16px]">departure_board</span>
                      {dict.departure}
                    </p>
                  )}
                  {isLast && (
                    <p className="text-sm text-on-surface-variant dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <span className="material-symbols-outlined text-[16px]">flag</span>
                      {dict.terminus}
                    </p>
                  )}
                </div>
              </div>

              {/* Travel time chip between stops */}
              {!isLast && (
                <div className="relative flex gap-4 pl-[40px] py-1.5">
                  <div className="flex items-center gap-1.5 bg-surface-container dark:bg-slate-800 py-1 px-2.5 rounded-lg border border-outline-variant/50 dark:border-slate-700/50 text-on-surface-variant dark:text-slate-400 text-xs font-semibold">
                    <span className="material-symbols-outlined text-[16px]">schedule</span>
                    {STOP_TRAVEL_MINUTES} {dict.mins}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
