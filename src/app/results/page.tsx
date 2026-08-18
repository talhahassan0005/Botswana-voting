"use client";

import { useEffect, useState } from "react";
import { nominees } from "@/lib/nominees";

type Result = { id: string; name: string; votes: number };

export default function ResultsPage() {
  const [results, setResults] = useState<Result[] | null>(null);

  useEffect(() => {
    const load = () =>
      fetch("/api/results")
        .then((r) => r.json())
        .then((d) => setResults(d.results));

    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, []);

  const loading = results === null;
  const total = loading ? 0 : results.reduce((sum, r) => sum + r.votes, 0);
  const sorted = loading ? [] : [...results].sort((a, b) => b.votes - a.votes);

  return (
    <main className="min-h-screen bg-slate-950 px-4 sm:px-6 py-8 sm:py-10">
      <h1 className="text-xl sm:text-2xl font-bold text-white text-center mb-6 sm:mb-8">
        Live Results
      </h1>
      <div className="max-w-md mx-auto space-y-4">
        {loading
          ? nominees.map((n) => (
              <div key={n.id} className="animate-pulse">
                <div className="flex justify-between mb-2">
                  <div className="h-4 w-32 rounded bg-slate-800" />
                  <div className="h-4 w-14 rounded bg-slate-800" />
                </div>
                <div className="h-3 w-full rounded-full bg-slate-800" />
              </div>
            ))
          : sorted.map((r) => {
              const pct = total ? Math.round((r.votes / total) * 100) : 0;
              return (
                <div key={r.id}>
                  <div className="flex flex-wrap justify-between gap-x-2 text-slate-200 mb-1 text-sm sm:text-base">
                    <span className="break-words">{r.name}</span>
                    <span className="whitespace-nowrap">
                      {r.votes} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-3">
                    <div
                      className="bg-indigo-500 h-3 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}

        {!loading && (
          <p className="text-slate-500 text-sm text-center pt-4">{total} total votes</p>
        )}
      </div>
    </main>
  );
}
