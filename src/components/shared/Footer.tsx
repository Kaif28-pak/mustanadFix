"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, Phone, Mail, MapPin, Heart, Shield } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Guarantee */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                Mustanad<span className="text-emerald-600">Fix</span>
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 text-xs text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
              <Shield className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{t.hero.guarantee}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <li>
                <Link href="/" className="hover:text-emerald-600 transition-colors">
                  {t.nav.home}
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-emerald-600 transition-colors">
                  {t.nav.bookNow}
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-600 transition-colors">
                  {t.nav.customerDashboard}
                </Link>
              </li>
              <li>
                <Link href="/tech-dashboard" className="hover:text-emerald-600 transition-colors">
                  {t.nav.techDashboard}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-600 transition-colors">
                  {t.nav.adminPortal}
                </Link>
              </li>
            </ul>
          </div>

          {/* Karachi Neighborhoods */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Active Karachi Zones
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
              <li>• Clifton (Blocks 1 to 9)</li>
              <li>• DHA Phase 1 - Phase 8</li>
              <li>• PECHS & Sindhi Muslim</li>
              <li>• Bahadurabad & Dhoraji</li>
              <li>• Gulshan-e-Iqbal (Main)</li>
              <li>• KDA Scheme 1 & Tipu Sultan</li>
            </ul>
          </div>

          {/* Emergency & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Karachi Operations Desk
            </h4>
            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Khayaban-e-Shahbaz, DHA Phase 6, Karachi</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-mono font-medium">+92 21 3589 0011 (Hotline)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>care@mustanadfix.pk</span>
              </p>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              {t.bookingWizard.emergencyNotice}
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 MustanadFix Pakistan. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built for safety in Karachi with</span>
            <Heart className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" />
          </div>
        </div>
      </div>
    </footer>
  );
}
