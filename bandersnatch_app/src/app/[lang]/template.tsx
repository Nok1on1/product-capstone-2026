"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useRef, useEffect, useState } from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const prevPathRef = useRef(pathname);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const prev = prevPathRef.current;
    const prevDepth = prev.split("/").length;
    const currDepth = pathname.split("/").length;
    setDirection(currDepth >= prevDepth ? 1 : -1);
    prevPathRef.current = pathname;
  }, [pathname]);

  return (
    <motion.div
      key={pathname}
      custom={direction}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.25 }}
      className="contents"
    >
      {children}
    </motion.div>
  );
}
