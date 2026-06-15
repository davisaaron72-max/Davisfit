"use client";

import { useStore } from "@/lib/store";
import { ACTIVITY_META } from "@/lib/types";
import { Card } from "./Card";

export function RecentActivity() {
  const { data, removeActivity } = useStore();
  const memberName = (id: string) =>
    data.members.find((m) => m.id === id)?.name ?? "Unknown";

  const recent = data.activities.slice(0, 8);

  return (
    <Card title="Recent Activity">
      {recent.length === 0 ? (
        <p className="text-sm text-muted">No activity yet — log your first workout!</p>
      ) : (
        <ul className="divide-y divide-border">
          {recent.map((a) => (
            <li key={a.id} className="flex items-center gap-3 py-3">
              <span className="text-xl">{ACTIVITY_META[a.type].emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">
                  <b>{memberName(a.memberId)}</b> · {ACTIVITY_META[a.type].label} ·{" "}
                  {a.minutes} min
                  {a.note ? <span className="text-muted"> — {a.note}</span> : null}
                </p>
                <p className="text-xs text-muted">{a.date}</p>
              </div>
              <span className="text-sm font-semibold">+{a.points}</span>
              <button
                onClick={() => removeActivity(a.id)}
                className="text-xs text-muted hover:text-red-500"
                aria-label="Delete activity"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
