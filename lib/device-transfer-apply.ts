import { createCompleteAppData } from "./data/app-data-factory.ts";
import type { DeviceTransferApplyOptions } from "./device-transfer-types.ts";
import type {AppData, DailyTask} from "./types.ts";

function mergeArray<T extends { id: string }>(local: T[], incoming: T[], preferIncoming: boolean): T[] {
  const result = new Map(local.map((item) => [item.id, item]));
  for (const item of incoming) {
    if (!result.has(item.id) || preferIncoming) result.set(item.id, item);
  }
  return [...result.values()];
}

export function applyDeviceTransfer(local: AppData, incoming: AppData, options: DeviceTransferApplyOptions): AppData {
  if (options.mode === "replace") return createCompleteAppData(incoming);

  const preferIncoming = options.conflicts === "use-incoming";
  const records = { ...local.records };
  for (const [date, record] of Object.entries(incoming.records)) {
    if (!records[date] || preferIncoming) records[date] = record;
  }

  const dailyTasks = mergeDailyTasksForTransfer(local.dailyTasks, incoming.dailyTasks, preferIncoming);

  return createCompleteAppData({
    settings: preferIncoming ? incoming.settings : local.settings,
    records,
    dailyTasks,
    leaves: mergeArray(local.leaves, incoming.leaves, preferIncoming),
    clients: mergeArray(local.clients, incoming.clients, preferIncoming),
    projects: mergeArray(local.projects, incoming.projects, preferIncoming),
    timeEntries: mergeArray(local.timeEntries, incoming.timeEntries, preferIncoming),
    expenses: mergeArray(local.expenses, incoming.expenses, preferIncoming),
    invoices: mergeArray(local.invoices, incoming.invoices, preferIncoming),
    holidayOverrides: mergeArray(local.holidayOverrides, incoming.holidayOverrides, preferIncoming),
    deletedRecords: mergeArray(local.deletedRecords, incoming.deletedRecords, preferIncoming),
  });
}

function mergeDailyTasksForTransfer(
  local: Record<string, DailyTask[]>,
  incoming: Record<string, DailyTask[]>,
  preferIncoming: boolean,
): Record<string, DailyTask[]> {
  const dates = new Set([...Object.keys(local), ...Object.keys(incoming)]);
  const result: Record<string, DailyTask[]> = {};
  for (const date of dates) {
    const localTasks = local[date] ?? [];
    const incomingTasks = incoming[date] ?? [];
    const existingIds = new Set(localTasks.map((t) => t.id));
    const merged = [...localTasks, ...incomingTasks.filter((t) => !existingIds.has(t.id) || preferIncoming)];
    const byId = new Map(merged.map((t) => [t.id, t] as const));
    if (preferIncoming) {
      for (const task of incomingTasks) byId.set(task.id, task);
    }
    result[date] = [...byId.values()];
  }
  return result;
}
