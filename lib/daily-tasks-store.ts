import { z } from "zod";

export type DailyTaskStatus = "open" | "done";

export type DailyTask = {
  id: string;
  date: string;
  title: string;
  plannedMinutes: number | null;
  description: string;
  status: DailyTaskStatus;
  createdAt: string;
  completedAt: string | null;
};

export const dailyTaskSchema = z.object({
  id: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  title: z.string().min(1).max(200),
  plannedMinutes: z.number().int().min(0).max(24 * 60).nullable(),
  description: z.string().max(2000),
  status: z.union([z.literal("open"), z.literal("done")]),
  createdAt: z.string(),
  completedAt: z.string().nullable(),
});

const DB_NAME = "zamaanak-tasks-db";
const DB_VERSION = 1;
const STORE_NAME = "daily-tasks";

function isBrowser(): boolean {
  return typeof indexedDB !== "undefined";
}

function openTasksDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) {
      reject(new Error("IndexedDB is not available in this environment."));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("byDate", "date", { unique: false });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open zamaanak-tasks-db."));
  });
}

async function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openTasksDb();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, mode);
      const store = tx.objectStore(STORE_NAME);
      const request = run(store);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed."));
    });
  } finally {
    db.close();
  }
}

export async function listAllDailyTasks(): Promise<DailyTask[]> {
  try {
    const raw = await withStore<DailyTask[]>("readonly", (store) => store.getAll() as IDBRequest<DailyTask[]>);
    return raw
      .map((item) => dailyTaskSchema.safeParse(item))
      .filter((result): result is { success: true; data: DailyTask } => result.success)
      .map((result) => result.data)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  } catch {
    return [];
  }
}

export async function saveDailyTask(task: DailyTask): Promise<void> {
  const parsed = dailyTaskSchema.parse(task);
  await withStore<IDBValidKey>("readwrite", (store) => store.put(parsed));
}

export async function deleteDailyTask(id: string): Promise<void> {
  await withStore<undefined>("readwrite", (store) => store.delete(id) as IDBRequest<undefined>);
}

export function createQuickTask(title: string, date: string): DailyTask {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    date,
    title: title.trim(),
    plannedMinutes: null,
    description: "",
    status: "open",
    createdAt: now,
    completedAt: null,
  };
}

export function createDetailedTask(input: {
  title: string;
  date: string;
  hours: number;
  minutes: number;
  description: string;
}): DailyTask {
  const now = new Date().toISOString();
  const totalMinutes = Math.max(0, Math.round(input.hours) * 60 + Math.round(input.minutes));
  return {
    id: crypto.randomUUID(),
    date: input.date,
    title: input.title.trim(),
    plannedMinutes: totalMinutes > 0 ? totalMinutes : null,
    description: input.description.trim(),
    status: "open",
    createdAt: now,
    completedAt: null,
  };
}

export function toggleTaskStatus(task: DailyTask): DailyTask {
  const isDone = task.status === "done";
  return {
    ...task,
    status: isDone ? "open" : "done",
    completedAt: isDone ? null : new Date().toISOString(),
  };
}

export function formatPlannedMinutes(minutes: number | null): string {
  if (minutes === null) return "بدون زمان‌بندی";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins} دقیقه`;
  if (mins === 0) return `${hours} ساعت`;
  return `${hours} ساعت و ${mins} دقیقه`;
}

export function todayDateKey(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function shiftDateKey(dateKey: string, deltaDays: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, (m ?? 1) - 1, d ?? 1);
  date.setDate(date.getDate() + deltaDays);
  const ny = date.getFullYear();
  const nm = String(date.getMonth() + 1).padStart(2, "0");
  const nd = String(date.getDate());
  return `${ny}-${nm}-${nd}`;
}

export function monthKeyOf(dateKey: string): string {
  return dateKey.slice(0, 7);
}
