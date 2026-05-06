"use client";

import { useMemo } from "react";
import { getDictionary, Locale } from "@/i18n/dictionaries";
import { usePathname } from "next/navigation";

export function useDictionary() {
  const pathname = usePathname();
  const lang = useMemo(() => {
    const match = pathname.match(/^\/(en|ka)/);
    return (match?.[1] || "en") as Locale;
  }, [pathname]);

  return getDictionary(lang);
}
