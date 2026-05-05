"use client";

import { Listbox, Transition } from "@headlessui/react";
import { Fragment } from "react";

const stops = [
  { id: "kiu", name: "KIU Main Gate" },
  { id: "kutaisi", name: "Kutaisi Central" },
  { id: "terjola", name: "Terjola" },
  { id: "samtredia", name: "Samtredia" },
  { id: "khoni", name: "Khoni" },
];

interface StopSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function StopSelect({ value, onChange }: StopSelectProps) {
  const selectedStop = stops.find((s) => s.id === value) || stops[0];

  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-surface-container-lowest py-3 pl-10 pr-10 text-left border border-outline-variant focus:outline-none focus-visible:border-primary-container focus-visible:ring-2 focus-visible:ring-primary-container text-on-surface">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className="material-symbols-outlined text-outline">location_on</span>
          </span>
          <span className="block truncate font-medium">{selectedStop.name}</span>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className="material-symbols-outlined text-outline">expand_more</span>
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
          <Listbox.Options className="absolute mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white dark:bg-slate-900 py-2 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50 transition-colors duration-200">
            {stops.map((stop) => (
              <Listbox.Option
                key={stop.id}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-3 pl-10 pr-4 transition-colors ${
                    active ? "bg-blue-50 dark:bg-slate-800 text-primary-container dark:text-blue-400" : "text-on-surface"
                  }`
                }
                value={stop.id}
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? "font-bold" : "font-medium"}`}>
                      {stop.name}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-container">
                        <span className="material-symbols-outlined text-sm">check</span>
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
