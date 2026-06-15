"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { WeeklyChallenge } from "@/components/WeeklyChallenge";
import { Leaderboard } from "@/components/Leaderboard";
import { LogForm } from "@/components/LogForm";
import { RecentActivity } from "@/components/RecentActivity";
import { MembersManager } from "@/components/MembersManager";

type Tab = "dashboard" | "members";

export default function Home() {
  const { ready } = useStore();
  const [tab, setTab] = useState<Tab>("dashboard");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-indigo-600">Davis</span>Fit
          </h1>
          <p className="text-sm text-muted">Family fitness, together.</p>
        </div>
        <nav className="flex gap-1 rounded-xl border border-border bg-card p-1">
          {(["dashboard", "members"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition ${
                tab === t ? "bg-indigo-600 text-white" : "text-muted hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      {!ready ? (
        <p className="text-sm text-muted">Loading…</p>
      ) : tab === "dashboard" ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <WeeklyChallenge />
            <Leaderboard />
            <RecentActivity />
          </div>
          <div className="space-y-6">
            <LogForm />
          </div>
        </div>
      ) : (
        <div className="max-w-md">
          <MembersManager />
        </div>
      )}

      <footer className="mt-12 text-center text-xs text-muted">
        Data is saved on this device. Ready to deploy to Vercel when you are.
      </footer>
    </div>
  );
}
