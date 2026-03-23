"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ifrs16Schema,
  Ifrs16Inputs,
  PAYMENT_TIMING,
  INSTALLMENTS_TYPES,
} from "../../schema";
import { useCalcStore } from "../../store";

import styles from "./CalcForm.module.scss";
import { InputField } from "@/src/components/ui/InputField/InputField";
import { Heading } from "@/src/components/ui/Heading/Heading";
import { DatePickerField } from "@/src/components/ui/DatePickerField/DatePickerField";
import { SelectField } from "@/src/components/ui/SelectField/SelectField";
import { Button } from "@/src/components/ui/Button/Button";

export const CalcForm = () => {
  const calculate = useCalcStore((state) => state.calculate);
  const isCalculating = useCalcStore((state) => state.isCalculating);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Ifrs16Inputs>({
    resolver: zodResolver(ifrs16Schema),
    defaultValues: {
      contractDate: new Date("2026-01-01T00:00:00"),
      commencementDate: new Date("2026-01-01T00:00:00"),
      endDate: new Date("2028-01-01T00:00:00"),
      totalRental: 600000,
      advanceInMonthlyInstallments: "quarterly",
      rentalLegalFees: 10000,
      incrementalBorrowingRate: 9.96,
      paymentTiming: "advance",
    },
  });

  const onSubmit = (data: Ifrs16Inputs) => {
    calculate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <Heading level="h3">Lease Parameters</Heading>

      {/* We use a grid utility class here (add to your SCSS) to place inputs side-by-side */}
      <div className={styles.inputGrid}>
        {/* --- DATES --- */}
        <Controller
          control={control}
          name="contractDate"
          render={({ field }) => (
            <DatePickerField
              label="Contract Date"
              selected={field.value}
              onChange={field.onChange}
              error={errors.contractDate?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="commencementDate"
          render={({ field }) => (
            <DatePickerField
              label="Commencement Date"
              selected={field.value}
              onChange={field.onChange}
              error={errors.commencementDate?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="endDate"
          render={({ field }) => (
            <DatePickerField
              label="End Date"
              selected={field.value}
              onChange={field.onChange}
              error={errors.endDate?.message}
            />
          )}
        />

        {/* --- FINANCIALS --- */}
        <InputField
          label="Total Rental"
          type="number"
          step="0.01"
          {...register("totalRental", { valueAsNumber: true })}
          error={errors.totalRental?.message}
        />
        <SelectField
          label="Advance in monthly Installments"
          options={[...INSTALLMENTS_TYPES]}
          {...register("advanceInMonthlyInstallments")}
          error={errors.advanceInMonthlyInstallments?.message}
        />
        <InputField
          label="Rental Legal Fees"
          type="number"
          step="0.01"
          {...register("rentalLegalFees", { valueAsNumber: true })}
          error={errors.rentalLegalFees?.message}
        />

        {/* --- RATES & SELECTORS --- */}
        <InputField
          label="Borrowing Rate (%)"
          type="number"
          step="0.01"
          {...register("incrementalBorrowingRate", { valueAsNumber: true })}
          error={errors.incrementalBorrowingRate?.message}
        />

        <SelectField
          label="Payment Timing"
          options={[...PAYMENT_TIMING]}
          {...register("paymentTiming")}
          error={errors.paymentTiming?.message}
        />
      </div>

      <Button
        type="submit"
        isLoading={isCalculating}
        style={{ marginTop: "1rem" }}
      >
        Calculate IFRS 16
      </Button>
    </form>
  );
};
