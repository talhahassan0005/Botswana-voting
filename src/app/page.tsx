"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { shortTitle } from "@/lib/nominees";

export default function Home() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(`${window.location.origin}/vote`);
  }, []);

  return (
    <main className="min-h-screen flex-1 flex flex-col items-center justify-center bg-slate-950 px-4 text-center">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{shortTitle}</h1>
      <p className="text-slate-400 mb-8">Scan to cast your vote</p>

      {url && (
        <div className="bg-white p-6 rounded-2xl">
          <QRCodeSVG value={url} size={240} />
        </div>
      )}

      <p className="text-slate-500 mt-6 text-sm break-all">{url}</p>

      <a
        href="/results"
        className="mt-10 text-indigo-400 hover:text-indigo-300 text-sm underline"
      >
        View live results
      </a>
    </main>
  );
}
