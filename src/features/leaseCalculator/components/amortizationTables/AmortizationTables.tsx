// components/AmortizationTables.tsx
"use client";

import React from "react";
import styles from "./AmortizationTables.module.scss"; // You'll need to create this for the side-by-side grid
import { Table, TableColumn } from "@/src/components/ui/Table/Table";
import { Heading } from "@/src/components/ui/Heading/Heading";
import { useCalcStore } from "../../store";
import { AssetRow, LiabilityRow } from "../../schema";
import { formatAccounting } from "../../utils";

export const AmortizationTables = () => {
  const result = useCalcStore((state) => state.result);

  if (!result) return null;

  // Define Columns for Liability Table
  const liabilityColumns: TableColumn<LiabilityRow>[] = [
    { header: "Period", accessor: "period" },
    { header: "Month end", accessor: "monthEnd" },
    {
      header: "PV of Liability ($)",
      accessor: "pvOfLiability",
      render: (row) => formatAccounting(row.pvOfLiability),
    },
    {
      header: "Monthly Rent ($)",
      accessor: "monthlyRent",
      render: (row) => formatAccounting(row.monthlyRent),
    },
    {
      header: "Interest ($)",
      accessor: "interest",
      render: (row) => formatAccounting(row.interest),
    },
    {
      header: "Closing Balance ($)",
      accessor: "closingBalance",
      render: (row) => formatAccounting(row.closingBalance),
    },
  ];

  // Define Columns for Asset Table
  const assetColumns: TableColumn<AssetRow>[] = [
    { header: "Period", accessor: "period" },
    { header: "Month end", accessor: "monthEnd" },
    {
      header: "Cost ($)",
      accessor: "cost",
      render: (row) => formatAccounting(row.cost),
    },
    {
      header: "Depreciation ($)",
      accessor: "depreciation",
      render: (row) => formatAccounting(row.depreciation),
    },
    {
      header: "Accumulated depreciation ($)",
      accessor: "accumulatedDepreciation",
      render: (row) => formatAccounting(row.accumulatedDepreciation),
    },
    {
      header: "Closing Balance ($)",
      accessor: "closingBalance",
      render: (row) => formatAccounting(row.closingBalance),
    },
  ];

  return (
    <div className={styles.tablesWrapper}>
      <div className={styles.tableSection}>
        <Heading level="h3">Lease liability amortisation</Heading>
        <Table columns={liabilityColumns} data={result.liabilitySchedule} />
      </div>
      <div className={styles.tableSection}>
        <Heading level="h3">Right of use asset amortisation</Heading>
        <Table columns={assetColumns} data={result.assetSchedule} />
      </div>
    </div>
  );
};
