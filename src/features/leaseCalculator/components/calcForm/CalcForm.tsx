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
      advanceInMonthlyInstallments: "quarterly",
      paymentTiming: "advance",
      // contractStartDate: new Date("2026-01-01T00:00:00"),
      // contractEndDate: new Date("2028-01-01T00:00:00"),
      // totalRental: 600000,
      // initialDirectCosts: 10000,
      // incrementalBorrowingRate: 0,
    },
  });

  const onSubmit = (data: Ifrs16Inputs) => {
    calculate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.formContainer}>
      <Heading level="h3">Lease Calculation Inputs</Heading>

      {/* We use a grid utility class here (add to your SCSS) to place inputs side-by-side */}
      <div className={styles.inputGrid}>
        {/* --- DATES --- */}
        <Controller
          control={control}
          name="contractStartDate"
          render={({ field }) => (
            <DatePickerField
              label="Contract Start Date"
              selected={field.value}
              onChange={field.onChange}
              error={errors.contractStartDate?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="contractEndDate"
          render={({ field }) => (
            <DatePickerField
              label="Contract End Date"
              selected={field.value}
              onChange={field.onChange}
              error={errors.contractEndDate?.message}
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
          label="Initial Direct Costs"
          type="number"
          step="0.01"
          {...register("initialDirectCosts", { valueAsNumber: true })}
          error={errors.initialDirectCosts?.message}
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
