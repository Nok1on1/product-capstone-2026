"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const [direction, setDirection] = useState(1);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const prev = prevPathRef.current;
    const prevDepth = prev.split("/").length;
    const currDepth = pathname.split("/").length;
    setDirection(currDepth >= prevDepth ? 1 : -1);
    prevPathRef.current = pathname;
  }, [pathname]);

  const variants = {
    initial: (dir: number) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir * 18,
      scale: shouldReduceMotion ? 1 : 0.995,
    }),
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: number) => ({
      opacity: 0,
      x: shouldReduceMotion ? 0 : dir * -18,
      scale: shouldReduceMotion ? 1 : 0.995,
    }),
  };

  return (
    <motion.div
      key={pathname}
      custom={direction}
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ ease: [0.32, 0.72, 0, 1], duration: shouldReduceMotion ? 0 : 0.22 }}
      className="flex flex-1 flex-col"
    >
      {children}
    </motion.div>
  );
}
