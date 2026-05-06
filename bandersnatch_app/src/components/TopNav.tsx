"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { getDictionary, Locale } from "@/i18n/dictionaries";
import { useTheme } from "@/components/ThemeProvider";
import { useEffect, useState } from "react";

export function TopNav({ lang }: { lang: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const dict = getDictionary(lang as Locale);
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mounting
  useEffect(() => setMounted(true), []);

  const navItems = [
    { name: dict.nav.home, href: `/${lang}` },
    { name: dict.nav.map, href: `/${lang}/live-map` },
    { name: dict.nav.schedule, href: `/${lang}/routes` },
  ];

  const toggleLanguage = () => {
    const nextLang = lang === "en" ? "ka" : "en";
    const currentPathWithoutLang = pathname.replace(`/${lang}`, "");
    router.push(`/${nextLang}${currentPathWithoutLang}`);
  };

  return (
    <header className="flex justify-between items-center h-14 px-4 w-full sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-outline-variant dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="flex items-center">

        <Link href={`/${lang}`} className="text-xl font-black text-primary-container dark:text-blue-400 tracking-tighter">
          Bandersnatch
        </Link>
      </div>
      
      {/* Desktop Nav */}
      <div className="hidden md:flex flex-1 justify-center gap-8">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === `/${lang}` && pathname === `/${lang}/`);
          return (
            <Link 
              key={item.name}
              href={item.href} 
              className={`relative font-bold text-sm uppercase tracking-wider pb-1 ${
                isActive ? "text-primary-container dark:text-blue-400" : "text-slate-500 hover:text-primary-container dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
              }`}
            >
              {item.name}
              {isActive && (
                <motion.div
                  layoutId="top-nav-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-container dark:bg-blue-400"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")} 
          className="text-outline dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all p-1.5 rounded-full flex items-center justify-center"
        >
          {mounted ? (
            <span className="material-symbols-outlined">
              {resolvedTheme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          ) : (
            <div className="w-6 h-6" /> 
          )}
        </button>
        <button onClick={toggleLanguage} className="font-bold text-sm text-outline dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 px-2 py-1 rounded-md transition-all">
          {lang === "en" ? "KA" : "EN"}
        </button>
        <Link href={`/${lang}/account`} className={`hover:bg-slate-50 dark:hover:bg-slate-900 active:opacity-80 transition-all duration-200 p-1 rounded-full flex items-center justify-center ${pathname.includes("/account") ? "text-primary-container dark:text-blue-400" : "text-outline dark:text-slate-400"}`}>
          <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: pathname.includes("/account") ? "'FILL' 1" : "'FILL' 0" }}>account_circle</span>
        </Link>
      </div>
    </header>
  );
}
