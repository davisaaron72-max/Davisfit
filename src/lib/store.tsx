"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { AppData, Member, Activity, ActivityType, computePoints } from "./types";
import { isInCurrentWeek } from "./dates";

const STORAGE_KEY = "davisfit:v1";

const DEFAULT_DATA: AppData = {
  members: [
    { id: "m1", name: "You", emoji: "💪", color: "#6366f1" },
  ],
  activities: [],
  weeklyGoal: 500,
};

function loadData(): AppData {
  if (typeof window === "undefined") return DEFAULT_DATA;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw) as AppData;
    return {
      members: parsed.members ?? DEFAULT_DATA.members,
      activities: parsed.activities ?? [],
      weeklyGoal: parsed.weeklyGoal ?? DEFAULT_DATA.weeklyGoal,
    };
  } catch {
    return DEFAULT_DATA;
  }
}

function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

interface StoreContextValue {
  data: AppData;
  ready: boolean;
  addMember: (name: string, emoji: string, color: string) => void;
  removeMember: (id: string) => void;
  logActivity: (input: {
    memberId: string;
    type: ActivityType;
    minutes: number;
    date: string;
    note?: string;
  }) => void;
  removeActivity: (id: string) => void;
  setWeeklyGoal: (goal: number) => void;
  // derived
  weekPointsByMember: () => Record<string, number>;
  weekTotal: () => number;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(DEFAULT_DATA);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage after mount (avoids SSR mismatch).
  useEffect(() => {
    setData(loadData());
    setReady(true);
  }, []);

  // Persist on change once hydrated.
  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data, ready]);

  const value = useMemo<StoreContextValue>(() => {
    const addMember: StoreContextValue["addMember"] = (name, emoji, color) =>
      setData((d) => ({
        ...d,
        members: [...d.members, { id: uid(), name, emoji, color }],
      }));

    const removeMember: StoreContextValue["removeMember"] = (id) =>
      setData((d) => ({
        ...d,
        members: d.members.filter((m) => m.id !== id),
        activities: d.activities.filter((a) => a.memberId !== id),
      }));

    const logActivity: StoreContextValue["logActivity"] = (input) =>
      setData((d) => {
        const activity: Activity = {
          id: uid(),
          memberId: input.memberId,
          type: input.type,
          minutes: input.minutes,
          date: input.date,
          note: input.note?.trim() || undefined,
          points: computePoints(input.type, input.minutes),
          createdAt: Date.now(),
        };
        return { ...d, activities: [activity, ...d.activities] };
      });

    const removeActivity: StoreContextValue["removeActivity"] = (id) =>
      setData((d) => ({
        ...d,
        activities: d.activities.filter((a) => a.id !== id),
      }));

    const setWeeklyGoal: StoreContextValue["setWeeklyGoal"] = (goal) =>
      setData((d) => ({ ...d, weeklyGoal: Math.max(0, Math.round(goal)) }));

    const weekPointsByMember = () => {
      const totals: Record<string, number> = {};
      for (const m of data.members) totals[m.id] = 0;
      for (const a of data.activities) {
        if (isInCurrentWeek(a.date) && a.memberId in totals) {
          totals[a.memberId] += a.points;
        }
      }
      return totals;
    };

    const weekTotal = () =>
      Object.values(weekPointsByMember()).reduce((s, n) => s + n, 0);

    return {
      data,
      ready,
      addMember,
      removeMember,
      logActivity,
      removeActivity,
      setWeeklyGoal,
      weekPointsByMember,
      weekTotal,
    };
  }, [data, ready]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
