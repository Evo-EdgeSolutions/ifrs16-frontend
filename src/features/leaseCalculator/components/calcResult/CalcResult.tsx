"use client";

import React from "react";
import styles from "./CalcResult.module.scss";
import { useCalcStore } from "../../store";
import { Heading } from "@/src/components/ui/Heading/Heading";

// Helper to format numbers cleanly as currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

export const CalcResult = () => {
  const result = useCalcStore((state) => state.result);
  const isCalculating = useCalcStore((state) => state.isCalculating);

  const metrics = [
    { id: "rou", label: "ROU Asset", value: result?.rouAsset },
    {
      id: "liability",
      label: "Lease Liability",
      value: result?.leaseLiability,
    },
    { id: "pv", label: "PV of Cash Flows", value: result?.pvOfCashFlows },
    { id: "interest", label: "Total Interest", value: result?.totalInterest },
  ];

  return (
    <div className={styles.resultContainer}>
      <Heading level="h3">Calculation Results</Heading>

      {isCalculating ? (
        <div className={styles.resultDisplay}>
          <span className={styles.pulse}>Calculating...</span>
        </div>
      ) : result ? (
        <div className={styles.metricsGrid}>
          {metrics.map((metric) => (
            <div key={metric.id} className={styles.metricCard}>
              {/* Swapped to your Heading component per your request */}
              <Heading level="h4" className={styles.metricLabel}>
                {metric.label}
              </Heading>
              <Heading
                level="h2"
                className={styles.metricValue}
                formatNumber
                decimals={0}
              >
                {/* {formatCurrency(metric.value || 0)} */}
                {metric.value !== undefined ? Math.trunc(metric.value) : 0}
              </Heading>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.resultDisplay}>
          <span className={styles.placeholder}>Awaiting input...</span>
        </div>
      )}
    </div>
  );
};
