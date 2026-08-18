import { kv } from "@vercel/kv";

const hasKv = Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

// In-memory fallback so `next dev` works without a Vercel KV database attached.
// Votes reset whenever the dev server restarts; not used in production once KV env vars are set.
const memoryVoters = new Set<string>();
const memoryVotes = new Map<string, number>();

export async function hasVoted(voterId: string): Promise<boolean> {
  if (hasKv) return (await kv.sismember("voters", voterId)) === 1;
  return memoryVoters.has(voterId);
}

export async function recordVote(voterId: string, nomineeId: string): Promise<void> {
  if (hasKv) {
    await kv.sadd("voters", voterId);
    await kv.hincrby("votes", nomineeId, 1);
    return;
  }
  memoryVoters.add(voterId);
  memoryVotes.set(nomineeId, (memoryVotes.get(nomineeId) ?? 0) + 1);
}

export async function getResults(): Promise<Record<string, number>> {
  if (hasKv) {
    const votes = await kv.hgetall<Record<string, number>>("votes");
    return votes ?? {};
  }
  return Object.fromEntries(memoryVotes);
}
