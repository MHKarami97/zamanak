"use client";

import { LeavePage } from "@/components/pages/leave/leave-page";
import { useZamaanakContext } from "@/components/zamaanak-shell";

export default function LeaveRoute() {
  const controller = useZamaanakContext();
  if (!controller.ready) return null;

  return (
    <LeavePage
      data={controller.data}
      setData={controller.setData}
      draft={controller.leaveDraft}
      setDraft={controller.setLeaveDraft}
      saveLeave={controller.saveLeave}
      used={controller.usedLeave}
      available={controller.leaveAvailable}
      summary={controller.leaveSummary}
    />
  );
}
