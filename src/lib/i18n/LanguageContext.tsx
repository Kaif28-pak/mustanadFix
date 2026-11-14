"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { translations, Locale } from "./translations";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof translations.en;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("mustanad_locale") as Locale | null;
    if (saved && (saved === "en" || saved === "ur")) {
      setLocaleState(saved);
      document.documentElement.dir = saved === "ur" ? "rtl" : "ltr";
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("mustanad_locale", newLocale);
    document.documentElement.dir = newLocale === "ur" ? "rtl" : "ltr";
    document.documentElement.lang = newLocale;
  };

  const t = translations[locale] || translations.en;
  const isRTL = locale === "ur";

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
