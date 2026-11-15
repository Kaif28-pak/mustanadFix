"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageToggle } from "./LanguageToggle";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";

export function Header() {
  const { t, locale } = useLanguage();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/book", label: t.nav.bookNow, highlight: true },
    { href: "/dashboard", label: t.nav.customerDashboard },
    { href: "/tech-dashboard", label: t.nav.techDashboard },
    { href: "/admin", label: t.nav.adminPortal },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                  Mustanad<span className="text-emerald-600 dark:text-emerald-400">Fix</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Karachi
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium -mt-0.5">
                {locale === "ur" ? "مستند اے سی و ہوم ریپیر" : "NADRA & Police Vetted"}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs lg:text-sm font-medium transition-colors",
                    isActive
                      ? "text-slate-950 dark:text-white font-bold bg-slate-100 dark:bg-slate-800"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50",
                    link.highlight &&
                      "bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white font-semibold dark:bg-emerald-600 dark:hover:bg-emerald-700 shadow-xs ml-1"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Theme + Language + Mobile Hamburger */}
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60",
                  link.highlight &&
                    "bg-emerald-600 text-white hover:bg-emerald-700 font-semibold"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
