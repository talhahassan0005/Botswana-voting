# QR Voting

A tiny event voting system: display the home page on a screen/poster, people scan the QR code, pick a nominee, and submit — one vote per device.

## Pages

- `/` — QR code linking to `/vote` (put this on a poster or screen at the event)
- `/vote` — nominee list, select one and submit
- `/results` — live vote tally, auto-refreshes every 4s

## Editing nominees

Edit [src/lib/nominees.ts](src/lib/nominees.ts) — update `pollTitle` and the `nominees` array (`id`, `name`, optional `description`).

## Running locally

```bash
npm install
cp .env.example .env.local   # then fill in MONGODB_URI
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

Votes are stored in MongoDB. Set the `MONGODB_URI` environment variable (see `.env.example`) — locally via `.env.local` (git-ignored, never commit real credentials), and in production via your host's environment variable settings.

Each vote is a document in the `voting.votes` collection (`voterId`, `nomineeId`, `votedAt`); results are computed with an aggregation that groups by `nomineeId`.

## Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. In the Vercel project settings, add an environment variable `MONGODB_URI` with your MongoDB connection string.
3. Deploy.

## How duplicate-vote prevention works

On first vote, the server sets an `httpOnly` cookie (`voter_id`) on the visitor's browser and records that ID as having voted. Submitting again from the same browser/device returns "already voted". This isn't bulletproof (clearing cookies or using another device resets it) but is enough for a casual/small event poll.
