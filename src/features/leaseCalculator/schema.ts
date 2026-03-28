import { z } from "zod";

// We define the specific options for the payment timing selector
export const PAYMENT_TIMING = [
  { label: "In Advance (Beginning of Period)", value: "advance" },
  { label: "In Arrears (End of Period)", value: "arrears" },
] as const;

export const PaymentsPerYearMap: Record<string, number> = {
  annually: 1,
  "semi-annually": 2,
  quarterly: 4,
  monthly: 12,
};

export interface LeasePaymentSchedule {
  periods: number[];
  month_end: string[];
}

export const INSTALLMENTS_TYPES = [
  { label: "Monthly", value: "monthly" },
  { label: "Quarterly", value: "quarterly" },
  { label: "Annually", value: "annually" },
] as const;

export interface LedgerRow {
  id: string;
  month: string;
  description: string; // Will hold either the Entry Title OR Account Name
  dr: number | null;
  cr: number | null;
  isHeader: boolean; // True if this row is an Entry Title
  isCredit: boolean; // True if this row is a Credit Account
}

export const ifrs16Schema = z
  .object({
    // Dates
    contractStartDate: z.date({ message: "Contract start date is required" }),
    contractEndDate: z.date({ message: "End date is required" }),

    // Financials
    totalRental: z.number().min(0, "Rental cannot be negative"),
    initialDirectCosts: z.number().min(0, "Fees cannot be negative"),

    // Rates
    incrementalBorrowingRate: z
      .number()
      .min(0, "Rate must be positive")
      .max(100, "Rate cannot exceed 100%"),

    // Selectors
    advanceInMonthlyInstallments: z.enum(["monthly", "quarterly", "annually"], {
      message: "Please select Installment",
    }),
    paymentTiming: z.enum(["advance", "arrears"], {
      message: "Please select payment timing",
    }),
  })
  .superRefine((data, ctx) => {
    // 1. Set up clean dates with no time zones/hours interfering
    const start = new Date(data.contractStartDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(data.contractEndDate);
    end.setHours(0, 0, 0, 0);

    // 2. FIRST CHECK: Is the end date before the start date?
    if (end < start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date cannot be earlier than the start date.",
        path: ["contractEndDate"],
      });
      return; // 🛑 Stop evaluating! We don't want to show the 1-year error too.
    }

    // 3. SECOND CHECK: 1-Year IFRS 16 Rule
    const minEndDate = new Date(start);
    minEndDate.setFullYear(minEndDate.getFullYear() + 1);
    minEndDate.setDate(minEndDate.getDate() - 1);

    if (end < minEndDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "The agreement is less than 1 year, Not qualified to recognize ROU asset.",
        path: ["contractEndDate"],
      });
    }
  });

export type Ifrs16Inputs = z.infer<typeof ifrs16Schema>;

export interface LiabilityRow {
  period: number;
  monthEnd: string;
  pvOfLiability: number;
  monthlyRent: number;
  interest: number;
  closingBalance: number;
}

export interface AssetRow {
  period: number;
  monthEnd: string;
  cost: number;
  depreciation: number;
  accumulatedDepreciation: number;
  closingBalance: number;
}

// We also define the exact shape of your expected output here
export interface Ifrs16Outputs {
  rouAsset: number;
  pvOfCashFlows: number;
  leaseLiability: number;
  totalInterest: number;
  liabilitySchedule: LiabilityRow[]; // <-- New
  assetSchedule: AssetRow[];
  totalRental: number;
  initialDirectCosts: number;
}
