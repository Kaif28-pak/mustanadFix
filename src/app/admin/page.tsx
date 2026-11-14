"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  UserCheck,
  CheckCircle,
  XCircle,
  Award,
  AlertCircle,
  TrendingUp,
  Users,
  Wrench,
  Search,
  Filter,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { marketplace, VerifiedTechUser } from "@/lib/store/marketplaceStore";
import { Booking } from "@/lib/supabase/database.types";
import { formatPKR } from "@/lib/utils";

export default function AdminPage() {
  const { t } = useLanguage();
  const [technicians, setTechnicians] = useState<VerifiedTechUser[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [notice, setNotice] = useState<string | null>(null);

  const refreshData = () => {
    setTechnicians([...marketplace.getTechnicians()]);
    setBookings([...marketplace.getBookings()]);
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = marketplace.subscribe(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, []);

  const handleToggleVetting = (techId: string, field: "nadra" | "police") => {
    marketplace.toggleTechVetting(techId, field);
    setNotice(`Updated ${field.toUpperCase()} verification status.`);
    setTimeout(() => setNotice(null), 3000);
    refreshData();
  };

  const completedCount = bookings.filter((b) => b.status === "completed").length;
  const activeCount = bookings.filter((b) => !["completed", "cancelled"].includes(b.status)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Internal Platform Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t.admin.title}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Overseeing Karachi technician compliance, NADRA certificates, and live dispatch integrity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-slate-800 text-xs font-mono font-bold">
            Admin Mode (Superuser)
          </span>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-xs font-semibold text-emerald-900 dark:text-emerald-200">
          {notice}
        </div>
      )}

      {/* 1. PLATFORM METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Technicians</span>
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {technicians.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">100% Karachi Resident Verified</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Active Dispatches</span>
            <Wrench className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {activeCount}
          </p>
          <span className="text-[11px] text-slate-400">In-progress or on the way</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Completed Jobs</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {completedCount}
          </p>
          <span className="text-[11px] text-slate-400">PIN handshake confirmed</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>SafeGuard Pool</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            PKR 2,500,000
          </p>
          <span className="text-[11px] text-slate-400">Insured damages platform escrow</span>
        </div>
      </div>

      {/* 2. TECHNICIAN VETTING QUEUE */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t.admin.pendingVerification}
            </h2>
            <p className="text-xs text-slate-500">
              Biometric NADRA identity & local Karachi police character certificates
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Technician</th>
                <th className="py-3 px-4">CNIC Tag</th>
                <th className="py-3 px-4">Coverage Areas</th>
                <th className="py-3 px-4">NADRA Biometric</th>
                <th className="py-3 px-4">Police Clearance</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {technicians.map((tUser) => (
                <tr key={tUser.profile.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={tUser.profile.avatar_url || ""}
                        alt={tUser.profile.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">
                          {tUser.profile.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {tUser.profile.phone}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                    42201-******-{tUser.techProfile.cnic_last4 || "0000"}
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {tUser.techProfile.service_areas.join(", ")}
                  </td>

                  <td className="py-3.5 px-4">
                    {tUser.techProfile.nadra_verified ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-violet-700 dark:text-violet-400 font-semibold">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Unverified</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    {tUser.techProfile.police_cleared ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Cleared</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-violet-700 dark:text-violet-400 font-semibold">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Pending</span>
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleToggleVetting(tUser.profile.id, "nadra")}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Toggle NADRA
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleVetting(tUser.profile.id, "police")}
                      className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px] font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Toggle Police
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. PLATFORM ALL BOOKINGS FEED */}
      <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {t.admin.activeBookings}
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {bookings.length} Total Registered
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-950 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Ref</th>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Area & Floor</th>
                <th className="py-3 px-4">Assigned Tech</th>
                <th className="py-3 px-4">PIN Code</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                    #{b.id}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-900 dark:text-white">
                    {b.service?.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                    {b.address?.area} (Floor {b.address?.floor_level})
                  </td>
                  <td className="py-3.5 px-4">
                    {b.technician ? (
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {b.technician.name}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {b.start_pin}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">
                      {b.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-emerald-400">
                    {formatPKR(b.total_amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
