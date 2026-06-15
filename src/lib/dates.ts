// Week helpers — weeks start on Monday.

export function todayISO(): string {
  return toISO(new Date());
}

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Monday of the week containing `d`.
export function startOfWeek(d: Date): Date {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // 0 = Monday
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - day);
  return date;
}

export function isInCurrentWeek(iso: string): boolean {
  const start = startOfWeek(new Date());
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  const d = new Date(iso + "T00:00:00");
  return d >= start && d < end;
}

export function currentWeekLabel(): string {
  const start = startOfWeek(new Date());
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const fmt = (x: Date) =>
    x.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `${fmt(start)} – ${fmt(end)}`;
}
