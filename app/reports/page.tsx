"use client";

import { ReportsPage } from "@/components/pages/reports/reports-page";
import { useZamaanakContext } from "@/components/zamaanak-shell";

export default function ReportsRoute() {
  const controller = useZamaanakContext();
  if (!controller.ready) return null;

  return (
    <ReportsPage
      data={controller.data}
      monthRecords={controller.filteredMonthRecords}
      monthStats={controller.monthStats}
      filters={controller.reportFilter}
      setFilters={controller.setReportFilter}
      entries={controller.filteredEntries}
      reportBillable={controller.reportBillable}
      reportIncome={controller.reportIncome}
      exportReport={controller.exportReport}
      financialsHidden={controller.financialsHidden}
    />
  );
}
