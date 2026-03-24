import { roundNumber } from "@/src/helpers/round";
import { LeasePaymentSchedule } from "./schema";

export const calculateLeaseTermInYears = (
  commencementDate: string | Date,
  endDate: string | Date,
): number => {
  const start = new Date(commencementDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date provided for lease term calculation.");
  }

  if (end < start) {
    throw new Error("End date cannot be before the commencement date.");
  }

  const diffInMs = end.getTime() - start.getTime();
  const msPerYear = 1000 * 60 * 60 * 24 * 365.25;

  return diffInMs / msPerYear;
};

const addMonthsSafely = (date: Date, monthsToAdd: number): Date => {
  const d = new Date(date);
  const targetMonth = d.getMonth() + monthsToAdd;
  d.setMonth(targetMonth);

  // If the date rolled over (e.g., Jan 31 + 1 month -> Mar 3),
  // snap it back to the last day of the correct target month (Feb 28/29).
  if (d.getDate() !== date.getDate()) {
    d.setDate(0);
  }
  return d;
};

export const checkPaymentTiming = (paymentTiming: string): number => {
  return paymentTiming === "advance" ? 0 : 1;
};

export const getLeasePaymentPeriod = (
  commencementDate: string | Date,
  leaseTermYears: number,
  paymentTiming: string,
): LeasePaymentSchedule => {
  const totalMonths = Math.round(leaseTermYears * 12);
  const start = checkPaymentTiming(paymentTiming);

  const baseDate = new Date(commencementDate);

  const periods = Array.from({ length: totalMonths }, (_, i) => i + start);

  const month_end = Array.from({ length: totalMonths }, (_, i) => {
    // Use the safe month addition helper
    const currentDate = addMonthsSafely(baseDate, i);

    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();

    return `${day}/${month}/${year}`;
  });

  return { periods, month_end };
};

export const calculatePresentValueSchedule = (
  paymentPeriods: number[],
  monthlyDiscountRate: number,
  netCashflow: number,
  paymentsPerYear: number,
  paymentTiming: string,
): { discountFactors: number[]; presentValues: number[] } => {
  const discountFactors: number[] = [];
  // const discountFactors1: number[] = [];
  const presentValues: number[] = [];

  const ifArrears = checkPaymentTiming(paymentTiming);

  paymentPeriods.forEach((t) => {
    const factor2 = roundNumber(1 / (1 + monthlyDiscountRate / 100) ** t, 3);
    const factor = (1 / (1 + monthlyDiscountRate / 100) ** t);
    const factor1 =
      Math.trunc((1 / (1 + monthlyDiscountRate / 100) ** t) * 1000) / 1000;
    discountFactors.push(factor);
    // discountFactors1.push(factor1);
    const isPaymentMonth = checkIsPaymentMonth(t - ifArrears, paymentsPerYear);
    const currentCashflow = isPaymentMonth ? netCashflow : 0;
    const pv = factor * currentCashflow;
    presentValues.push(pv);
  });
  // console.log("discountFactors:: ", discountFactors);
  // console.log("discountFactors1:: ", discountFactors1);
  // console.log("presentValues:: ", presentValues);
  return { discountFactors, presentValues };
};

const checkIsPaymentMonth = (
  paymentPeriod: number,
  paymentsPerYear: number,
): boolean => {
  const paymentIntervalMonths = 12 / paymentsPerYear;
  return paymentPeriod % paymentIntervalMonths === 0;
};

export const getLeaseLiabilityAmortisation = (
  paymentPeriods: number[],
  leaseLiabilityInitialApplication: number,
  netCashflow: number,
  incrementalBorrowingMonthlyRate: number,
  paymentsPerYear: number,
  paymentTiming: string,
): {
  pvOfLiability: number[];
  monthlyRental: number[];
  interestForPeriods: number[];
  closingBalance: number[];
} => {
  let monthlyRental: number[] = [];
  let pvOfLiability: number[] = [];
  let interestForPeriods: number[] = [];
  let closingBalance: number[] = [];
  let periodPvOfLiability: number = leaseLiabilityInitialApplication;
  const ifArrears = checkPaymentTiming(paymentTiming);
  let isRentalOver = false;

  paymentPeriods.forEach((t, index) => {
    pvOfLiability.push(periodPvOfLiability > 0 ? periodPvOfLiability : 0);
    const isPaymentMonth = checkIsPaymentMonth(t - ifArrears, paymentsPerYear);

    // const isRentalOver = index > 0 && (closingBalance[index - 1] - netCashflow) > 0;

    const currentCashflow = isPaymentMonth ? netCashflow : 0;
    monthlyRental.push(isRentalOver ? 0 : currentCashflow);

    const interestForPeriod =
      (periodPvOfLiability - currentCashflow) *
      (incrementalBorrowingMonthlyRate / 100);
    interestForPeriods.push(
      isRentalOver ? 0 : interestForPeriod > 0 ? interestForPeriod : 0,
    );

    const periodClosingBalance =
      periodPvOfLiability - currentCashflow + interestForPeriod;
    closingBalance.push(
      isRentalOver ? 0 : periodClosingBalance > 0 ? periodClosingBalance : 0,
    );
    periodPvOfLiability = isRentalOver ? 0 : periodClosingBalance;

    isRentalOver = index > 0 && interestForPeriods[index] <= 0;
  });

  console.log("monthlyRental:: ", monthlyRental);
  return { pvOfLiability, monthlyRental, interestForPeriods, closingBalance };
};

export const getRightOfUseAssetAmortisation = (
  paymentPeriods: number[],
  leaseLiabilityInitialApplication: number,
  rentalLegalFees: number,
): {
  cost: number[];
  depreciation: number[];
  accumulatedDepreciation: number[];
  closingBalance: number[];
} => {
  let periodsCount = paymentPeriods.length;
  const calculatedCost = leaseLiabilityInitialApplication + rentalLegalFees;
  const periodDepreciation = calculatedCost / periodsCount;
  const cost = Array(periodsCount).fill(calculatedCost);
  const depreciation = Array(periodsCount).fill(periodDepreciation);
  let accumulatedDepreciation: number[] = [];
  let closingBalance: number[] = [];
  let runningAccumulated = 0;

  paymentPeriods.forEach(() => {
    runningAccumulated += periodDepreciation;

    accumulatedDepreciation.push(runningAccumulated);
    closingBalance.push(calculatedCost - runningAccumulated);
  });

  return { cost, depreciation, accumulatedDepreciation, closingBalance };
};

// utils/formatters.ts (or wherever you keep helpers)
export const formatAccounting = (value: number): string => {
  if (!value || value === 0) return "-";

  // Formats with commas, no decimals
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(value));

  return value < 0 ? `(${formatted})` : formatted;
};
