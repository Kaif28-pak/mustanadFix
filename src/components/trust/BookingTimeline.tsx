"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Truck, PlayCircle, Award, AlertCircle } from "lucide-react";
import { BookingStatus } from "@/lib/supabase/database.types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { cn } from "@/lib/utils";

interface BookingTimelineProps {
  status: BookingStatus;
  cancellationReason?: string | null;
}

const STEPS: { status: BookingStatus; labelKey: keyof typeof import("@/lib/i18n/translations").translations.en.dashboard.timeline; icon: React.ElementType }[] = [
  { status: "pending", labelKey: "pending", icon: Clock },
  { status: "assigned", labelKey: "assigned", icon: CheckCircle },
  { status: "on_the_way", labelKey: "on_the_way", icon: Truck },
  { status: "job_started", labelKey: "job_started", icon: PlayCircle },
  { status: "completed", labelKey: "completed", icon: Award },
];

export function BookingTimeline({ status, cancellationReason }: BookingTimelineProps) {
  const { t } = useLanguage();

  if (status === "cancelled") {
    return (
      <div className="rounded-xl p-4 bg-slate-100 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200">
        <div className="flex items-center gap-2 font-semibold">
          <AlertCircle className="w-5 h-5 text-violet-600 dark:text-violet-400" />
          <span>Booking Cancelled</span>
        </div>
        {cancellationReason && (
          <p className="text-sm mt-1 text-slate-600 dark:text-slate-400">
            Reason: {cancellationReason}
          </p>
        )}
      </div>
    );
  }

  // Determine current active step index
  const statusOrder: BookingStatus[] = ["pending", "assigned", "on_the_way", "job_started", "completed"];
  const currentIndex = statusOrder.indexOf(status);

  return (
    <div className="w-full py-4">
      {/* Desktop Horizontal View */}
      <div className="relative flex items-center justify-between">
        {/* Background Connecting Line */}
        <div className="absolute top-5 left-4 right-4 h-1 bg-slate-200 dark:bg-slate-800 -z-0" />

        {/* Animated Active Progress Line */}
        <motion.div
          className="absolute top-5 left-4 h-1 bg-emerald-600 dark:bg-emerald-500 -z-0"
          initial={{ width: "0%" }}
          animate={{
            width: `${Math.min(100, Math.max(0, (currentIndex / (STEPS.length - 1)) * 100))}%`,
          }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isPending = idx > currentIndex;

          return (
            <div key={step.status} className="flex flex-col items-center relative z-10">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? [1, 1.1, 1] : 1,
                }}
                transition={{ repeat: isCurrent ? Infinity : 0, duration: 2 }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                  isDone && "bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500 shadow-sm",
                  isCurrent && "bg-slate-900 text-white border-emerald-500 dark:bg-white dark:text-slate-950 ring-4 ring-emerald-500/20 shadow-md",
                  isPending && "bg-white text-slate-400 border-slate-300 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-600"
                )}
              >
                <Icon className="w-5 h-5" />
              </motion.div>
              <span
                className={cn(
                  "text-xs mt-2 text-center max-w-[80px] font-medium transition-colors",
                  isCurrent && "text-slate-900 dark:text-white font-bold",
                  isDone && "text-emerald-700 dark:text-emerald-400",
                  isPending && "text-slate-400 dark:text-slate-600"
                )}
              >
                {t.dashboard.timeline[step.labelKey]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
