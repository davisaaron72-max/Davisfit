"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Card } from "./Card";

const EMOJI_CHOICES = ["💪", "🏃", "🧘", "⚡", "🌟", "🔥", "🐯", "🦊", "🐻", "🦄"];
const COLOR_CHOICES = [
  "#6366f1", "#ec4899", "#f59e0b", "#10b981",
  "#06b6d4", "#ef4444", "#8b5cf6", "#84cc16",
];

export function MembersManager() {
  const { data, addMember, removeMember } = useStore();
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState(EMOJI_CHOICES[0]);
  const [color, setColor] = useState(COLOR_CHOICES[0]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    addMember(trimmed, emoji, color);
    setName("");
  }

  return (
    <Card title="Family Members">
      <ul className="mb-4 space-y-2">
        {data.members.map((m) => (
          <li
            key={m.id}
            className="flex items-center gap-3 rounded-lg border border-border px-3 py-2"
          >
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full text-lg"
              style={{ background: m.color + "22" }}
            >
              {m.emoji}
            </span>
            <span className="flex-1 font-medium">{m.name}</span>
            <button
              onClick={() => removeMember(m.id)}
              className="text-xs text-muted hover:text-red-500"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <form onSubmit={submit} className="space-y-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Add a family member"
          className="w-full rounded-lg border border-border bg-background px-3 py-2"
        />
        <div className="flex flex-wrap gap-1">
          {EMOJI_CHOICES.map((e) => (
            <button
              type="button"
              key={e}
              onClick={() => setEmoji(e)}
              className={`h-8 w-8 rounded-lg text-lg ${
                emoji === e ? "ring-2 ring-indigo-600" : "border border-border"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {COLOR_CHOICES.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() => setColor(c)}
              className={`h-7 w-7 rounded-full ${
                color === c ? "ring-2 ring-offset-2 ring-foreground" : ""
              }`}
              style={{ background: c }}
              aria-label={`Color ${c}`}
            />
          ))}
        </div>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-500">
          Add member
        </button>
      </form>
    </Card>
  );
}
