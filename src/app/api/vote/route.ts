import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { nominees } from "@/lib/nominees";
import { hasVoted, recordVote } from "@/lib/store";

const VOTER_COOKIE = "voter_id";

export async function GET() {
  const cookieStore = await cookies();
  const voterId = cookieStore.get(VOTER_COOKIE)?.value;
  const voted = voterId ? await hasVoted(voterId) : false;
  return NextResponse.json({ voted });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const nomineeId = body?.nomineeId;

  if (typeof nomineeId !== "string" || !nominees.some((n) => n.id === nomineeId)) {
    return NextResponse.json({ error: "Invalid nominee" }, { status: 400 });
  }

  const cookieStore = await cookies();
  let voterId = cookieStore.get(VOTER_COOKIE)?.value;

  if (voterId && (await hasVoted(voterId))) {
    return NextResponse.json({ error: "You have already voted" }, { status: 409 });
  }

  if (!voterId) {
    voterId = randomUUID();
  }

  await recordVote(voterId, nomineeId);

  const res = NextResponse.json({ success: true });
  res.cookies.set(VOTER_COOKIE, voterId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
