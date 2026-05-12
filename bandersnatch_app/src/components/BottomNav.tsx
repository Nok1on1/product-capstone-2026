"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { getDictionary, Locale } from "@/i18n/dictionaries";
import { useAuth } from "@/context/AuthContext";

export function BottomNav({ lang }: { lang: string }) {
  const pathname = usePathname();
  const dict = getDictionary(lang as Locale);
  const { profile } = useAuth();

  const navItems = [
    { name: dict.nav.home, href: `/${lang}`, icon: "home" },
    { name: dict.nav.map, href: `/${lang}/live-map`, icon: "map" },
    { name: dict.nav.schedule, href: `/${lang}/routes`, icon: "calendar_month" },
    { name: dict.nav.feedback, href: `/${lang}/feedback`, icon: "thumbs_up_down" },
  ];

  // Add admin link if user is admin
  if (profile?.role === "admin") {
    navItems.push({ name: "Admin", href: `/${lang}/admin`, icon: "admin_panel_settings" });
  }

  if (pathname.includes("/login") || pathname.includes("/signup")) return null;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-20 px-2 pb-safe bg-white dark:bg-slate-950 border-t border-outline-variant dark:border-slate-800 shadow-[0_-1px_3px_0_rgba(0,0,0,0.05)] md:hidden transition-colors duration-200">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href === `/${lang}` && pathname === `/${lang}/`);
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`relative flex flex-col items-center justify-center rounded-lg px-3 py-2 flex-1 ${
              isActive ? "text-primary-container dark:text-blue-400" : "text-slate-500 dark:text-slate-400 hover:text-primary-container dark:hover:text-blue-400"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="bottom-nav-indicator"
                className="absolute inset-0 bg-blue-50 dark:bg-slate-900 rounded-lg -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <motion.span 
              className="material-symbols-outlined"
              style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              whileTap={{ scale: 0.8 }}
            >
              {item.icon}
            </motion.span>
            <span className="text-[10px] sm:text-[12px] font-semibold uppercase tracking-wider mt-1 truncate w-full text-center">
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
