"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="inline-flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 p-0.5 text-xs">
      <button
        onClick={() => setLocale("en")}
        className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
          locale === "en"
            ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold"
            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale("ur")}
        className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
          locale === "ur"
            ? "bg-emerald-600 text-white shadow-xs font-bold"
            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        }`}
      >
        اردو
      </button>
    </div>
  );
}
