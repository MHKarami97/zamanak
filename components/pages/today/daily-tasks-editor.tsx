"use client";

import { useState, KeyboardEvent } from "react";
import { AlignLeft, CheckCircle2, Circle, ArrowDownToLine, Trash2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { SurfaceCard } from "@/components/common/surface-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { DailyTask } from "@/lib/types";

type DailyTasksEditorProps = {
  date: string;
  mode: string;
  tasks: DailyTask[];
  previousIncompleteTasks?: DailyTask[];
  onTasksChange: (tasks: DailyTask[]) => void;
  onMigrateTasks: (tasksToMigrate: DailyTask[]) => void;
};

export function DailyTasksEditor({
                                   date,
                                   mode,
                                   tasks = [],
                                   previousIncompleteTasks = [],
                                   onTasksChange,
                                   onMigrateTasks
                                 }: DailyTasksEditorProps) {
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDesc, setDraftDesc] = useState("");
  const [showDesc, setShowDesc] = useState(false);

  // در حالت فریلنسری نیازی به این بخش نیست
  if (mode === "freelancer") return null;

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && draftTitle.trim()) {
      e.preventDefault();
      const newTask: DailyTask = {
        id: crypto.randomUUID(),
        date,
        title: draftTitle.trim(),
        description: draftDesc.trim() || undefined,
        isCompleted: false,
        createdAt: new Date().toISOString(),
      };
      onTasksChange([...tasks, newTask]);
      setDraftTitle("");
      setDraftDesc("");
      setShowDesc(false);
    }
  };

  const toggleTask = (id: string) => {
    onTasksChange(tasks.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const deleteTask = (id: string) => {
    onTasksChange(tasks.filter(t => t.id !== id));
  };

  return (
    <SurfaceCard as="section" className="mb-5 p-4 sm:p-5">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[var(--accent-strong)]">
          <CheckCircle2 className="size-5" />
          <h2 className="text-sm font-black text-[var(--text)]">یادداشت و وظایف امروز</h2>
        </div>
        {previousIncompleteTasks.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-[10px]"
            onClick={() => onMigrateTasks(previousIncompleteTasks)}
          >
            <ArrowDownToLine className="ml-1 size-3.5" />
            انتقال ({previousIncompleteTasks.length}) کار ناتمام روز قبل
          </Button>
        )}
      </header>

      {/* Input Area */}
      <div className="mb-4 grid gap-2 rounded-xl border border-[var(--dashboard-border)] bg-[var(--surface-2)] p-2 transition-all focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--accent-soft)]">
        <div className="flex items-center gap-2">
          <Input
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="وظیفه جدید... (Enter برای ثبت)"
            className="border-0 bg-transparent px-2 text-xs shadow-none focus-visible:ring-0"
          />
          <button
            type="button"
            onClick={() => setShowDesc(!showDesc)}
            className={cn("rounded-lg p-2 transition-colors", showDesc ? "bg-[var(--accent-soft)] text-[var(--accent-strong)]" : "text-[var(--text-muted)] hover:bg-[var(--surface-1)]")}
          >
            <AlignLeft className="size-4" />
          </button>
        </div>

        {showDesc && (
          <div className="border-t border-[var(--border)] px-2 pb-1 pt-2">
            <Input
              value={draftDesc}
              onChange={(e) => setDraftDesc(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="توضیحات تکمیلی (اختیاری)"
              className="h-8 border-0 bg-transparent text-[10px] text-[var(--text-muted)] shadow-none focus-visible:ring-0"
            />
          </div>
        )}
      </div>

      {/* Task List */}
      {tasks.length > 0 ? (
        <ul className="grid gap-2">
          {tasks.map(task => (
            <li
              key={task.id}
              className={cn(
                "group flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-[var(--surface-2)]",
                task.isCompleted && "opacity-60"
              )}
            >
              <button type="button" onClick={() => toggleTask(task.id)} className="mt-0.5 shrink-0 text-[var(--accent)]">
                {task.isCompleted ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
              </button>
              <div className="min-w-0 flex-1 cursor-pointer" onClick={() => toggleTask(task.id)}>
                <span className={cn("block text-xs font-semibold text-[var(--text)] transition-all", task.isCompleted && "line-through text-[var(--text-muted)]")}>
                  {task.title}
                </span>
                {task.description && (
                  <p className="mt-1 text-[10px] leading-relaxed text-[var(--text-muted)]">
                    {task.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => deleteTask(task.id)}
                className="rounded p-1 text-[var(--danger)] opacity-0 transition-all hover:bg-[var(--danger-soft)] group-hover:opacity-100"
              >
                <Trash2 className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-2 text-center text-[10px] text-[var(--text-muted)]">هیچ وظیفه‌ای برای امروز ثبت نشده است.</p>
      )}
    </SurfaceCard>
  );
}
