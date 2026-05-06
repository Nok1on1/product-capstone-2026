"use client";

import { motion } from "framer-motion";

interface OnBusButtonProps {
  isOnBus: boolean;
  onBoard: () => void;
  onDisembark: () => void;
  onBusLabel: string;
  offBusLabel: string;
}

export function OnBusButton({
  isOnBus,
  onBoard,
  onDisembark,
  onBusLabel,
  offBusLabel,
}: OnBusButtonProps) {
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
        onClick={isOnBus ? onDisembark : onBoard}
        className={`flex items-center gap-2 px-5 py-3 rounded-full shadow-lg font-semibold text-sm transition-colors ${
          isOnBus
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "bg-primary-container hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-on-primary"
        }`}
      >
        <span className="material-symbols-outlined text-lg">
          {isOnBus ? "directions_bus" : "directions_bus"}
        </span>
        {isOnBus ? offBusLabel : onBusLabel}
      </motion.button>
    </motion.div>
  );
}
