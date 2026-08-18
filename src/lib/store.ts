import clientPromise from "./mongodb";

const DB_NAME = "voting";
const VOTES_COLLECTION = "votes";
const REGISTRATIONS_COLLECTION = "registrations";

// Minimum time the registration window must stay open (from the first registration)
// before anyone is allowed to cast a vote.
export const REGISTRATION_WINDOW_MS = 5 * 60 * 1000;

type VoteDoc = {
  voterId: string;
  nomineeId: string;
  votedAt: Date;
};

type RegistrationDoc = {
  voterId: string;
  name: string;
  registeredAt: Date;
};

async function getVotesCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<VoteDoc>(VOTES_COLLECTION);
}

async function getRegistrationsCollection() {
  const client = await clientPromise;
  return client.db(DB_NAME).collection<RegistrationDoc>(REGISTRATIONS_COLLECTION);
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

export async function getRegistration(voterId: string): Promise<RegistrationDoc | null> {
  const registrations = await getRegistrationsCollection();
  return registrations.findOne({ voterId });
}

export async function registerVoter(voterId: string, name: string): Promise<void> {
  const registrations = await getRegistrationsCollection();
  const existing = await registrations.findOne({ voterId });
  if (existing) return;
  await registrations.insertOne({ voterId, name, registeredAt: new Date() });
}

export async function listRegistrations(): Promise<{ name: string; registeredAt: Date }[]> {
  const registrations = await getRegistrationsCollection();
  const docs = await registrations
    .find({}, { projection: { name: 1, registeredAt: 1, _id: 0 } })
    .sort({ registeredAt: 1 })
    .toArray();
  return docs;
}

// When voting opens: REGISTRATION_WINDOW_MS after the very first registration.
// Returns null if nobody has registered yet.
export async function getVotingOpensAt(): Promise<Date | null> {
  const registrations = await getRegistrationsCollection();
  const first = await registrations.findOne({}, { sort: { registeredAt: 1 } });
  if (!first) return null;
  return new Date(first.registeredAt.getTime() + REGISTRATION_WINDOW_MS);
}
