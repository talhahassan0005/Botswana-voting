"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { shortTitle } from "@/lib/nominees";

type Status = "loading" | "voted" | "not-voted";

export default function Home() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    setUrl(`${window.location.origin}/vote`);
    fetch("/api/vote")
      .then((r) => r.json())
      .then((d) => setStatus(d.voted ? "voted" : "not-voted"))
      .catch(() => setStatus("not-voted"));
  }, []);

  if (status === "voted") {
    return (
      <main className="min-h-screen flex-1 flex flex-col items-center justify-center bg-slate-950 px-4 py-10 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
          Thanks for voting! 🎉
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Your vote has already been recorded.
        </p>
        <a
          href="/results"
          className="mt-10 text-indigo-400 hover:text-indigo-300 text-sm underline"
        >
          View live results
        </a>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex-1 flex flex-col items-center justify-center bg-slate-950 px-4 py-10 text-center">
      <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2 max-w-sm sm:max-w-none">
        {shortTitle}
      </h1>
      <p className="text-slate-400 mb-6 sm:mb-8 text-sm sm:text-base">
        Scan to cast your vote
      </p>

      {status === "not-voted" && url && (
        <div className="bg-white p-4 sm:p-6 rounded-2xl">
          <QRCodeSVG value={url} size={512} className="w-44 h-44 sm:w-64 sm:h-64" />
        </div>
      )}

      <a
        href="/results"
        className="mt-10 text-indigo-400 hover:text-indigo-300 text-sm underline"
      >
        View live results
      </a>
    </main>
  );
}
