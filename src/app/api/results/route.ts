import { NextResponse } from "next/server";
import { nominees } from "@/lib/nominees";
import { getResults } from "@/lib/store";

export async function GET() {
  const votes = await getResults();
  const results = nominees.map((n) => ({
    id: n.id,
    name: n.name,
    votes: votes[n.id] ?? 0,
  }));
  return NextResponse.json({ results });
}
