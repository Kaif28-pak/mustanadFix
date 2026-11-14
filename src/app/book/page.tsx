"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Wrench,
  MapPin,
  Calendar,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Building,
  Upload,
  Image as ImageIcon,
  ShieldCheck,
  Clock,
  Sparkles,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { marketplace } from "@/lib/store/marketplaceStore";
import { KARACHI_AREAS } from "@/lib/validations/booking";
import { calculateDynamicPrice } from "@/lib/pricing/calculator";
import { formatPKR } from "@/lib/utils";

function BookingWizardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const services = marketplace.getServices();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Step 1: Service & Issue
  const [serviceId, setServiceId] = useState<string>(
    searchParams.get("service") || services[0]?.id || ""
  );
  const [issueDescription, setIssueDescription] = useState<string>("");
  const [issueImage, setIssueImage] = useState<string | null>(null);

  // Step 2: Address & Floor
  const [area, setArea] = useState<string>(KARACHI_AREAS[0]);
  const [fullAddress, setFullAddress] = useState<string>("");
  const [floorLevel, setFloorLevel] = useState<number>(
    parseInt(searchParams.get("floor") || "2", 10)
  );
  const [hasElevator, setHasElevator] = useState<boolean>(
    searchParams.get("elevator") !== "false"
  );

  // Step 3: Schedule
  const [scheduledDate, setScheduledDate] = useState<string>("2026-11-14");
  const [timeSlot, setTimeSlot] = useState<string>("Within 60 Mins (Emergency Heatwave Dispatch)");

  // Selected Service & Live Pricing
  const selectedService = services.find((s) => s.id === serviceId) || services[0];
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

  // Image upload simulator
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Image size exceeds 5MB limit. Please upload a smaller file.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setIssueImage(reader.result as string);
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Step validation
  const validateStep = (step: number): boolean => {
    setErrorMsg(null);
    if (step === 1) {
      if (!serviceId) {
        setErrorMsg("Please select a repair service.");
        return false;
      }
      if (issueDescription.trim().length < 8) {
        setErrorMsg("Please provide a brief description of the issue (at least 8 characters).");
        return false;
      }
      return true;
    }
    if (step === 2) {
      if (!fullAddress.trim() || fullAddress.trim().length < 6) {
        setErrorMsg("Please provide your apartment/house number and street address.");
        return false;
      }
      if (floorLevel < 0 || isNaN(floorLevel)) {
        setErrorMsg("Floor level cannot be negative.");
        return false;
      }
      return true;
    }
    if (step === 3) {
      if (!scheduledDate) {
        setErrorMsg("Please select a preferred service date.");
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setErrorMsg(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmBooking = () => {
    const newBooking = marketplace.createBooking({
      serviceId,
      issueDescription,
      issueImageUrl: issueImage,
      fullAddress,
      area,
      floorLevel,
      hasElevator,
      scheduledDate: `${scheduledDate} ${timeSlot}`,
    });

    // Automatically assign to top technician for demonstration if desired, or leave as pending
    marketplace.acceptJob(newBooking.id, "tech-101");

    router.push(`/dashboard?new_id=${newBooking.id}`);
  };

  const stepsList = [
    { num: 1, title: t.bookingWizard.step1, icon: Wrench },
    { num: 2, title: t.bookingWizard.step2, icon: MapPin },
    { num: 3, title: t.bookingWizard.step3, icon: Calendar },
    { num: 4, title: t.bookingWizard.step4, icon: CheckCircle },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Wizard Header & Stepper */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          Book Verified Technician
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          NADRA biometrically verified • Police cleared • 4-Digit PIN Handshake
        </p>

        {/* Stepper Tabs */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-6">
          {stepsList.map((s) => {
            const Icon = s.icon;
            const isCompleted = s.num < currentStep;
            const isCurrent = s.num === currentStep;

            return (
              <div
                key={s.num}
                className={`flex flex-col items-center text-center p-2.5 rounded-xl border transition-all ${
                  isCurrent
                    ? "bg-slate-900 dark:bg-slate-800 text-white border-slate-900 dark:border-slate-700 shadow-sm"
                    : isCompleted
                    ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400"
                }`}
              >
                <Icon className={`w-4 h-4 mb-1 ${isCompleted ? "text-emerald-600 dark:text-emerald-400" : ""}`} />
                <span className="text-[11px] sm:text-xs font-semibold truncate max-w-full">
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Error alert if any (Violet instead of red) */}
      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/80 text-violet-900 dark:text-violet-300 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-violet-600 dark:text-violet-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Service & Issue */}
      {currentStep === 1 && (
        <div className="space-y-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-3">
              {t.bookingWizard.serviceLabel}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {services.map((srv) => {
                const isSelected = srv.id === serviceId;
                return (
                  <button
                    key={srv.id}
                    type="button"
                    onClick={() => setServiceId(srv.id)}
                    className={`text-left p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {srv.name}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {srv.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Standard Base:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {formatPKR(srv.base_price)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              {t.bookingWizard.issueDescription}
            </label>
            <textarea
              rows={3}
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
              placeholder={t.bookingWizard.issuePlaceholder}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              {t.bookingWizard.uploadPhoto}
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer text-slate-700 dark:text-slate-300">
                <Upload className="w-4 h-4 text-emerald-600" />
                <span>Choose Image file (Max 5MB)</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>

              {issueImage && (
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800">
                  <img
                    src={issueImage}
                    alt="Uploaded issue"
                    className="w-12 h-12 object-cover rounded-lg border border-slate-300 dark:border-slate-700"
                  />
                  <div className="text-xs">
                    <span className="font-semibold text-emerald-600 block">Photo attached</span>
                    <button
                      type="button"
                      onClick={() => setIssueImage(null)}
                      className="text-slate-500 hover:text-slate-800 dark:hover:text-white"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Address & Floor Level */}
      {currentStep === 2 && (
        <div className="space-y-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              {t.bookingWizard.areaLabel}
            </label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
            >
              {KARACHI_AREAS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              {t.bookingWizard.addressLabel}
            </label>
            <input
              type="text"
              value={fullAddress}
              onChange={(e) => setFullAddress(e.target.value)}
              placeholder="e.g. Apt 503, Block 4, Clifton / House 12-B, Kh-e-Mujahid"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          {/* Dynamic Floor Selector with Elevator Checkbox */}
          <div className="pt-2 p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span>{t.bookingWizard.floorLabel}</span>
              </label>
              <span className="text-sm font-bold text-slate-900 dark:text-white px-2.5 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                {floorLevel === 0 ? "Ground Floor" : `Floor ${floorLevel}`}
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

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {t.bookingWizard.elevatorLabel}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHasElevator(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    hasElevator
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Yes, Has Elevator
                </button>
                <button
                  type="button"
                  onClick={() => setHasElevator(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    !hasElevator
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  Stairs Only
                </button>
              </div>
            </div>

            {floorLevel > 0 && (
              <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                Dynamic surcharge:{" "}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  +{formatPKR(pricing.floorSurcharge)}
                </span>{" "}
                {hasElevator ? "(40% reduced elevator rate)" : "(100% stair climb rate)"}
              </p>
            )}
          </div>
        </div>
      )}

      {/* STEP 3: Schedule Date & Time */}
      {currentStep === 3 && (
        <div className="space-y-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs sm:text-sm text-emerald-900 dark:text-emerald-200 font-medium">
              {t.bookingWizard.emergencyNotice}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              {t.bookingWizard.dateLabel}
            </label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
              {t.bookingWizard.timeLabel}
            </label>
            <div className="space-y-2">
              {[
                "Within 60 Mins (Emergency Heatwave Dispatch)",
                "Morning Slot (09:00 AM - 12:00 PM)",
                "Afternoon Slot (01:00 PM - 04:00 PM)",
                "Evening Slot (04:00 PM - 07:00 PM)",
              ].map((slot) => {
                const isSelected = slot === timeSlot;
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 ring-2 ring-emerald-500/20"
                        : "border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Dynamic Price Review & Confirm */}
      {currentStep === 4 && (
        <div className="space-y-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 shadow-sm">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Final Quotation
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              Review Dynamic Pricing & Booking Details
            </h2>
          </div>

          {/* Transparent Itemized Receipt */}
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Selected Service</span>
              <span className="font-bold text-slate-900 dark:text-white">
                {selectedService.name}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Base Service Fee</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                {formatPKR(pricing.basePrice)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">
                Floor Surcharge ({floorLevel}F • {hasElevator ? "Elevator" : "Stairs"})
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">
                +{formatPKR(pricing.floorSurcharge)}
              </span>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                Total Guaranteed Amount
              </span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatPKR(pricing.totalAmount)}
              </span>
            </div>
          </div>

          {/* Location & Schedule summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-500 block mb-1">SERVICE LOCATION</span>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {fullAddress}, {area}
              </p>
              <p className="text-slate-500 mt-1">
                Floor: {floorLevel} | Elevator: {hasElevator ? "Yes" : "No"}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
              <span className="font-bold text-slate-500 block mb-1">DISPATCH SCHEDULE</span>
              <p className="font-medium text-slate-800 dark:text-slate-200">
                {scheduledDate}
              </p>
              <p className="text-slate-500 mt-1">{timeSlot}</p>
            </div>
          </div>

          {/* Safety Reminder */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950 dark:text-emerald-200">
              <p className="font-bold">Next: Your 4-Digit Private Start PIN</p>
              <p className="mt-0.5 text-slate-600 dark:text-slate-400">
                Once confirmed, you will immediately receive a 4-digit code. Keep it private until the technician arrives at your door and you verify their photo ID.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="mt-8 flex items-center justify-between gap-4">
        {currentStep > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.common.back}</span>
          </button>
        ) : (
          <div />
        )}

        {currentStep < 4 ? (
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 active:scale-[0.98] transition-all shadow-md ml-auto"
          >
            <span>{t.common.next}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleConfirmBooking}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] transition-all shadow-lg hover:shadow-emerald-600/30 ml-auto"
          >
            <span>{t.bookingWizard.submitBooking}</span>
            <CheckCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-sm">Loading booking wizard...</div>}>
      <BookingWizardContent />
    </Suspense>
  );
}
