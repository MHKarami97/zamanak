"use client";

import { MonthPage } from "@/components/pages/month/month-page";
import { useZamaanakContext } from "@/components/zamaanak-shell";

export default function MonthRoute() {
  const controller = useZamaanakContext();
  if (!controller.ready) return null;

  return (
    <MonthPage
      data={controller.data}
      selectedDate={controller.selectedDate}
      setSelectedDate={controller.setSelectedDate}
      monthRecords={controller.monthRecords}
      monthStats={controller.monthStats}
    />
  );
}
