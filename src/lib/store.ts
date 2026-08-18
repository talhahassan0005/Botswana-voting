import clientPromise from "./mongodb";

const DB_NAME = "voting";
const COLLECTION = "votes";

type VoteDoc = {
  voterId: string;
  nomineeId: string;
  votedAt: Date;
};

async function getVotesCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<VoteDoc>(COLLECTION);
}

export async function hasVoted(voterId: string): Promise<boolean> {
  const votes = await getVotesCollection();
  const existing = await votes.findOne({ voterId });
  return existing !== null;
}

export async function recordVote(voterId: string, nomineeId: string): Promise<void> {
  const votes = await getVotesCollection();
  await votes.insertOne({ voterId, nomineeId, votedAt: new Date() });
}

export async function getResults(): Promise<Record<string, number>> {
  const votes = await getVotesCollection();
  const tallies = await votes
    .aggregate<{ _id: string; count: number }>([
      { $group: { _id: "$nomineeId", count: { $sum: 1 } } },
    ])
    .toArray();
  return Object.fromEntries(tallies.map((t) => [t._id, t.count]));
}
