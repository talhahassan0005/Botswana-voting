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
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Votes are stored in memory during local dev (they reset when the server restarts) — no setup needed.

## Deploying to Vercel

Votes need a real datastore in production since Vercel's serverless functions don't share memory between invocations. This project uses [Vercel KV](https://vercel.com/docs/storage/vercel-kv) (Upstash Redis):

1. Deploy the project to Vercel.
2. In the Vercel dashboard, go to **Storage → Create Database → KV** and connect it to this project.
3. Vercel automatically adds the `KV_REST_API_URL` / `KV_REST_API_TOKEN` env vars — redeploy and votes will persist there.

Without a KV database connected, the app still runs but falls back to the same in-memory store as local dev, so votes won't persist across serverless invocations.

## How duplicate-vote prevention works

On first vote, the server sets an `httpOnly` cookie (`voter_id`) on the visitor's browser and records that ID as having voted. Submitting again from the same browser/device returns "already voted". This isn't bulletproof (clearing cookies or using another device resets it) but is enough for a casual/small event poll.
