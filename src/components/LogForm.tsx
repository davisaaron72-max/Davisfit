"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { ActivityType, ACTIVITY_META, computePoints } from "@/lib/types";
import { todayISO } from "@/lib/dates";
import { Card } from "./Card";

const TYPES = Object.keys(ACTIVITY_META) as ActivityType[];

export function LogForm() {
  const { data, logActivity } = useStore();
  const [memberId, setMemberId] = useState(data.members[0]?.id ?? "");
  const [type, setType] = useState<ActivityType>("walk");
  const [minutes, setMinutes] = useState(30);
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState("");
  const [flash, setFlash] = useState<string | null>(null);

  const activeMember = data.members.find((m) => m.id === memberId) ?? data.members[0];
  const preview = computePoints(type, minutes);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!activeMember) return;
    logActivity({ memberId: activeMember.id, type, minutes, date, note });
    setFlash(`+${preview} pts logged for ${activeMember.name}!`);
    setNote("");
    setTimeout(() => setFlash(null), 2500);
  }

  if (data.members.length === 0) {
    return (
      <Card title="Log Activity">
        <p className="text-sm text-muted">Add a family member first.</p>
      </Card>
    );
  }

  return (
    <Card title="Log Activity">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Who</label>
          <select
            value={activeMember?.id}
            onChange={(e) => setMemberId(e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          >
            {data.members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.emoji} {m.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Activity</label>
          <div className="grid grid-cols-4 gap-2">
            {TYPES.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setType(t)}
                className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2 text-xs ${
                  type === t
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-200"
                    : "border-border"
                }`}
              >
                <span className="text-lg">{ACTIVITY_META[t].emoji}</span>
                {ACTIVITY_META[t].label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Minutes</label>
            <input
              type="number"
              min={1}
              value={minutes}
              onChange={(e) => setMinutes(Math.max(1, Number(e.target.value) || 0))}
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Note (optional)</label>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Morning jog with the dog"
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted">Worth <b>{preview}</b> pts</span>
          <button className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500">
            Log it
          </button>
        </div>

        {flash && (
          <p className="rounded-lg bg-green-100 px-3 py-2 text-sm font-medium text-green-800 dark:bg-green-900 dark:text-green-100">
            {flash}
          </p>
        )}
      </form>
    </Card>
  );
}
