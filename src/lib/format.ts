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
