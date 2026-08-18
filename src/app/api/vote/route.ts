import { NextRequest, NextResponse } from "next/server";
import { nominees } from "@/lib/nominees";
import { getRegistration, getVotingOpensAt, hasVoted, recordVote } from "@/lib/store";
import { getOrCreateVoterId, getVoterId, setVoterCookie } from "@/lib/voterCookie";

export async function GET() {
  const voterId = await getVoterId();
  const voted = voterId ? await hasVoted(voterId) : false;
  return NextResponse.json({ voted });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const nomineeId = body?.nomineeId;

  if (typeof nomineeId !== "string" || !nominees.some((n) => n.id === nomineeId)) {
    return NextResponse.json({ error: "Invalid nominee" }, { status: 400 });
  }

  const voterId = await getOrCreateVoterId();

  if (await hasVoted(voterId)) {
    return NextResponse.json({ error: "You have already voted" }, { status: 409 });
  }

  const registration = await getRegistration(voterId);
  if (!registration) {
    return NextResponse.json({ error: "Please register before voting" }, { status: 403 });
  }

  const votingOpensAt = await getVotingOpensAt();
  if (votingOpensAt && Date.now() < votingOpensAt.getTime()) {
    return NextResponse.json({ error: "Voting hasn't opened yet" }, { status: 403 });
  }

  await recordVote(voterId, nomineeId);

  const res = NextResponse.json({ success: true });
  setVoterCookie(res, voterId);
  return res;
}
