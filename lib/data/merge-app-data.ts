import type {AppData, DailyTask} from "../types.ts";
import { createCompleteAppData } from "./app-data-factory.ts";

function mergeById<T extends { id: string }>(current: T[], incoming: T[]) {
  const existingIds = new Set(current.map((item) => item.id));
  return [...current, ...incoming.filter((item) => !existingIds.has(item.id))];
}

export function mergeAppData(current: AppData, incoming: AppData): AppData {
  return createCompleteAppData({
    settings: { ...current.settings, ...incoming.settings },
    records: { ...current.records, ...incoming.records },
    leaves: mergeById(current.leaves, incoming.leaves),
    clients: mergeById(current.clients, incoming.clients),
    projects: mergeById(current.projects, incoming.projects),
    timeEntries: mergeById(current.timeEntries, incoming.timeEntries),
    expenses: mergeById(current.expenses, incoming.expenses),
    invoices: mergeById(current.invoices, incoming.invoices),
    holidayOverrides: mergeById(current.holidayOverrides, incoming.holidayOverrides),
    deletedRecords: mergeById(current.deletedRecords, incoming.deletedRecords),
    dailyTasks: mergeDailyTasks(current.dailyTasks, incoming.dailyTasks),
  });
}

function mergeDailyTasks(
  current: Record<string, DailyTask[]>,
  incoming: Record<string, DailyTask[]>,
): Record<string, DailyTask[]> {
  const dates = new Set([...Object.keys(current), ...Object.keys(incoming)]);
  const result: Record<string, DailyTask[]> = {};
  for (const date of dates) {
    const existingIds = new Set((current[date] ?? []).map((t) => t.id));
    result[date] = [
      ...(current[date] ?? []),
      ...(incoming[date] ?? []).filter((t) => !existingIds.has(t.id)),
    ];
  }
  return result;
}
