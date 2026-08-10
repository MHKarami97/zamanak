"use client";

import { LeavePage } from "@/components/pages/leave/leave-page";
import { usezamaanakContext } from "@/components/zamaanak-shell";

export default function LeaveRoute() {
  const controller = usezamaanakContext();
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
