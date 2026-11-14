"use client";

import React, { useState } from "react";
import { Calculator, ArrowRight, Building, Check, Info } from "lucide-react";
import { Service } from "@/lib/supabase/database.types";
import { calculateDynamicPrice } from "@/lib/pricing/calculator";
import { formatPKR } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Link from "next/link";

interface DynamicPriceCalculatorProps {
  services: Service[];
  initialServiceId?: string;
  onSelectBooking?: (serviceId: string, floorLevel: number, hasElevator: boolean) => void;
}

export function DynamicPriceCalculator({
  services,
  initialServiceId,
  onSelectBooking,
}: DynamicPriceCalculatorProps) {
  const { t } = useLanguage();
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || services[0]?.id || ""
  );
  const [floorLevel, setFloorLevel] = useState<number>(3);
  const [hasElevator, setHasElevator] = useState<boolean>(true);

  const selectedService =
    services.find((s) => s.id === selectedServiceId) || services[0];

  const pricing = selectedService
    ? calculateDynamicPrice({
        basePrice: selectedService.base_price,
        floorSurchargeRate: selectedService.floor_surcharge_rate,
        floorLevel,
        hasElevator,
      })
    : {
        basePrice: 0,
        floorLevel: 0,
        hasElevator: true,
        floorSurcharge: 0,
        totalAmount: 0,
        savingsWithElevator: 0,
      };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center">
          <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {t.calculator.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.calculator.subtitle}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-5">
          {/* Service Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              {t.calculator.selectService}
            </label>
            <div className="space-y-2">
              {services.map((service) => {
                const isSelected = service.id === selectedServiceId;
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedServiceId(service.id)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm text-slate-900 dark:text-white">
                        {service.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {service.description}
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3">
                      <span className="font-bold text-sm text-slate-900 dark:text-emerald-400">
                        {formatPKR(service.base_price)}
                      </span>
                      <span className="block text-[10px] text-slate-500">Base</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Building Floor Input */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.calculator.buildingFloor}</span>
              </label>
              <span className="text-sm font-bold text-slate-900 dark:text-white px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                {floorLevel === 0 ? t.calculator.groundFloor : `Floor ${floorLevel}`}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={15}
              value={floorLevel}
              onChange={(e) => setFloorLevel(parseInt(e.target.value) || 0)}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Ground (0)</span>
              <span>5th Floor</span>
              <span>10th Floor</span>
              <span>15th Floor</span>
            </div>
          </div>

          {/* Elevator Toggle */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              {t.calculator.hasElevator}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setHasElevator(true)}
                className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  hasElevator
                    ? "border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300 ring-2 ring-emerald-500/20"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {t.calculator.yesElevator}
              </button>
              <button
                type="button"
                onClick={() => setHasElevator(false)}
                className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  !hasElevator
                    ? "border-slate-800 bg-slate-100 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-white ring-2 ring-slate-400/20"
                    : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`}
              >
                {t.calculator.noElevator}
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Summary & Transparent Receipt Card */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 p-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 pb-2 border-b border-slate-200 dark:border-slate-800">
              Live Price Breakdown
            </h4>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 dark:text-slate-400">
                {t.calculator.breakdown.basePrice}
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {formatPKR(pricing.basePrice)}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                <span>{t.calculator.breakdown.floorSurcharge}</span>
                {floorLevel > 0 && (
                  <span className="text-[11px] text-slate-400">
                    ({floorLevel}F {hasElevator ? "w/ Lift" : "Stairs"})
                  </span>
                )}
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                +{formatPKR(pricing.floorSurcharge)}
              </span>
            </div>

            {pricing.savingsWithElevator > 0 && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                <span>Elevator saved you {formatPKR(pricing.savingsWithElevator)} in labor surcharge</span>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                {t.calculator.breakdown.total}
              </span>
              <div className="text-right">
                <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatPKR(pricing.totalAmount)}
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-slate-400">
                  All Inclusive Standard Rate
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed pt-2">
              {t.calculator.breakdown.note}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
            {onSelectBooking ? (
              <button
                type="button"
                onClick={() =>
                  onSelectBooking(selectedServiceId, floorLevel, hasElevator)
                }
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-md"
              >
                <span>Continue with this Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href={`/book?service=${selectedServiceId}&floor=${floorLevel}&elevator=${hasElevator}`}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-md"
              >
                <span>Book This Service Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
