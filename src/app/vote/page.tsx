"use client";

import { useEffect, useState } from "react";
import {
  instructions,
  nominees,
  pollSubtitle,
  pollTitle,
  welcomeMessage,
} from "@/lib/nominees";
import ConfettiRain from "@/components/ConfettiRain";

type Step =
  | "loading"
  | "register"
  | "waiting"
  | "intro"
  | "instructions"
  | "select"
  | "submitting"
  | "done"
  | "already"
  | "error";

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export default function VotePage() {
  const [step, setStep] = useState<Step>("loading");
  const [selected, setSelected] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");
  const [registering, setRegistering] = useState(false);
  const [votingOpensAt, setVotingOpensAt] = useState<number | null>(null);
  const [remainingMs, setRemainingMs] = useState(0);

  useEffect(() => {
    async function init() {
      const voteRes = await fetch("/api/vote").then((r) => r.json());
      if (voteRes.voted) {
        setStep("already");
        return;
      }

      const regRes = await fetch("/api/register").then((r) => r.json());
      const opensAt = regRes.votingOpensAt ? new Date(regRes.votingOpensAt).getTime() : null;

      if (!regRes.registered) {
        setStep("register");
        return;
      }

      if (opensAt && Date.now() < opensAt) {
        setVotingOpensAt(opensAt);
        setStep("waiting");
      } else {
        setStep("intro");
      }
    }
    init().catch(() => setStep("register"));
  }, []);

  useEffect(() => {
    if (step !== "waiting" || votingOpensAt === null) return;

    const tick = () => {
      const diff = votingOpensAt - Date.now();
      setRemainingMs(diff);
      if (diff <= 0) {
        setStep("intro");
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [step, votingOpensAt]);

  async function register() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setRegistering(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong");
        setStep("error");
        return;
      }
      const opensAt = data.votingOpensAt ? new Date(data.votingOpensAt).getTime() : null;
      if (opensAt && Date.now() < opensAt) {
        setVotingOpensAt(opensAt);
        setStep("waiting");
      } else {
        setStep("intro");
      }
    } catch {
      setErrorMsg("Network error, please try again");
      setStep("error");
    } finally {
      setRegistering(false);
    }
  }

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

  if (step === "register") {
    return (
      <Center>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Register to vote</h1>
        <p className="text-slate-400 mt-2 text-sm sm:text-base">
          Please enter your name to register.
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          className="mt-6 w-full max-w-xs bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 text-center focus:outline-none focus:border-indigo-400"
        />
        <button
          type="button"
          onClick={register}
          disabled={!name.trim() || registering}
          className="mt-4 w-full max-w-xs bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400 text-white font-semibold py-3 rounded-xl transition hover:bg-indigo-400"
        >
          {registering ? "Registering…" : "Register"}
        </button>
      </Center>
    );
  }

  if (step === "waiting") {
    return (
      <Center>
        <h1 className="text-xl sm:text-2xl font-bold text-white">You&apos;re registered!</h1>
        <p className="text-slate-400 mt-2 text-sm sm:text-base">Voting opens in</p>
        <p className="text-indigo-400 text-4xl sm:text-5xl font-bold mt-3 tabular-nums">
          {formatCountdown(remainingMs)}
        </p>
      </Center>
    );
  }

  if (step === "done") {
    return (
      <Center>
        <ConfettiRain />
        <h1 className="text-2xl font-bold text-white">Thanks for voting! 🎉</h1>
        <p className="text-slate-400 mt-2">Your vote has been recorded.</p>
        <a
          href="/"
          className="mt-8 block w-full max-w-xs text-center bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-3 rounded-xl transition"
        >
          Back to Start
        </a>
      </Center>
    );
  }

  if (step === "intro") {
    return (
      <Center>
        <p className="text-indigo-400 uppercase tracking-wide text-2xl sm:text-3xl font-bold mb-3">
          {welcomeMessage}
        </p>
        <h1 className="text-lg sm:text-2xl font-bold text-white leading-snug max-w-sm sm:max-w-md break-words">
          {pollTitle}
        </h1>
        <p className="text-slate-300 mt-3 max-w-sm sm:max-w-md text-sm sm:text-base">
          {pollSubtitle}
        </p>
        <button
          type="button"
          onClick={() => setStep("instructions")}
          className="mt-8 w-full max-w-xs bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-3 rounded-xl transition"
        >
          Next
        </button>
      </Center>
    );
  }

  if (step === "instructions") {
    return (
      <Center>
        <p className="text-slate-100 text-base sm:text-lg max-w-sm sm:max-w-md leading-relaxed">
          {instructions}
        </p>
        <button
          type="button"
          onClick={() => setStep("select")}
          className="mt-8 w-full max-w-xs bg-indigo-500 hover:bg-indigo-400 text-white font-semibold py-3 rounded-xl transition"
        >
          Next
        </button>
      </Center>
    );
  }

  // step is "select" | "submitting" | "error"
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center px-4 sm:px-6 py-8 sm:py-10">
      <p className="text-slate-400 text-sm mb-6 sm:mb-8 text-center">
        You can only select one candidate
      </p>

      <div className="w-full max-w-md space-y-3">
        {nominees.map((n, i) => (
          <button
            key={n.id}
            type="button"
            onClick={() => setSelected(n.id)}
            className={`w-full text-left px-4 sm:px-5 py-4 rounded-xl border transition ${
              selected === n.id
                ? "border-indigo-400 bg-indigo-500/20 text-white"
                : "border-slate-700 bg-slate-900 text-slate-200 hover:border-slate-500"
            }`}
          >
            <div className="font-semibold break-words">
              {i + 1}. {n.name}
            </div>
            {n.description && (
              <div className="text-sm text-slate-400 mt-1 break-words">{n.description}</div>
            )}
          </button>
        ))}
      </div>

      {step === "error" && <p className="text-red-400 mt-4 text-center">{errorMsg}</p>}

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
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 sm:px-6 py-10 text-center">
      {children}
    </main>
  );
}
