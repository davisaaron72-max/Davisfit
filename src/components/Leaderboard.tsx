"use client";

import { useStore } from "@/lib/store";
import { Card } from "./Card";

const MEDALS = ["🥇", "🥈", "🥉"];

export function Leaderboard() {
  const { data, weekPointsByMember } = useStore();
  const points = weekPointsByMember();

  const ranked = [...data.members]
    .map((m) => ({ member: m, pts: points[m.id] ?? 0 }))
    .sort((a, b) => b.pts - a.pts);

  const max = Math.max(1, ...ranked.map((r) => r.pts));

  return (
    <Card title="Leaderboard">
      {ranked.length === 0 ? (
        <p className="text-sm text-muted">Add family members to start competing.</p>
      ) : (
        <ul className="space-y-3">
          {ranked.map((row, i) => (
            <li key={row.member.id} className="flex items-center gap-3">
              <span className="w-6 text-center text-lg">
                {MEDALS[i] ?? <span className="text-sm text-muted">{i + 1}</span>}
              </span>
              <span className="text-xl">{row.member.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="truncate font-medium">{row.member.name}</span>
                  <span className="text-sm font-semibold">{row.pts} pts</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(row.pts / max) * 100}%`,
                      background: row.member.color,
                    }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
