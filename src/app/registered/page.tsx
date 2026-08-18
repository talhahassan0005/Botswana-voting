"use client";

import { useEffect, useState } from "react";

export default function RegisteredPage() {
  const [registrations, setRegistrations] = useState<string[] | null>(null);

  useEffect(() => {
    const load = () =>
      fetch("/api/registrations")
        .then((r) => r.json())
        .then((d) => setRegistrations(d.registrations));

    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, []);

  const loading = registrations === null;

  return (
    <main className="min-h-screen bg-slate-950 px-4 sm:px-6 py-8 sm:py-10">
      <h1 className="text-xl sm:text-2xl font-bold text-white text-center mb-2">
        Registered Voters
      </h1>
      {!loading && (
        <p className="text-slate-500 text-sm text-center mb-6 sm:mb-8">
          {registrations.length} registered
        </p>
      )}
      <div className="max-w-md mx-auto space-y-2">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse h-11 w-full rounded-lg bg-slate-800"
              />
            ))
          : registrations.map((name, i) => (
              <div
                key={i}
                className="px-4 py-3 rounded-lg border border-slate-700 bg-slate-900 text-slate-200 text-sm sm:text-base break-words"
              >
                {name}
              </div>
            ))}

        {!loading && registrations.length === 0 && (
          <p className="text-slate-500 text-sm text-center pt-4">
            No one has registered yet.
          </p>
        )}
      </div>
    </main>
  );
}
