"use client";

import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useParams } from "next/navigation";
import {
  toStationStops,
  toCityCentreStops,
  getBusStopName,
  BusStop,
} from "@/data/route3";
import { getDictionary, Locale } from "@/i18n/dictionaries";

interface StopSelectProps {
  value: string;
  onChange: (value: string) => void;
}

interface SelectStop {
  id: string;
  originalId: number;
  name: string;
  route: "station" | "city";
}

export function StopSelect({ value, onChange }: StopSelectProps) {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const routeDict = getDictionary(lang as Locale).routes;
  const routeLabels = {
    station: routeDict.toStation,
    city: routeDict.toCityCentre,
  };

  const stops: SelectStop[] = (() => {
    const stationStops: SelectStop[] = toStationStops.map((stop: BusStop) => ({
      id: `station-${stop.id}`,
      originalId: stop.id,
      name: getBusStopName(stop, lang),
      route: "station" as const,
    }));

    const cityStops: SelectStop[] = toCityCentreStops.map((stop: BusStop) => ({
      id: `city-${stop.id}`,
      originalId: stop.id,
      name: getBusStopName(stop, lang),
      route: "city" as const,
    }));

    return [...stationStops, ...cityStops];
  })();

  const selectedStop = stops.find((s) => s.id === value) || stops[0];

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-surface-container-lowest py-3 pl-10 pr-10 text-left border border-outline-variant text-on-surface shadow-sm transition-colors hover:border-primary-container/60 hover:bg-white focus:outline-none focus-visible:border-primary-container focus-visible:ring-2 focus-visible:ring-primary-container/30 dark:hover:bg-slate-800">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="material-symbols-outlined text-outline">
              location_on
            </span>
          </span>
          <span className="block truncate font-medium">
            {selectedStop?.name || "Select a stop"}
          </span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="material-symbols-outlined text-outline">
              expand_more
            </span>
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-[-10px] scale-95"
          enterTo="opacity-100 translate-y-0 scale-100"
        >
          <Listbox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-slate-900 py-2 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50 transition-colors duration-200">
            {stops.map((stop) => (
              <Listbox.Option
                key={stop.id}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${
                    active
                      ? "bg-blue-50 dark:bg-slate-800 text-primary-container dark:text-blue-400"
                      : "text-on-surface"
                  }`
                }
                value={stop.id}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`flex min-w-0 items-center gap-2 ${
                        selected ? "font-bold" : "font-medium"
                      }`}
                    >
                      <span className="truncate">{stop.name}</span>
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                          stop.route === "station"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                        }`}
                      >
                        {routeLabels[stop.route]}
                      </span>
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-container">
                        <span className="material-symbols-outlined text-sm">
                          check
                        </span>
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
