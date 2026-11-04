# Lume

Lume is a decentralized advertising marketplace with a deliberately split architecture: application services coordinate campaigns, authenticate wallets, validate advertising activity and provide analytics; a NEAR smart contract is the authoritative financial layer for approved-token escrow, campaign balances, refunds and publisher settlement batches.

Lume does **not** claim that the entire platform is decentralized. Browser events and delivery decisions are not automatically legitimate simply because they originate from a publisher SDK. The backend must validate and aggregate events before a settlement coordinator submits an idempotent batch to the contract.

## What it provides

- Advertiser campaign management, targeting, budgets, rates and performance views.
- Publisher website/placement workflows, SDK integration and earnings views.
- Admin operations for account, campaign, traffic and settlement review.
- MongoDB-backed application metadata and event indexing.
- NEAR account-based authorization and configurable NEP-141 token escrow.
- Integer base-unit accounting with no floating-point financial calculations.
- Duplicate event and settlement-batch protection.

## Architecture

`app/` is one Next.js 15 App Router application. Route Handlers under `app/src/app/api/` handle authentication primitives, campaign metadata, ad delivery and event intake. Mongoose models store off-chain metadata and analytics. The browser and publisher SDK never decide that an event is payable.

`contract/` is a single Rust NEAR contract. It owns campaign balances, approved-token deposits through `ft_on_transfer`, campaign state, authorized settlement coordination, refunds, and structured logs. The approved token contract is passed during initialization; no unverified token address is embedded.

## Structure

```text
app/
  src/app/                 pages and Route Handlers
  src/components/          reusable UI
  src/lib/                  auth, database, validation and NEAR config
  src/models/               Mongoose schemas
  src/sdk/                  lightweight publisher SDK
  src/types/               shared domain types
contract/
  src/lib.rs                escrow contract and settlement callbacks
```

## Workflows

### Advertiser

1. Request a nonce and sign a wallet-specific message.
2. Create a campaign in the application with integer token base units.
3. Create the corresponding on-chain campaign.
4. Deposit approved fungible tokens by calling the token contract's `ft_transfer_call` with the campaign ID as the message.
5. Activate, pause, resume or complete the campaign.
6. Review application analytics alongside authoritative on-chain balances.

### Publisher

1. Authenticate a NEAR account and register a website.
2. Complete off-chain ownership verification.
3. Create a placement and initialize the SDK with the publisher ID.
4. Request eligible ads and report events.
5. The backend validates traffic, deduplicates events and aggregates liabilities.
6. An authorized settlement coordinator submits a unique batch to the contract.

### Settlement

The contract verifies the settlement coordinator, batch ID, registered publishers and campaign balance. It debits the campaign and credits publisher liabilities atomically. Publishers then claim their recorded earnings individually. A failed claim restores that publisher's liability in a private callback, avoiding partial multi-publisher payouts.

## API overview

- `POST /api/auth/nonce` — issue a short-lived sign-in challenge.
- `GET|POST /api/campaigns` — authenticated campaign metadata.
- `GET /api/ads` — placement-aware ad selection boundary.
- `POST /api/events` — validated, deduplicated event intake.

Additional production endpoints should use the same validation, authentication, rate limiting, audit logging and role checks before being enabled. The current scaffold intentionally does not fabricate live ad inventory or blockchain history.

## Publisher SDK

The SDK lives in `app/src/sdk/index.ts`. It can be bundled or imported from the app package:

```ts
import { LumePublisher } from "@/sdk";

const lume = new LumePublisher({ publisherId: "publisher_123" });
const ad = await lume.requestAd("homepage-top");
if (ad) {
  // Render the creative using your site's trusted component.
  await lume.report("impression", ad.campaignId, "homepage-top");
}
```

The SDK uses best-effort network delivery and local duplicate suppression only. These are convenience features, not proof of validity. Server-side verification remains authoritative.

## Environment

Copy `.env.example` to `.env.local` and provide local values:

| Variable | Purpose |
|---|---|
| `MONGODB_URI`, `MONGODB_DB` | Application database |
| `NEXT_PUBLIC_NEAR_NETWORK` | `testnet` or another explicitly selected network |
| `NEXT_PUBLIC_LUME_CONTRACT_ID` | Lume contract account |
| `NEAR_RPC_URL` | Server-side RPC endpoint |
| `NEAR_TOKEN_CONTRACT_ID` | Approved NEP-141 token account |
| `NEAR_ADMIN_ACCOUNT_ID`, `NEAR_ADMIN_PRIVATE_KEY` | Server-side coordinator configuration; never expose to the browser |
| `SESSION_SECRET` | At least 32 random characters |
| `ADMIN_ACCOUNT_IDS` | Comma-separated admin accounts |

Do not put private keys, database credentials or session secrets in client-exposed variables.

## Local development

Install dependencies with `pnpm install`, copy the environment example, and start the application with `pnpm dev`. The application expects MongoDB to be available. Wallet and live contract flows require a configured NEAR testnet account and an approved token contract.

This repository intentionally contains no deployment configuration, live credentials or production claim.

## Contract build guidance

Install Rust, the NEAR target and `cargo-near`, then run `cargo near build` inside `contract/`. Deploy and initialize only after reviewing the token account, owner account, settlement authorization and storage assumptions for the selected NEAR network.

## Security considerations

- The contract rejects deposits from any token other than its configured token account.
- Campaign and publisher authorization is account-based.
- Balances and rates use `u128` integer base units.
- Settlement batches are idempotent and bounded by campaign balances.
- Failed async transfers are recorded rather than hidden.
- Backend event acceptance is not payment authorization.
- Add signed placement attestations, origin checks, bot detection, rate limits, audit logs and independent reconciliation before production use.
- Admins cannot arbitrarily withdraw or redirect campaign escrow through the exposed contract methods.

## Roadmap

1. Complete wallet-standard authentication and signature verification.
2. Add website DNS/HTML verification and placement management models.
3. Implement signed ad responses and server-side event attestations.
4. Add indexed blockchain transaction reconciliation and settlement retry tooling.
5. Add privacy-preserving analytics and independent contract review.

Lume has not been deployed, audited, tested, built, or verified as part of this source delivery.
