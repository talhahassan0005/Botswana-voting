"use client";

import { useEffect, useState } from "react";

type Result = { id: string; name: string; votes: number };

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const load = () =>
      fetch("/api/results")
        .then((r) => r.json())
        .then((d) => setResults(d.results));

    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, []);

  const total = results.reduce((sum, r) => sum + r.votes, 0);
  const sorted = [...results].sort((a, b) => b.votes - a.votes);

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10">
      <h1 className="text-2xl font-bold text-white text-center mb-8">Live Results</h1>
      <div className="max-w-md mx-auto space-y-4">
        {sorted.map((r) => {
          const pct = total ? Math.round((r.votes / total) * 100) : 0;
          return (
            <div key={r.id}>
              <div className="flex justify-between text-slate-200 mb-1">
                <span>{r.name}</span>
                <span>
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
        <p className="text-slate-500 text-sm text-center pt-4">{total} total votes</p>
      </div>
    </main>
  );
}
