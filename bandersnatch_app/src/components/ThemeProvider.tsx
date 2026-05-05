"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

type Theme = string | undefined;

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: string) => void;
  resolvedTheme: Theme;
  themes: string[];
  systemTheme?: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

export function ThemeProvider({
  children,
  attribute = 'class',
  defaultTheme = 'system',
  enableSystem = true,
  storageKey = 'theme',
  themes = ['light', 'dark'],
}: {
  children: React.ReactNode;
  attribute?: string | string[];
  defaultTheme?: string;
  enableSystem?: boolean;
  storageKey?: string;
  themes?: string[];
}) {
  const [theme, setThemeState] = useState<string | undefined>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    try {
      return localStorage.getItem(storageKey) || defaultTheme;
    } catch (e) {
      return defaultTheme;
    }
  });

  const [resolvedTheme, setResolvedTheme] = useState<string | undefined>(undefined);

  const getSystemTheme = useCallback((e?: MediaQueryList | MediaQueryListEvent) => {
    if (typeof window === 'undefined') return 'light';
    const mql = e || window.matchMedia('(prefers-color-scheme: dark)');
    return mql.matches ? 'dark' : 'light';
  }, []);

  const applyTheme = useCallback((theme: string) => {
    const root = document.documentElement;
    const actualTheme = (theme === 'system' && enableSystem) ? getSystemTheme() : theme;
    
    setResolvedTheme(actualTheme);

    const attributes = Array.isArray(attribute) ? attribute : [attribute];
    attributes.forEach((attr) => {
      if (attr === 'class') {
        root.classList.remove(...themes);
        if (actualTheme) root.classList.add(actualTheme);
      } else {
        if (actualTheme) root.setAttribute(attr, actualTheme);
      }
    });

    if (actualTheme === 'light' || actualTheme === 'dark') {
      root.style.colorScheme = actualTheme;
    }
  }, [attribute, enableSystem, getSystemTheme, themes]);

  useEffect(() => {
    if (theme) {
      applyTheme(theme);
    }
  }, [theme, applyTheme]);

  useEffect(() => {
    if (!enableSystem) return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const newResolved = e.matches ? 'dark' : 'light';
        setResolvedTheme(newResolved);
        
        const root = document.documentElement;
        const attributes = Array.isArray(attribute) ? attribute : [attribute];
        attributes.forEach((attr) => {
          if (attr === 'class') {
            root.classList.remove(...themes);
            root.classList.add(newResolved);
          } else {
            root.setAttribute(attr, newResolved);
          }
        });
        root.style.colorScheme = newResolved;
      }
    };

    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [theme, enableSystem, attribute, themes]);

  const setTheme = useCallback((newTheme: string) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch (e) {}
  }, [storageKey]);

  const value = useMemo(() => ({
    theme,
    setTheme,
    resolvedTheme: theme === 'system' ? resolvedTheme : theme,
    themes: enableSystem ? [...themes, 'system'] : themes,
    systemTheme: getSystemTheme() as 'light' | 'dark'
  }), [theme, setTheme, resolvedTheme, themes, enableSystem, getSystemTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
