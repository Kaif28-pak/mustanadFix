"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  PhoneCall,
  Clock,
  MapPin,
  AlertCircle,
  XCircle,
  FileText,
  CheckCircle2,
  Share2,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { marketplace } from "@/lib/store/marketplaceStore";
import { Booking } from "@/lib/supabase/database.types";
import { BookingTimeline } from "@/components/trust/BookingTimeline";
import { SafetyCard } from "@/components/trust/SafetyCard";
import { formatPKR } from "@/lib/utils";

export default function CustomerDashboardPage() {
  const { t } = useLanguage();
  const [booking, setBooking] = useState<Booking | undefined>(undefined);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");

  useEffect(() => {
    // Initial fetch
    setBooking(marketplace.getActiveCustomerBooking("cust-demo"));

    // Subscribe to realtime changes in marketplace store
    const unsubscribe = marketplace.subscribe(() => {
      setBooking(marketplace.getActiveCustomerBooking("cust-demo"));
    });

    return () => unsubscribe();
  }, []);

  const handleConfirmCancel = () => {
    if (booking && cancelReason.trim()) {
      marketplace.cancelBooking(booking.id, cancelReason);
      setCancelModalOpen(false);
      setCancelReason("");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Karachi Customer Safety Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {t.dashboard.title}
          </h1>
        </div>

        <Link
          href="/book"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors shadow-xs"
        >
          <span>Book Another Repair</span>
        </Link>
      </div>

      {!booking ? (
        <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-10 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            {t.dashboard.noActive}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Book an AC or home appliance technician with our 4-digit PIN security shield and PKR 50,000 SafeGuard insurance.
          </p>
          <div className="pt-2">
            <Link
              href="/book"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
            >
              <span>{t.dashboard.bookNowBtn}</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 1. UBER-STYLE BOOKING TIMELINE */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-2">
              <div>
                <span className="text-xs text-slate-500">{t.dashboard.bookingId}</span>
                <p className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                  #{booking.id}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500">Service</span>
                <p className="font-semibold text-slate-900 dark:text-white text-sm">
                  {booking.service?.name}
                </p>
              </div>
            </div>

            <BookingTimeline
              status={booking.status}
              cancellationReason={booking.cancellation_reason}
            />
          </div>

          {/* 2. 4-DIGIT START PIN SECURITY CARD (PROMINENT DISPLAY) */}
          {booking.status !== "cancelled" && booking.status !== "completed" && (
            <div className="rounded-3xl border-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 p-6 sm:p-8 shadow-md">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="space-y-2 max-w-xl">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                    <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{t.dashboard.pinNoticeTitle}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {t.dashboard.pinNoticeDesc}
                  </p>
                </div>

                {/* PIN Display Badge */}
                <div className="shrink-0 flex flex-col items-center justify-center p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-sm">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 mb-1">
                    Job-Start Code
                  </span>
                  <span className="font-mono text-3xl sm:text-4xl font-black tracking-widest text-slate-900 dark:text-white px-3 py-1">
                    {booking.start_pin}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1">
                    4-Digit Secret PIN
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 3. SAFETY CARD WITH TECHNICIAN DETAILS & WHATSAPP BROADCAST */}
          <SafetyCard booking={booking} />

          {/* 4. BOOKING SUMMARY & PRICING RECEIPT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Address & Schedule */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
                Service Location & Details
              </h4>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {booking.address?.full_address}
              </p>
              <p className="text-xs text-slate-500">
                Area: <span className="font-medium text-slate-800 dark:text-slate-200">{booking.address?.area}</span>
              </p>
              <p className="text-xs text-slate-500">
                Floor: <span className="font-medium text-slate-800 dark:text-slate-200">{booking.address?.floor_level} ({booking.address?.has_elevator ? "Elevator" : "Stairs Only"})</span>
              </p>
              <div className="pt-2 text-xs text-slate-600 dark:text-slate-300">
                <span className="font-medium text-slate-500 block">Reported Symptoms:</span>
                <p className="mt-0.5 italic">&ldquo;{booking.issue_description}&rdquo;</p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-100 dark:border-slate-800">
                Total Price Breakdown
              </h4>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Base Service</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {formatPKR(booking.service?.base_price || 0)}
                </span>
              </div>
              <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Floor Multiplier Surcharge</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  +{formatPKR(booking.calculated_floor_surcharge)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Total Payable
                </span>
                <span className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatPKR(booking.total_amount)}
                </span>
              </div>
              <p className="text-[10px] text-slate-500">
                Payment mode: Cash on delivery or Bank Transfer upon satisfactory completion.
              </p>
            </div>
          </div>

          {/* 5. CANCELLATION & DISPUTE ACTIONS (Zero red/orange: using violet & slate) */}
          {["pending", "assigned"].includes(booking.status) && (
            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                <span>{t.dashboard.cancelBooking}</span>
              </button>

              <button
                type="button"
                onClick={() => setDisputeModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-violet-700 dark:text-violet-400 hover:underline"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Report an Issue / Dispute</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* CANCELLATION MODAL */}
      {cancelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {t.dashboard.cancelBooking}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Please share the reason for cancellation so we can maintain our service quality standards.
            </p>
            <textarea
              rows={3}
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder={t.dashboard.cancelReasonPlaceholder}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-violet-500/30"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={!cancelReason.trim()}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 disabled:opacity-50 transition-colors"
              >
                {t.dashboard.confirmCancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DISPUTE MODAL */}
      {disputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Raise a Service Dispute
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your inquiry will be escalated directly to our Karachi Operations Lead for immediate intervention under the PKR 50,000 SafeGuard Guarantee.
            </p>
            <textarea
              rows={3}
              value={disputeReason}
              onChange={(e) => setDisputeReason(e.target.value)}
              placeholder="Describe the complaint or concern..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-violet-500/30"
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDisputeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  alert("Dispute ticket opened. Reference #DSP-" + Date.now().toString().slice(-4));
                  setDisputeModalOpen(false);
                }}
                disabled={!disputeReason.trim()}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-violet-700 hover:bg-violet-800 disabled:opacity-50 transition-colors"
              >
                Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
