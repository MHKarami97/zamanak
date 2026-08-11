import Link from "next/link";
import { CalendarDays, CheckCircle2, Clock3, Coffee, Edit3, Circle } from "lucide-react";

import { StatusBadge } from "@/components/common/status-badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { duration, jalali } from "@/lib/format";
import { getHolidayInfo } from "@/lib/holidays";
import { getRecordStatus } from "@/lib/record-health";
import { calc } from "@/lib/time-engine";
import type { AppData } from "@/lib/types";
import { getDailyTargetMinutes } from "@/lib/work-schedule";

export function MonthDayDetails({ data, selectedDate }: { data: AppData; selectedDate: string }) {
  const stored = data.records[selectedDate];
  const leave = data.leaves.find((item) => item.startDate <= selectedDate && item.endDate >= selectedDate);
  const holiday = getHolidayInfo(selectedDate, {
    mode: data.settings.mode,
    manualHoliday: stored?.holiday,
    includeOfficialHolidays: data.settings.autoOfficialHolidays,
    includeWeeklyHoliday: data.settings.autoWeeklyHoliday,
    overrides: data.holidayOverrides,
  });
  const record = stored ? { ...stored, holiday: holiday.isHoliday } : null;
  const target = holiday.isHoliday ? 0 : getDailyTargetMinutes(selectedDate, data.settings);
  const result = record ? calc(record, target) : null;
  const health = record ? getRecordStatus(record) : null;

  const dayTasks = data.dailyTasks?.[selectedDate] || [];
  const completedCount = dayTasks.filter(t => t.isCompleted).length;
  const incompleteCount = dayTasks.length - completedCount;

  return (
    <article className="dashboard-card rounded-[var(--card-radius)] border border-[var(--dashboard-border)] p-4 shadow-[0_6px_20px_rgba(0,0,0,.035)] sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="mb-1 flex items-center gap-2 text-sm font-extrabold text-[var(--text)]">
            <CalendarDays className="size-4 text-[var(--accent-strong)]" />
            جزئیات روز انتخاب‌شده
          </div>
          <strong className="text-base font-black text-[var(--text)]">
            {jalali(selectedDate, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </strong>
          <div className="mt-2 flex flex-wrap gap-2">
            {holiday.isHoliday && <StatusBadge success={false}>{holiday.title || "روز تعطیل"}</StatusBadge>}
            {leave && <span className="rounded-full bg-[var(--info-soft)] px-2.5 py-1 text-[10px] font-bold text-[var(--info)]">مرخصی ثبت‌شده</span>}
            {health && <StatusBadge success={health.state === "complete"}>{health.label}</StatusBadge>}
          </div>
        </div>
        <Button asChild>
          <Link href={`/today?date=${selectedDate}`}>
            <Edit3 className="size-4" /> ویرایش روز
          </Link>
        </Button>
      </div>

      {result && (
        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1 rounded-xl bg-[var(--surface-2)] p-3 border border-[var(--dashboard-border)]">
            <span className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]"><Clock3 className="size-3.5"/> کارکرد خالص</span>
            <strong className="text-sm font-bold text-[var(--text)]">{duration(result.worked)}</strong>
          </div>
          <div className="flex flex-col gap-1 rounded-xl bg-[var(--surface-2)] p-3 border border-[var(--dashboard-border)]">
            <span className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)]"><Coffee className="size-3.5"/> وقفه و ناهار</span>
            <strong className="text-sm font-bold text-[var(--text)]">{duration(result.breakMinutes + (record?.lunchMinutes ?? 0))}</strong>
          </div>
          <div className="col-span-full flex items-center justify-between rounded-xl bg-[var(--surface-2)] p-3 border border-[var(--dashboard-border)]">
            <span className="text-xs font-semibold text-[var(--text-muted)]">تراز روزانه نسبت به هدف ({duration(target)})</span>
            <strong className={result.balance >= 0 ? "text-[var(--success)]" : "text-[var(--danger)]"} dir="ltr">
              {duration(result.balance, true)}
            </strong>
          </div>
        </div>
      )}

      {dayTasks.length > 0 && (
        <div className="border-t border-[var(--dashboard-border)] pt-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-xs font-bold text-[var(--text)]">وظایف و یادداشت‌های این روز</h3>
            <div className="flex gap-2 text-[10px] font-semibold">
              <span className="rounded-md bg-[var(--success-soft)] px-2 py-1 text-[var(--success)]">{completedCount} انجام‌شده</span>
              {incompleteCount > 0 && <span className="rounded-md bg-[var(--danger-soft)] px-2 py-1 text-[var(--danger)]">{incompleteCount} ناتمام</span>}
            </div>
          </div>

          <ul className="grid gap-2">
            {dayTasks.map(task => (
              <li key={task.id} className="flex items-start gap-2.5 rounded-lg border border-[var(--dashboard-border)] bg-[var(--surface-1)] p-2.5 text-[11px] text-[var(--text-muted)] transition-colors hover:bg-[var(--surface-2)]">
                <span className="mt-0.5 shrink-0">
                  {task.isCompleted
                    ? <CheckCircle2 className="size-4 text-[var(--success)]" />
                    : <Circle className="size-4 text-[var(--warning)]" />}
                </span>
                <div className={cn("min-w-0 flex-1", task.isCompleted && "opacity-70")}>
                  <strong className={cn("block font-semibold text-[var(--text)]", task.isCompleted && "line-through")}>
                    {task.title}
                  </strong>
                  {task.description && <span className="mt-1 block text-[10px] leading-relaxed">{task.description}</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
