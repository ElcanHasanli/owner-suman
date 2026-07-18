export function formatDate(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("az-AZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value: string | null): string {
  if (!value) return "—";
  return new Date(value).toLocaleString("az-AZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function toDateInputValue(value: string | null): string {
  if (!value) return "";
  return value.slice(0, 10);
}

export function dateInputToIso(value: string): string | null {
  if (!value) return null;
  return `${value}T00:00:00.000Z`;
}

export function formatMoney(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) return "0";
  return new Intl.NumberFormat("az-AZ", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatMoneyAz(value: number | null | undefined): string {
  return `${formatMoney(value)} AZN`;
}

export function eventDedupeKey(event: {
  type: string;
  entity_id: number;
  event_at: string;
}): string {
  return `${event.type}:${event.entity_id}:${event.event_at}`;
}

export function nestNumber(
  obj: Record<string, unknown> | undefined,
  path: string[],
): number {
  let cur: unknown = obj;
  for (const key of path) {
    if (cur == null || typeof cur !== "object") return 0;
    cur = (cur as Record<string, unknown>)[key];
  }
  return typeof cur === "number" ? cur : Number(cur) || 0;
}

export function rowField(
  row: Record<string, unknown>,
  keys: string[],
  fallback = "—",
): string {
  for (const key of keys) {
    const v = row[key];
    if (v != null && v !== "") return String(v);
  }
  return fallback;
}
