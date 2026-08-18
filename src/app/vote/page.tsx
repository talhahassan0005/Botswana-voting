"use client";

import { useEffect, useState } from "react";
import { instructions, nominees, pollSubtitle, pollTitle } from "@/lib/nominees";
import ConfettiRain from "@/components/ConfettiRain";

type Step =
  | "loading"
  | "intro"
  | "instructions"
  | "select"
  | "submitting"
  | "done"
  | "already"
  | "error";

export default function VotePage() {
  const [step, setStep] = useState<Step>("loading");
  const [selected, setSelected] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/vote")
      .then((r) => r.json())
      .then((d) => setStep(d.voted ? "already" : "intro"))
      .catch(() => setStep("intro"));
  }, []);

  async function submit() {
    if (!selected) return;
    setStep("submitting");
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nomineeId: selected }),
      });
      const data = await res.json();
      if (res.ok) {
        setStep("done");
      } else if (res.status === 409) {
        setStep("already");
      } else {
        setErrorMsg(data.error ?? "Something went wrong");
        setStep("error");
      }
    } catch {
      setErrorMsg("Network error, please try again");
      setStep("error");
    }
  }

  if (step === "loading") {
    return <Center />;
  }

  if (step === "already") {
    return (
      <Center>
        <h1 className="text-2xl font-bold text-white">You&apos;ve already voted</h1>
        <p className="text-slate-400 mt-2">Thanks for participating!</p>
      </Center>
    );
  }

  if (step === "done") {
    return (
      <Center>
        <ConfettiRain />
        <h1 className="text-2xl font-bold text-white">Thanks for voting! 🎉</h1>
        <p className="text-slate-400 mt-2">Your vote has been recorded.</p>
      </Center>
    );
  }

  if (step === "intro") {
    return (
      <Center>
        <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug max-w-md">
          {pollTitle}
        </h1>
        <p className="text-slate-300 mt-3 max-w-md">{pollSubtitle}</p>
        <button
          type="button"
          onClick={() => setStep("instructions")}
          className="mt-8 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-10 py-3 rounded-xl transition"
        >
          Next
        </button>
      </Center>
    );
  }

  if (step === "instructions") {
    return (
      <Center>
        <p className="text-slate-100 text-lg max-w-md leading-relaxed">{instructions}</p>
        <button
          type="button"
          onClick={() => setStep("select")}
          className="mt-8 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold px-10 py-3 rounded-xl transition"
        >
          Next
        </button>
      </Center>
    );
  }

  // step is "select" | "submitting" | "error"
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center px-4 py-10">
      <p className="text-slate-400 text-sm mb-8 text-center">
        You can only select one candidate
      </p>

      <div className="w-full max-w-md space-y-3">
        {nominees.map((n, i) => (
          <button
            key={n.id}
            type="button"
            onClick={() => setSelected(n.id)}
            className={`w-full text-left px-5 py-4 rounded-xl border transition ${
              selected === n.id
                ? "border-indigo-400 bg-indigo-500/20 text-white"
                : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500"
            }`}
          >
            <div className="font-semibold">
              {i + 1}. {n.name}
            </div>
            {n.description && (
              <div className="text-sm text-slate-400 mt-1">{n.description}</div>
            )}
          </button>
        ))}
      </div>

      {step === "error" && <p className="text-red-400 mt-4">{errorMsg}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={!selected || step === "submitting"}
        className="mt-8 w-full max-w-md bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400 text-white font-semibold py-4 rounded-xl transition hover:bg-indigo-400"
      >
        {step === "submitting" ? "Submitting…" : "Submit"}
      </button>
    </main>
  );
}

function Center({ children }: { children?: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 text-center">
      {children}
    </main>
  );
}
