import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const VOTER_COOKIE = "voter_id";

export async function getOrCreateVoterId(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get(VOTER_COOKIE)?.value ?? randomUUID();
}

export async function getVoterId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(VOTER_COOKIE)?.value;
}

export function setVoterCookie(res: NextResponse, voterId: string) {
  res.cookies.set(VOTER_COOKIE, voterId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}
