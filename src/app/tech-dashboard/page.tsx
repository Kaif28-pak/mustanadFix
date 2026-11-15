"use client";

import React, { useState } from "react";
import {
  Wrench,
  MapPin,
  CheckCircle,
  Truck,
  Award,
  Lock,
  PhoneCall,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useMarketplace } from "@/lib/store/marketplaceStore";
import { Booking } from "@/lib/supabase/database.types";
import { formatPKR } from "@/lib/utils";

export default function TechDashboardPage() {
  const { t } = useLanguage();
  const marketplaceStore = useMarketplace();
  const availableJobs = marketplaceStore.getAvailableJobsForTech();
  const assignedJobs = marketplaceStore.getAssignedJobsForTech("tech-101");

  const [selectedArea, setSelectedArea] = useState<string>("All");
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [activeJobForPin, setActiveJobForPin] = useState<Booking | null>(null);
  const [inputPin, setInputPin] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Atomic Accept Job
  const handleAcceptJob = (bookingId: string) => {
    const res = marketplaceStore.acceptJob(bookingId, "tech-101");
    if (res.success) {
      setActionSuccessMsg(t.techDashboard.acceptedSuccess);
      setTimeout(() => setActionSuccessMsg(null), 3500);
    } else {
      alert(res.message);
    }
  };

  // Dispatch "On the way"
  const handleOnTheWay = (bookingId: string) => {
    marketplaceStore.setTechOnTheWay(bookingId);
  };

  // Verify PIN Handshake
  const handleVerifyPin = () => {
    if (!activeJobForPin) return;
    setPinError(null);

    const res = marketplaceStore.verifyJobPin(activeJobForPin.id, inputPin);
    if (res.success) {
      setPinModalOpen(false);
      setInputPin("");
      setActionSuccessMsg("4-Digit PIN Handshake Verified! Job status is now IN PROGRESS.");
      setTimeout(() => setActionSuccessMsg(null), 3500);
    } else {
      setPinError(res.message);
    }
  };

  // Complete Job
  const handleCompleteJob = (bookingId: string) => {
    marketplaceStore.completeJob(bookingId);
    setActionSuccessMsg("Job marked as Completed! PKR payout queued.");
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Banner with Online Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              {t.techDashboard.onlineStatus}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t.techDashboard.title}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as: <strong className="text-slate-800 dark:text-slate-200">Tariq Mehmood</strong> (Senior AC Technician • Clifton/DHA Zone)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>NADRA Verified Pro</span>
          </div>
        </div>
      </div>

      {/* Success Notification Bar */}
      {actionSuccessMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* 1. CURRENT ASSIGNED JOB (ACTIVE TICKET) */}
      {assignedJobs.length > 0 && (
        <div className="mb-12 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Wrench className="w-5 h-5 text-emerald-600" />
              <span>{t.techDashboard.activeJob}</span>
            </h2>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {assignedJobs[0].status.toUpperCase()}
            </span>
          </div>

          {assignedJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-3xl border-2 border-emerald-500/60 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-md space-y-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs text-slate-500">Service Category</span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {job.service?.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Job Ref: <span className="font-mono font-medium">#{job.id}</span>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <span className="text-xs text-slate-500">Guaranteed Total Payout</span>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {formatPKR(job.total_amount)}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Includes {formatPKR(job.calculated_floor_surcharge)} floor surcharge
                  </p>
                </div>
              </div>

              {/* Unlocked Customer & Address Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Unlocked Location</span>
                    </span>
                    <span className="text-xs text-slate-500">
                      Floor: {job.address?.floor_level} ({job.address?.has_elevator ? "Elevator" : "Stairs"})
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {job.address?.full_address}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    Neighborhood: {job.address?.area}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Customer Symptom Notes
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 italic">
                    &ldquo;{job.issue_description}&rdquo;
                  </p>
                  {job.issue_image_url && (
                    <div className="pt-2">
                      <a
                        href={job.issue_image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-emerald-600 hover:underline font-semibold"
                      >
                        View Customer Photo &rarr;
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons based on status */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                {job.status === "assigned" && (
                  <button
                    type="button"
                    onClick={() => handleOnTheWay(job.id)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 shadow-sm"
                  >
                    <Truck className="w-4 h-4" />
                    <span>Dispatch: I Am On The Way</span>
                  </button>
                )}

                {job.status === "on_the_way" && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveJobForPin(job);
                      setPinModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md animate-bounce"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Enter Customer PIN to Start Work</span>
                  </button>
                )}

                {job.status === "job_started" && (
                  <button
                    type="button"
                    onClick={() => handleCompleteJob(job.id)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md"
                  >
                    <Award className="w-4 h-4" />
                    <span>{t.techDashboard.completeJobBtn}</span>
                  </button>
                )}

                <a
                  href="tel:+923000000000"
                  className="inline-flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-600" />
                  <span>Call Customer</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. NEARBY AVAILABLE JOBS (PENDING FEED) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {t.techDashboard.availableJobs}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pending customer requests in Karachi. Exact street address & phone are masked until accepted.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Filter Area:</span>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold"
            >
              <option value="All">All Karachi Zones</option>
              <option value="DHA">DHA (Phases 1-8)</option>
              <option value="Clifton">Clifton</option>
              <option value="PECHS">PECHS</option>
            </select>
          </div>
        </div>

        {availableJobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 text-center text-xs text-slate-500">
            No pending jobs in your queue right now. New Karachi bookings will appear here in real-time.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs hover:border-emerald-500/50 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                        {job.service?.category?.toUpperCase()}
                      </span>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                        {job.service?.name}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-base font-extrabold text-slate-900 dark:text-emerald-400">
                        {formatPKR(job.total_amount)}
                      </span>
                      <span className="block text-[10px] text-slate-400">Total Est.</span>
                    </div>
                  </div>

                  {/* Masked Address Privacy Tag */}
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{job.address?.area}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <EyeOff className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="italic">{t.techDashboard.maskedAddressNote}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 pt-1">
                      Building: Floor {job.address?.floor_level} • {job.address?.has_elevator ? "Elevator Available" : "Stairs"}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    &ldquo;{job.issue_description}&rdquo;
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    PIN Handshake Enforced
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAcceptJob(job.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-xs"
                  >
                    <span>{t.techDashboard.acceptJobBtn}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PIN ENTRY MODAL (JOB-START HANDSHAKE) */}
      {pinModalOpen && activeJobForPin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {t.techDashboard.enterPinTitle}
                </h3>
                <p className="text-xs text-slate-500">
                  Ref #{activeJobForPin.id}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.techDashboard.enterPinDesc}
            </p>

            {/* PIN Input */}
            <div className="pt-2">
              <input
                type="text"
                maxLength={4}
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value.replace(/\D/g, ""))}
                placeholder="• • • •"
                className="w-full text-center tracking-[1em] text-3xl font-mono font-black py-4 rounded-2xl border-2 border-emerald-500 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-hidden"
              />
            </div>

            {/* Error message (Violet instead of red) */}
            {pinError && (
              <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800 text-violet-900 dark:text-violet-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-violet-600" />
                <span>{pinError}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setPinModalOpen(false);
                  setPinError(null);
                  setInputPin("");
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleVerifyPin}
                disabled={inputPin.length !== 4}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 transition-colors shadow-sm"
              >
                {t.techDashboard.submitPin}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
