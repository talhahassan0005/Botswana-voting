import { NextRequest, NextResponse } from "next/server";
import { getRegistration, getVotingOpensAt, registerVoter } from "@/lib/store";
import { getOrCreateVoterId, getVoterId, setVoterCookie } from "@/lib/voterCookie";

export async function GET() {
  const voterId = await getVoterId();
  const registration = voterId ? await getRegistration(voterId) : null;
  const votingOpensAt = await getVotingOpensAt();

  return NextResponse.json({
    registered: registration !== null,
    name: registration?.name ?? null,
    votingOpensAt: votingOpensAt ? votingOpensAt.toISOString() : null,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";

  if (!name || name.length > 100) {
    return NextResponse.json({ error: "Please enter your name" }, { status: 400 });
  }

  const voterId = await getOrCreateVoterId();
  await registerVoter(voterId, name);
  const votingOpensAt = await getVotingOpensAt();

  const res = NextResponse.json({
    success: true,
    votingOpensAt: votingOpensAt ? votingOpensAt.toISOString() : null,
  });
  setVoterCookie(res, voterId);
  return res;
}
