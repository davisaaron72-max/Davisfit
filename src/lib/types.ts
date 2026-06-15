// Core domain types for DavisFit

export type ActivityType =
  | "walk"
  | "run"
  | "cycle"
  | "strength"
  | "swim"
  | "sport"
  | "other";

export interface Member {
  id: string;
  name: string;
  emoji: string;
  color: string; // tailwind-friendly hex used for accents
}

export interface Activity {
  id: string;
  memberId: string;
  type: ActivityType;
  minutes: number;
  date: string; // ISO yyyy-mm-dd
  note?: string;
  points: number; // computed at log time
  createdAt: number; // epoch ms
}

export interface AppData {
  members: Member[];
  activities: Activity[];
  weeklyGoal: number; // family points target per week
}

// Points per minute by activity type — a simple, tweakable scoring model.
export const POINTS_PER_MINUTE: Record<ActivityType, number> = {
  walk: 1,
  run: 2,
  cycle: 1.5,
  strength: 2,
  swim: 2,
  sport: 1.5,
  other: 1,
};

export const ACTIVITY_META: Record<ActivityType, { label: string; emoji: string }> = {
  walk: { label: "Walk", emoji: "🚶" },
  run: { label: "Run", emoji: "🏃" },
  cycle: { label: "Cycle", emoji: "🚴" },
  strength: { label: "Strength", emoji: "🏋️" },
  swim: { label: "Swim", emoji: "🏊" },
  sport: { label: "Sport", emoji: "⚽" },
  other: { label: "Other", emoji: "✨" },
};

export function computePoints(type: ActivityType, minutes: number): number {
  return Math.round(POINTS_PER_MINUTE[type] * minutes);
}
