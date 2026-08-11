"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/cn";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  type DailyTask,
  createDetailedTask,
  createQuickTask,
  deleteDailyTask,
  formatPlannedMinutes,
  listAllDailyTasks,
  monthKeyOf,
  saveDailyTask,
  shiftDateKey,
  todayDateKey,
  toggleTaskStatus,
} from "@/lib/daily-tasks-store";

type ViewMode = "day" | "month" | "reports";

const VIEW_LABELS: Record<ViewMode, string> = {
  day: "امروز",
  month: "ماه",
  reports: "گزارش‌ها",
};

function persianDateLabel(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y ?? 0, (m ?? 1) - 1, d ?? 1);
  return date.toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" });
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<ViewMode>("day");
  const [selectedDate, setSelectedDate] = useState(todayDateKey());
  const [quickTitle, setQuickTitle] = useState("");
  const [showDetailed, setShowDetailed] = useState(false);
  const [detailedTitle, setDetailedTitle] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [description, setDescription] = useState("");
  const [reportFrom, setReportFrom] = useState(shiftDateKey(todayDateKey(), -6));
  const [reportTo, setReportTo] = useState(todayDateKey());
  const [reportStatus, setReportStatus] = useState<"all" | "open" | "done">("all");
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    listAllDailyTasks()
      .then((items) => {
        if (!cancelled) setTasks(items);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function refresh() {
    setTasks(await listAllDailyTasks());
  }

  async function handleQuickAdd() {
    const title = quickTitle.trim();
    if (!title) return;
    const task = createQuickTask(title, selectedDate);
    await saveDailyTask(task);
    setQuickTitle("");
    await refresh();
  }

  async function handleDetailedAdd() {
    const title = detailedTitle.trim();
    if (!title) {
      setError("عنوان تسک را وارد کن.");
      return;
    }
    if (hours < 0 || minutes < 0 || minutes > 59) {
      setError("ساعت و دقیقه نامعتبر است.");
      return;
    }
    const task = createDetailedTask({ title, date: selectedDate, hours, minutes, description });
    await saveDailyTask(task);
    setDetailedTitle("");
    setHours(0);
    setMinutes(0);
    setDescription("");
    setShowDetailed(false);
    setError("");
    await refresh();
  }

  async function handleToggle(task: DailyTask) {
    await saveDailyTask(toggleTaskStatus(task));
    await refresh();
  }

  async function handleDelete(id: string) {
    await deleteDailyTask(id);
    await refresh();
  }

  const dayTasks = useMemo(
    () => tasks.filter((task) => task.date === selectedDate).sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [tasks, selectedDate],
  );

  const monthTasks = useMemo(() => {
    const key = monthKeyOf(selectedDate);
    const byDate = new Map<string, { open: number; done: number }>();
    for (const task of tasks) {
      if (monthKeyOf(task.date) !== key) continue;
      const entry = byDate.get(task.date) ?? { open: 0, done: 0 };
      if (task.status === "done") entry.done += 1;
      else entry.open += 1;
      byDate.set(task.date, entry);
    }
    return Array.from(byDate.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [tasks, selectedDate]);

  const reportTasks = useMemo(
    () =>
      tasks
        .filter((task) => task.date >= reportFrom && task.date <= reportTo)
        .filter((task) => reportStatus === "all" || task.status === reportStatus)
        .sort((a, b) => a.date.localeCompare(b.date)),
    [tasks, reportFrom, reportTo, reportStatus],
  );

  return (
    <div className={cn("mx-auto flex w_FULL max-w-3xl flex-col gap-6 p-4")} dir="rtl">
      {/* content omitted for brevity in this snippet */}
    </div>
  );
}
