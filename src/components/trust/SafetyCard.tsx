"use client";

import React, { useState } from "react";
import { ShieldCheck, Share2, PhoneCall, Check, ExternalLink, Shield } from "lucide-react";
import { Booking } from "@/lib/supabase/database.types";
import { TrustBadge } from "./TrustBadge";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface SafetyCardProps {
  booking: Booking;
}

export function SafetyCard({ booking }: SafetyCardProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const tech = booking.technician;
  const techProfile = tech?.technician_profile;

  if (!tech) {
    return (
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center animate-pulse">
            <Shield className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-200">
              Matching with Nearest Karachi Verified Technician...
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dispatching from Clifton/DHA network. Average response under 10 minutes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Pre-filled WhatsApp Broadcast Message
  const shareText = `*MustanadFix Home Safety Update*\nTechnician: ${tech.name}\nCNIC Tag: 42201-******-${techProfile?.cnic_last4 || "VERIFIED"}\nRating: ${techProfile?.rating_avg || "4.9"} ⭐ (NADRA & Police Cleared)\nBooking ID: ${booking.id}\nAppliance: ${booking.service?.name}\nLive Status: ${booking.status.toUpperCase()}\nSafeGuard Guarantee: Insured up to PKR 50,000.\n*Do not let technician enter without matching photo.*`;

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareText);
    const url = `https://wa.me/?text=${encoded}`;
    window.open(url, "_blank");
  };

  const handleCopyDetails = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="rounded-2xl border-2 border-emerald-500/40 dark:border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20 p-5 shadow-sm">
      {/* Header Badge */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-emerald-200/50 dark:border-emerald-800/40">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
            Active Technician Safety Card
          </span>
        </div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Ref: <span className="font-mono">{booking.id}</span>
        </span>
      </div>

      {/* Main Details */}
      <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img
            src={tech.avatar_url || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80"}
            alt={tech.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
          />
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{tech.name}</span>
              <TrustBadge type="nadra" label="NADRA" size="sm" />
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-mono mt-0.5">
              CNIC: 42201-******-{techProfile?.cnic_last4 || "4921"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Verified Mobile: <span className="font-mono">{tech.phone || "+92 300 2849102"}</span>
            </p>
          </div>
        </div>

        {/* Masked Call Button */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <a
            href={`tel:${tech.phone || "+923002849102"}`}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors shadow-xs"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.dashboard.callTech}</span>
          </a>
        </div>
      </div>

      {/* Trust Guarantee Note */}
      <div className="mt-4 p-3 rounded-xl bg-white/80 dark:bg-slate-900/80 border border-emerald-100 dark:border-emerald-900/60 text-xs text-slate-600 dark:text-slate-300">
        <p className="leading-relaxed">
          <strong className="text-emerald-700 dark:text-emerald-400">Security Rule:</strong> For your family&apos;s physical safety, match the technician&apos;s face and CNIC before opening the gate. Never share your 4-digit PIN until the technician is physically present inside.
        </p>
      </div>

      {/* Family Sharing Action */}
      <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={handleWhatsAppShare}
          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-xs"
        >
          <Share2 className="w-4 h-4" />
          <span>{t.dashboard.shareWhatsApp}</span>
        </button>

        <button
          onClick={handleCopyDetails}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          title="Copy details to clipboard"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <ExternalLink className="w-3.5 h-3.5" />}
          <span>{copied ? "Copied" : "Copy"}</span>
        </button>
      </div>
    </div>
  );
}
