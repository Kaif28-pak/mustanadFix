import React from "react";
import { ShieldCheck, UserCheck, ShieldAlert, Award, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export type BadgeType = "nadra" | "police" | "insured" | "top_rated" | "active";

interface TrustBadgeProps {
  type: BadgeType;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function TrustBadge({ type, label, size = "md", className }: TrustBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5 font-medium",
    lg: "px-3.5 py-1.5 text-sm gap-2 font-semibold",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  switch (type) {
    case "nadra":
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/60 shadow-xs",
            sizeClasses[size],
            className
          )}
        >
          <ShieldCheck className={cn("text-emerald-600 dark:text-emerald-400", iconSizes[size])} />
          <span>{label || "NADRA Verified"}</span>
        </span>
      );
    case "police":
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full bg-slate-100 text-slate-800 border border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 shadow-xs",
            sizeClasses[size],
            className
          )}
        >
          <UserCheck className={cn("text-slate-700 dark:text-slate-300", iconSizes[size])} />
          <span>{label || "Police Cleared"}</span>
        </span>
      );
    case "insured":
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full bg-indigo-50 text-indigo-900 border border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800/60 shadow-xs",
            sizeClasses[size],
            className
          )}
        >
          <ShieldAlert className={cn("text-indigo-600 dark:text-indigo-400", iconSizes[size])} />
          <span>{label || "PKR 50k Insured"}</span>
        </span>
      );
    case "top_rated":
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full bg-purple-50 text-purple-900 border border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800/60 shadow-xs",
            sizeClasses[size],
            className
          )}
        >
          <Award className={cn("text-purple-600 dark:text-purple-400", iconSizes[size])} />
          <span>{label || "Master Technician"}</span>
        </span>
      );
    default:
      return (
        <span
          className={cn(
            "inline-flex items-center rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300",
            sizeClasses[size],
            className
          )}
        >
          <CheckCircle className={iconSizes[size]} />
          <span>{label || "Verified"}</span>
        </span>
      );
  }
}
