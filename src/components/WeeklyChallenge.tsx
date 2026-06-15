"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { currentWeekLabel } from "@/lib/dates";
import { Card } from "./Card";

export function WeeklyChallenge() {
  const { data, weekTotal, setWeeklyGoal } = useStore();
  const [editing, setEditing] = useState(false);
  const [goalInput, setGoalInput] = useState(String(data.weeklyGoal));

  const total = weekTotal();
  const goal = data.weeklyGoal || 1;
  const pct = Math.min(100, Math.round((total / goal) * 100));
  const reached = total >= data.weeklyGoal && data.weeklyGoal > 0;

  return (
    <Card
      title="Weekly Family Challenge"
      action={
        editing ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setWeeklyGoal(Number(goalInput) || 0);
              setEditing(false);
            }}
            className="flex items-center gap-2"
          >
            <input
              type="number"
              min={0}
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              className="w-24 rounded-lg border border-border bg-background px-2 py-1 text-sm"
              autoFocus
            />
            <button className="rounded-lg bg-indigo-600 px-3 py-1 text-sm font-medium text-white">
              Save
            </button>
          </form>
        ) : (
          <button
            onClick={() => {
              setGoalInput(String(data.weeklyGoal));
              setEditing(true);
            }}
            className="text-sm text-muted hover:text-foreground"
          >
            Edit goal
          </button>
        )
      }
    >
      <p className="mb-1 text-sm text-muted">{currentWeekLabel()}</p>
      <div className="mb-2 flex items-end justify-between">
        <span className="text-3xl font-bold">{total}</span>
        <span className="text-sm text-muted">of {data.weeklyGoal} pts</span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-border">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-sm font-medium">
        {reached ? "🎉 Goal smashed — nice work, team!" : `${pct}% there — keep going!`}
      </p>
    </Card>
  );
}
