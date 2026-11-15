"use client";

import React from "react";
import Image from "next/image";
import { Star, MapPin, Wrench, Shield, CheckCircle2 } from "lucide-react";
import { TrustBadge } from "./TrustBadge";
import { Profile, TechnicianProfile } from "@/lib/supabase/database.types";
import { useLanguage } from "@/lib/i18n/LanguageContext";

interface TechnicianCardProps {
  profile: Profile;
  techProfile: TechnicianProfile;
  compact?: boolean;
}

export function TechnicianCard({ profile, techProfile, compact = false }: TechnicianCardProps) {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm hover:shadow-md transition-all duration-200 p-5">
      {/* Platform Insured Ribbon */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <Shield className="w-3.5 h-3.5 fill-emerald-600/20" />
          <span>{t.trust.badges.insured}</span>
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>{techProfile.total_jobs}+ Karachi Jobs Done</span>
        </div>
      </div>

      <div className="flex items-start gap-4">
        {/* Avatar with Verified Ring */}
        <div className="relative shrink-0">
          <Image
            src={profile.avatar_url || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80"}
            alt={profile.name}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
            unoptimized
          />
          <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 border-2 border-white dark:border-slate-900">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="text-base font-bold text-slate-900 dark:text-white truncate">
              {profile.name}
            </h4>
            <div className="flex items-center gap-1 bg-amber-500/10 text-slate-900 dark:text-amber-300 px-2 py-0.5 rounded-md text-xs font-bold shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{techProfile.rating_avg.toFixed(1)}</span>
            </div>
          </div>

          {/* CNIC Tag */}
          {techProfile.cnic_last4 && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              CNIC: <span className="font-mono font-medium">42201-******-{techProfile.cnic_last4}</span>
            </p>
          )}

          {/* Service Areas */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 mt-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{techProfile.service_areas.join(" • ")}</span>
          </div>
        </div>
      </div>

      {/* Trust Badges Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-1.5">
        {techProfile.nadra_verified && (
          <TrustBadge type="nadra" label={t.trust.badges.nadra} size="sm" />
        )}
        {techProfile.police_cleared ? (
          <TrustBadge type="police" label={t.trust.badges.police} size="sm" />
        ) : (
          <span className="inline-flex items-center rounded-full bg-violet-50 text-violet-800 border border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800/60 px-2 py-0.5 text-xs font-medium">
            Police Verification Pending
          </span>
        )}
        <TrustBadge type="top_rated" label="Top Karachi AC Pro" size="sm" />
      </div>

      {/* Skills tags */}
      {!compact && techProfile.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {techProfile.skills.map((skill, idx) => (
            <span
              key={idx}
              className="inline-flex items-center text-[11px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md"
            >
              <Wrench className="w-2.5 h-2.5 mr-1 text-slate-400" />
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
