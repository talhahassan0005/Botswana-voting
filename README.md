# QR Voting

A tiny event voting system: display the home page on a screen/poster, people scan the QR code, register with their name, wait out the registration window, then pick a nominee and submit — one vote per device.

## Pages

- `/` — QR code linking to `/vote` (put this on a poster or screen at the event)
- `/vote` — register with a name, wait for the registration window to close, then the nominee list, select one and submit
- `/registered` — live list of registered voter names, auto-refreshes every 4s
- `/results` — live vote tally, auto-refreshes every 4s

## Registration window

Voting only opens `REGISTRATION_WINDOW_MS` (default: 5 minutes, see [src/lib/store.ts](src/lib/store.ts)) after the very first person registers — this gives everyone time to register before votes start being accepted. The countdown is enforced server-side (`/api/vote` rejects votes before the window closes), not just in the UI.

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

Each vote is a document in the `voting.votes` collection (`voterId`, `nomineeId`, `votedAt`); results are computed with an aggregation that groups by `nomineeId`. Registrations live in `voting.registrations` (`voterId`, `name`, `registeredAt`).

## Deploying to Vercel

1. Push this repo to GitHub and import it in Vercel.
2. In the Vercel project settings, add an environment variable `MONGODB_URI` with your MongoDB connection string.
3. Deploy.

## How duplicate-vote prevention works

On first vote, the server sets an `httpOnly` cookie (`voter_id`) on the visitor's browser and records that ID as having voted. Submitting again from the same browser/device returns "already voted". This isn't bulletproof (clearing cookies or using another device resets it) but is enough for a casual/small event poll.
