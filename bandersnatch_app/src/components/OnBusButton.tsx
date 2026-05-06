"use client";

import { motion } from "framer-motion";
import { useBusState } from "@/context/BusStateContext";
import { useDictionary } from "@/hooks/useDictionary";

export function OnBusButton() {
  const { isOnBus, boardBus, disembark } = useBusState();
  const dict = useDictionary();
  const labels = dict.onBus;

  return (
    <motion.div
      className="fixed bottom-24 right-5 z-50 md:bottom-28"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", bounce: 0.3 }}
    >
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={isOnBus ? disembark : boardBus}
        className={`flex items-center gap-2 px-5 py-3 rounded-full shadow-lg font-semibold text-sm transition-colors ${
          isOnBus
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-primary-container hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-on-primary"
        }`}
      >
        <span className="material-symbols-outlined text-lg">
          {isOnBus ? "directions_bus" : "directions_bus"}
        </span>
        {isOnBus ? labels.offBusButton : labels.onBusButton}
      </motion.button>
    </motion.div>
  );
}
