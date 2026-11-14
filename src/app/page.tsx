"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
  Zap,
  Lock,
  PhoneCall,
  Sparkles,
  MapPin,
  FileCheck2,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { TrustBadge } from "@/components/trust/TrustBadge";
import { TechnicianCard } from "@/components/trust/TechnicianCard";
import { DynamicPriceCalculator } from "@/components/pricing/DynamicPriceCalculator";
import { marketplace } from "@/lib/store/marketplaceStore";

export default function HomePage() {
  const { t, locale } = useLanguage();
  const services = marketplace.getServices();
  const technicians = marketplace.getTechnicians();

  return (
    <div className="flex flex-col gap-16 sm:gap-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 sm:pt-16 lg:pt-20 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-500/10 via-blue-500/5 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Top Verification Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t.brand.heroBadge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {t.hero.title}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {t.hero.subtitle}
            </p>

            {/* Serving Neighborhoods Pill */}
            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 pt-1">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t.hero.servingAreas}</span>
            </div>

            {/* Hero CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/book"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg hover:shadow-emerald-600/20"
              >
                <span>{t.hero.ctaBook}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <a
                href="#pricing-calculator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
              >
                <span>{t.hero.ctaPricing}</span>
              </a>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <TrustBadge type="nadra" label={t.trust.badges.nadra} size="lg" />
              <TrustBadge type="police" label={t.trust.badges.police} size="lg" />
              <TrustBadge type="insured" label={t.trust.badges.insured} size="lg" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 3-STEP SAFETY HANDSHAKE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Zero Physical Security Risk
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold mt-2 tracking-tight">
              How the 4-Digit PIN Handshake Protects Your Home
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              Unlike unvetted classifieds where random workers knock on your door, MustanadFix enforces a tamper-proof 3-step security barrier for your peace of mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 relative z-10">
            {/* Step 1 */}
            <div className="rounded-2xl bg-slate-800/80 border border-slate-700 p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
                  1
                </div>
                <h3 className="font-bold text-base text-white">Advanced Photo & CNIC</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Before arrival, receive the technician&apos;s verified government photo, full name, and CNIC tag. Share directly with your family or building security on WhatsApp.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700 text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                <FileCheck2 className="w-3.5 h-3.5" />
                <span>Biometrically Checked</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl bg-slate-800/80 border border-slate-700 p-6 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg mb-4">
                  2
                </div>
                <h3 className="font-bold text-base text-white">Under 60 Mins Dispatch</h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Our nearest vetted technician is dispatched immediately across Clifton and DHA. Follow live progress from your dashboard without phone tag.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-700 text-xs text-blue-400 flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>Real-Time Uber Timeline</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl bg-emerald-950/60 border border-emerald-700/60 p-6 flex flex-col justify-between ring-2 ring-emerald-500/30">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-extrabold text-lg mb-4">
                  3
                </div>
                <h3 className="font-bold text-base text-white">4-Digit PIN Handshake</h3>
                <p className="text-xs text-slate-200 mt-2 leading-relaxed">
                  You hold a private 4-digit code. The technician cannot initiate repair work or charge you without you verbally confirming this PIN upon arrival.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-emerald-800/80 text-xs text-emerald-300 flex items-center gap-1.5 font-bold">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero Ghost Billing</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC PRICING CALCULATOR SECTION */}
      <section id="pricing-calculator" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Fair & Transparent Marketplace
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
            Dynamic Floor Surcharge Calculator
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            Karachi high-rise apartment or multi-story bungalow? Check your standardized rate before booking. No unexpected negotiations at your gate.
          </p>
        </div>

        <DynamicPriceCalculator services={services} />
      </section>

      {/* 4. VERIFIED TECHNICIANS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Elite Technical Crew
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Karachi&apos;s Highest Rated AC Specialists
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Meet some of our vetted technicians on call today across DHA & Clifton.
            </p>
          </div>

          <Link
            href="/book"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>Book Top Technician</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {technicians.map((tech) => (
            <TechnicianCard
              key={tech.profile.id}
              profile={tech.profile}
              techProfile={tech.techProfile}
            />
          ))}
        </div>
      </section>

      {/* 5. BOTTOM CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-8 sm:p-14 text-center space-y-6 shadow-xl border border-slate-800">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Karachi Heatwave Priority Dispatch</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold max-w-2xl mx-auto tracking-tight">
            AC Stopped Cooling in Peak Afternoon Heat?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Get an expert with genuine gauges, vacuum pumps, and virgin R410A gas at your door within 60 minutes.
          </p>
          <div className="pt-2">
            <Link
              href="/book"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg hover:shadow-emerald-600/30"
            >
              <span>Book Emergency Service Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
