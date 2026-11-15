"use client";

import React, { createContext, useContext, useEffect, useSyncExternalStore } from "react";
import { translations, Locale } from "./translations";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: typeof translations.en;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function subscribeLocale(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("mustanad_locale_change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("mustanad_locale_change", callback);
  };
}

function getLocaleSnapshot(): Locale {
  if (typeof window === "undefined") return "en";
  const saved = localStorage.getItem("mustanad_locale");
  return saved === "ur" ? "ur" : "en";
}

function getServerLocaleSnapshot(): Locale {
  return "en";
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(
    subscribeLocale,
    getLocaleSnapshot,
    getServerLocaleSnapshot
  );

  useEffect(() => {
    document.documentElement.dir = locale === "ur" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("mustanad_locale", newLocale);
      window.dispatchEvent(new Event("mustanad_locale_change"));
    }
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
