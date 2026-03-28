"use client";

import React from "react";
import styles from "./CalcJournalEntries.module.scss";
import { Table, TableColumn } from "@/src/components/ui/Table/Table";
import { Heading } from "@/src/components/ui/Heading/Heading";
import { LedgerRow } from "../../schema";
import { useCalcStore } from "../../store";

const formatMoney = (val: number | null) => {
  if (val === null || val === undefined) return "";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
};

export const CalcJournalEntries = () => {
  const result = useCalcStore((state) => state.result);

  if (!result) return null;

  const formattedDate = new Date(result.assetSchedule[0].monthEnd)
    .toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
    .replace(" ", "-");

  const getColumns = (headerTitle: string): TableColumn<LedgerRow>[] => [
    { header: "Month", accessor: "month" },
    {
      header: headerTitle,
      accessor: "description",
      render: (row) => (
        <span
          style={{
            fontWeight: row.isHeader ? 700 : 400,
            color: row.isHeader ? "#3b82f6" : "inherit", // Highlight the entry titles
            paddingLeft: row.isCredit ? "2rem" : "0", // Indent credit accounts
            display: "block",
          }}
        >
          {row.description}
        </span>
      ),
    },
    {
      header: "DR",
      accessor: "dr",
      render: (row) => {
        const formattedValue = formatMoney(row.dr);
        return formattedValue ? `$${formattedValue}` : "";
      },
    },
    {
      header: "CR",
      accessor: "cr",
      render: (row) => {
        const formattedValue = formatMoney(row.cr);
        return formattedValue ? `$${formattedValue}` : "";
      },
    },
  ];

  // 3. Flattened Dummy Data
  const glData: LedgerRow[] = [
    {
      id: "gl-h1",
      month: formattedDate,
      description: "Initial Recognition of Lease",
      dr: null,
      cr: null,
      isHeader: true,
      isCredit: false,
    },
    {
      id: "gl-l1",
      month: "",
      description: "Right-of-Use Asset (ROU Asset)",
      dr: Number(result?.rouAsset),
      cr: null,
      isHeader: false,
      isCredit: false,
    },
    {
      id: "gl-l2",
      month: "",
      description: "Lease Liability",
      dr: null,
      cr: Number(result?.rouAsset),
      isHeader: false,
      isCredit: true,
    },

    {
      id: "gl-h2",
      month: formattedDate,
      description: "Depreciation of ROU Asset",
      dr: null,
      cr: null,
      isHeader: true,
      isCredit: false,
    },
    {
      id: "gl-l3",
      month: "",
      description: "Depreciation Expense",
      dr: Number(result?.assetSchedule[0].depreciation),
      cr: null,
      isHeader: false,
      isCredit: false,
    },
    {
      id: "gl-l4",
      month: "",
      description: "Accumulated Depreciation",
      dr: null,
      cr: Number(result?.assetSchedule[0].depreciation),
      isHeader: false,
      isCredit: true,
    },

    {
      id: "gl-h3",
      month: formattedDate,
      description: "Interest on Lease Liability",
      dr: null,
      cr: null,
      isHeader: true,
      isCredit: false,
    },
    {
      id: "gl-l5",
      month: "",
      description: "Interest Expense",
      dr: Number(result?.liabilitySchedule[0].interest),
      cr: null,
      isHeader: false,
      isCredit: false,
    },
    {
      id: "gl-l6",
      month: "",
      description: "Lease Liability",
      dr: null,
      cr: Number(result?.liabilitySchedule[0].interest),
      isHeader: false,
      isCredit: true,
    },
    {
      id: "gl-h4",
      month: formattedDate,
      description: "Lease Payment",
      dr: null,
      cr: null,
      isHeader: true,
      isCredit: false,
    },
    {
      id: "gl-l7",
      month: "",
      description: "Lease Liability",
      dr: Number(result?.liabilitySchedule[0].monthlyRent) * -1,
      cr: null,
      isHeader: false,
      isCredit: false,
    },
    {
      id: "gl-l8",
      month: "",
      description: "Cash/Bank",
      dr: null,
      cr: Number(result?.liabilitySchedule[0].monthlyRent) * -1,
      isHeader: false,
      isCredit: true,
    },

     {
      id: "gl-z4",
      month: formattedDate,
      description: "Direct Cost recognition",
      dr: null,
      cr: null,
      isHeader: true,
      isCredit: false,
    },
    {
      id: "gl-k7",
      month: "",
      description: "ROU Asset",
      dr: Number(result?.initialDirectCosts),
      cr: null,
      isHeader: false,
      isCredit: false,
    },
    {
      id: "gl-z8",
      month: "",
      description: "Cash/Bank",
      dr: null,
      cr: Number(result?.initialDirectCosts),
      isHeader: false,
      isCredit: true,
    },
  ];

  const apData: LedgerRow[] = [
    {
      id: "ap-h1",
      month: formattedDate,
      description: "Initial issuance of Cheques",
      dr: null,
      cr: null,
      isHeader: true,
      isCredit: false,
    },
    {
      id: "ap-l1",
      month: "",
      description: "Post dated cheques - Account",
      dr: Number(result?.totalRental),
      cr: null,
      isHeader: false,
      isCredit: false,
    },
    {
      id: "ap-l2",
      month: "",
      description: "Evoedge Solutions - Supplier",
      dr: null,
      cr: Number(result?.totalRental),
      isHeader: false,
      isCredit: true,
    },

    {
      id: "ap-h2",
      month: formattedDate,
      description: "Lease Payment",
      dr: null,
      cr: null,
      isHeader: true,
      isCredit: false,
    },
    {
      id: "ap-l3",
      month: "",
      description: "Evoedge Solutions - Supplier",
      dr: Number(result?.liabilitySchedule[0].monthlyRent) * -1,
      cr: null,
      isHeader: false,
      isCredit: false,
    },
    {
      id: "ap-l4",
      month: "",
      description: "Post dated cheques - Account",
      dr: null,
      cr: Number(result?.liabilitySchedule[0].monthlyRent) * -1,
      isHeader: false,
      isCredit: true,
    },
  ];

  return (
    <div className={styles.ledgerContainer}>
      <Heading level="h3">Journal Entries (First Month)</Heading>

      <div className={styles.tablesWrapper}>
        <div className={styles.tableBlock}>
          <Table columns={getColumns("GENERAL LEDGER")} data={glData} />
        </div>

        <div className={styles.tableBlock}>
          <Table columns={getColumns("ACCOUNTS PAYABLE")} data={apData} />
        </div>
      </div>
    </div>
  );
};
