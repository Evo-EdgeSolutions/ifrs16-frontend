import { roundNumber } from "@/src/helpers/round";
import {
  AssetRow,
  Ifrs16Inputs,
  Ifrs16Outputs,
  LiabilityRow,
  PaymentsPerYearMap,
} from "./schema";
import {
  calculateLeaseTermInYears,
  calculatePresentValueSchedule,
  getLeaseLiabilityAmortisation,
  getLeasePaymentPeriod,
  getRightOfUseAssetAmortisation,
} from "./utils";


export const calculateIfrs16 = async (
  data: Ifrs16Inputs,
): Promise<Ifrs16Outputs> => {
  console.log("Processing inputs:", data);
  try {
    const leaseTermYears = roundNumber(
      calculateLeaseTermInYears(data.contractStartDate, data.contractEndDate),
    );

    // console.log("leaseTermYears:: ", leaseTermYears);

    const perTermRental = data.totalRental / leaseTermYears;

    const paymentsPerYear =
      PaymentsPerYearMap[data.advanceInMonthlyInstallments] || 4;

      // console.log('paymentsPerYear:: ',paymentsPerYear)

    const incrementalBorrowingMonthlyRate = roundNumber(data.incrementalBorrowingRate / 12);
    // console.log('incrementalBorrowingMonthlyRate:: ',incrementalBorrowingMonthlyRate)
    const monthlyRental = perTermRental / paymentsPerYear;
    // console.log('monthlyRental: ',monthlyRental)
    const advanceDeduction = 0;

    const leasePaymentPeriods = getLeasePaymentPeriod(
      data.contractStartDate,
      leaseTermYears,
      data.paymentTiming,
    );
    // console.log('leasePaymentPeriods:: ',leasePaymentPeriods)

    const netCashflow = monthlyRental - advanceDeduction;
    const paymentPeriods = leasePaymentPeriods.periods;

    const presentValueSchedule = calculatePresentValueSchedule(
      paymentPeriods,
      incrementalBorrowingMonthlyRate,
      netCashflow,
      paymentsPerYear,
      data.paymentTiming
    );

    const rawLeaseLiabilityInitial = presentValueSchedule.presentValues.reduce(
      (sum, pv) => sum + pv,
      0,
    );

    const leaseLiabilityAmortisation = getLeaseLiabilityAmortisation(
      paymentPeriods,
      rawLeaseLiabilityInitial,
      netCashflow,
      incrementalBorrowingMonthlyRate,
      paymentsPerYear,
      data.paymentTiming
    );

    const rawTotalInterest =
      leaseLiabilityAmortisation.interestForPeriods.reduce(
        (sum, i) => sum + i,
        0,
      );

    const rightOfUseAssetAmortisation = getRightOfUseAssetAmortisation(
      paymentPeriods,
      rawLeaseLiabilityInitial,
      data.initialDirectCosts
    );

    const liabilitySchedule: LiabilityRow[] = paymentPeriods.map(
      (period, index) => ({
        period: period,
        monthEnd: leasePaymentPeriods.month_end[index],
        pvOfLiability: leaseLiabilityAmortisation.pvOfLiability[index],
        monthlyRent: -leaseLiabilityAmortisation.monthlyRental[index],
        interest: leaseLiabilityAmortisation.interestForPeriods[index],
        closingBalance: leaseLiabilityAmortisation.closingBalance[index],
      }),
    );

    const assetSchedule: AssetRow[] = paymentPeriods.map((period, index) => ({
      period: period,
      monthEnd: leasePaymentPeriods.month_end[index],
      cost: rightOfUseAssetAmortisation.cost[index],
      depreciation: rightOfUseAssetAmortisation.depreciation[index],
      accumulatedDepreciation:
        rightOfUseAssetAmortisation.accumulatedDepreciation[index],
      closingBalance: rightOfUseAssetAmortisation.closingBalance[index],
    }));

    // FINAL OUTPUT
    return {
      rouAsset: roundNumber(rawLeaseLiabilityInitial + data.initialDirectCosts),
      pvOfCashFlows: roundNumber(rawLeaseLiabilityInitial),
      leaseLiability: roundNumber(leaseLiabilityAmortisation.closingBalance[0]),
      totalInterest: roundNumber(rawTotalInterest),
      liabilitySchedule, // Add to return
      assetSchedule, // Add to return
      totalRental:data.totalRental,
      initialDirectCosts:data.initialDirectCosts
    };
  } catch (error) {
    console.error("Failed to calculate IFRS 16 values:", error);
    throw new Error(
      `Calculation failed: ${error instanceof Error ? error.message : "Check input parameters."}`,
    );
  }
};
