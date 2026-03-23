import { z } from "zod";

// We define the specific options for the payment timing selector
export const PAYMENT_TIMING = [
  { label: "In Advance (Beginning of Period)", value: "advance" },
  { label: "In Arrears (End of Period)", value: "arrears" },
] as const;

export const PaymentsPerYearMap: Record<string, number> = {
  "annually": 1,
  "semi-annually": 2,
  "quarterly": 4,
  "monthly": 12,
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
  isHeader: boolean;   // True if this row is an Entry Title
  isCredit: boolean;   // True if this row is a Credit Account
}

export const ifrs16Schema = z
  .object({
    // Dates
    contractDate: z.date({ message: "Contract date is required" }),
    commencementDate: z.date({ message: "Commencement date is required" }),
    endDate: z.date({ message: "End date is required" }),

    // Financials
    totalRental: z.number().min(0, "Rental cannot be negative"),
    rentalLegalFees: z.number().min(0, "Fees cannot be negative"),

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
  .refine((data) => data.endDate > data.commencementDate, {
    // Production-grade cross-field validation
    message: "End date must be after commencement date",
    path: ["endDate"], // Attaches the error to the endDate field
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
}
