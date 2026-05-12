"use client";

import { motion } from "framer-motion";

interface AnimatedIconProps {
  icon: string;
  isActive: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function AnimatedIcon({ icon, isActive, className = "" }: AnimatedIconProps) {
  return (
    <span
      className={`material-symbols-outlined relative inline-flex items-center justify-center ${className}`}
    >
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: isActive ? 1 : 0 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
        aria-hidden
      >
        {icon}
      </motion.span>
      <motion.span
        className="absolute inset-0 flex items-center justify-center"
        animate={{ opacity: isActive ? 0 : 1 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        style={{ fontVariationSettings: "'FILL' 0, 'wght' 400" }}
        aria-hidden
      >
        {icon}
      </motion.span>
      <span className="opacity-0 pointer-events-none">{icon}</span>
    </span>
  );
}
