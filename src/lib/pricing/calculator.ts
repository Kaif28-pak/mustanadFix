export interface PricingCalculationInput {
  basePrice: number;
  floorSurchargeRate: number;
  floorLevel: number;
  hasElevator: boolean;
}

export interface PricingCalculationResult {
  basePrice: number;
  floorLevel: number;
  hasElevator: boolean;
  floorSurcharge: number;
  totalAmount: number;
  savingsWithElevator: number;
}

export function calculateDynamicPrice({
  basePrice,
  floorSurchargeRate,
  floorLevel,
  hasElevator,
}: PricingCalculationInput): PricingCalculationResult {
  const safeFloor = Math.max(0, Math.floor(floorLevel || 0));
  let floorSurcharge = 0;
  let fullStairSurcharge = safeFloor * floorSurchargeRate;

  if (safeFloor > 0) {
    if (hasElevator) {
      // 40% of standard floor rate with elevator
      floorSurcharge = Math.round(safeFloor * (floorSurchargeRate * 0.4));
    } else {
      // 100% standard floor rate for stairs
      floorSurcharge = Math.round(fullStairSurcharge);
    }
  }

  const savingsWithElevator = hasElevator && safeFloor > 0 
    ? Math.max(0, fullStairSurcharge - floorSurcharge) 
    : 0;

  const totalAmount = basePrice + floorSurcharge;

  return {
    basePrice,
    floorLevel: safeFloor,
    hasElevator,
    floorSurcharge,
    totalAmount,
    savingsWithElevator,
  };
}
