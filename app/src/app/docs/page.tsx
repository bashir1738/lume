"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Terminal,
  ShieldCheck,
  Cpu,
  Lock,
  Code2,
  ExternalLink,
  BookOpen,
  ArrowRight,
  Database,
  Coins,
  Copy,
  Check,
} from "lucide-react";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";

export default function DocsPage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyText = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <main className="min-h-screen bg-paper text-ink">
      <MarketingHeader />

      {/* Docs Header */}
      <section className="border-b border-line bg-white py-12 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
            <BookOpen className="h-4 w-4" />
            <span>Developer & Architecture Reference</span>
          </div>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Lume Protocol Documentation
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted leading-relaxed">
            Comprehensive guide to Lume’s split off-chain/on-chain ad delivery architecture,
            Rust NEAR smart contract escrow specifications, publisher SDK, and REST ingestion primitives.
          </p>

          {/* Quick jump navigation */}
          <div className="mt-8 flex flex-wrap gap-2 text-xs font-semibold">
            <a
              href="#overview"
              className="rounded-full border border-line bg-paper px-3.5 py-1.5 hover:border-ink transition"
            >
              1. Overview
            </a>
            <a
              href="#contract"
              className="rounded-full border border-line bg-paper px-3.5 py-1.5 hover:border-ink transition"
            >
              2. NEAR Escrow Contract
            </a>
            <a
              href="#sdk"
              className="rounded-full border border-line bg-paper px-3.5 py-1.5 hover:border-ink transition"
            >
              3. Publisher SDK
            </a>
            <a
              href="#anti-fraud"
              className="rounded-full border border-line bg-paper px-3.5 py-1.5 hover:border-ink transition"
            >
              4. Anti-Fraud & Ingestion
            </a>
            <a
              href="#base-units"
              className="rounded-full border border-line bg-paper px-3.5 py-1.5 hover:border-ink transition"
            >
              5. Integer Base Units
            </a>
            <a
              href="#api"
              className="rounded-full border border-line bg-paper px-3.5 py-1.5 hover:border-ink transition"
            >
              6. REST API Endpoints
            </a>
          </div>
        </div>
      </section>

      {/* Main Documentation Body */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_280px]">
          {/* Main content column */}
          <div className="space-y-16">
            {/* Section 1: Overview */}
            <section id="overview" className="scroll-mt-24 space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-muted">01.</span>
                <h2 className="text-2xl font-bold tracking-tight text-ink">Architecture Overview</h2>
              </div>
              <p className="text-sm leading-relaxed text-muted">
                Lume is a decentralized advertising marketplace with a deliberately split architecture:
                application services coordinate campaigns, authenticate wallets, validate advertising
                activity and provide analytics; a NEAR smart contract is the authoritative financial
                layer for approved-token escrow, campaign balances, refunds and publisher settlement batches.
              </p>
              <div className="rounded-2xl border border-line bg-white p-6">
                <h3 className="font-semibold text-ink text-sm">Key Architectural Tenet</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Lume does <strong>not</strong> claim that the entire platform is decentralized. Browser
                  events and delivery decisions are not automatically legitimate simply because they originate
                  from a publisher SDK. The backend must validate and aggregate events before a settlement
                  coordinator submits an idempotent batch to the contract.
                </p>
              </div>
            </section>

            {/* Section 2: NEAR Escrow Contract */}
            <section id="contract" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-muted">02.</span>
                <h2 className="text-2xl font-bold tracking-tight text-ink">
                  NEAR Smart Contract Reference
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted">
                The smart contract is written in Rust using <code>near-sdk</code>. It owns campaign
                balances, approved fungible token deposits through <code>ft_on_transfer</code>, authorized
                settlement coordination, refunds, and structured logs.
              </p>

              {/* Methods Table */}
              <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
                <div className="border-b border-line px-5 py-3.5 bg-paper/50">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Contract Interface Methods
                  </h3>
                </div>
                <div className="divide-y divide-line text-xs font-mono">
                  <div className="p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink">create_campaign(...) -&gt; u64</span>
                      <Badge variant="outline" size="sm">Call</Badge>
                    </div>
                    <p className="font-sans text-muted">
                      Registers a campaign on-chain with rate, pricing model (&apos;cpm&apos; | &apos;cpc&apos;), starts_at, and ends_at. Returns unique u64 ID.
                    </p>
                  </div>

                  <div className="p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink">ft_on_transfer(sender_id, amount, msg)</span>
                      <Badge variant="accent" size="sm">NEP-141 Deposit</Badge>
                    </div>
                    <p className="font-sans text-muted">
                      Called by approved token contract when advertiser transfers tokens. <code>msg</code> contains campaign ID. Credits campaign escrow balance.
                    </p>
                  </div>

                  <div className="p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink">submit_settlement(batch: SettlementBatch)</span>
                      <Badge variant="warning" size="sm">Coordinator Only</Badge>
                    </div>
                    <p className="font-sans text-muted">
                      Idempotent settlement batch. Verifies authorized settler, records unique batch ID, debits campaign escrow, and credits publisher liabilities atomically.
                    </p>
                  </div>

                  <div className="p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink">claim_earnings() -&gt; Promise</span>
                      <Badge variant="success" size="sm">Publisher Call</Badge>
                    </div>
                    <p className="font-sans text-muted">
                      Publisher initiates withdrawal of accumulated claimable balance. Triggers async NEP-141 ft_transfer. A failed claim invokes a private rollback callback.
                    </p>
                  </div>

                  <div className="p-4 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-ink">close_campaign(campaign_id: u64)</span>
                      <Badge variant="outline" size="sm">Advertiser Call</Badge>
                    </div>
                    <p className="font-sans text-muted">
                      Closes completed or paused campaign and refunds all remaining unspent escrow tokens directly back to the advertiser.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Publisher SDK */}
            <section id="sdk" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-muted">03.</span>
                <h2 className="text-2xl font-bold tracking-tight text-ink">Publisher SDK Reference</h2>
              </div>
              <p className="text-sm leading-relaxed text-muted">
                The Lume Publisher SDK (<code>@lume/sdk</code>) provides low-overhead client integration.
                It features local duplicate suppression, sub-50ms ad resolution, and automatic beacon reporting.
              </p>

              <div className="rounded-2xl border border-line bg-ink p-6 text-white font-mono text-xs shadow-xl">
                <div className="flex items-center justify-between border-b border-white/15 pb-3">
                  <span className="text-white/70">Terminal Install</span>
                  <button
                    onClick={() => copyText("install", "npm install @lume/sdk")}
                    className="flex items-center gap-1 text-white/60 hover:text-white"
                  >
                    {copiedSection === "install" ? <Check className="h-3 w-3 text-accent" /> : <Copy className="h-3 w-3" />}
                    {copiedSection === "install" ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre className="mt-3 text-accent"><code>npm install @lume/sdk</code></pre>
              </div>

              <div className="rounded-2xl border border-line bg-white p-6 space-y-4">
                <h4 className="font-semibold text-sm text-ink">Example Integration:</h4>
                <div className="rounded-xl border border-line bg-paper p-4 font-mono text-xs text-ink/90 overflow-x-auto">
                  <pre>{`import { LumePublisher } from "@lume/sdk";

const lume = new LumePublisher({
  publisherId: "publisher_123",
  testnet: true
});

// Request an eligible ad for placement
const ad = await lume.requestAd("homepage-top");
if (ad) {
  // Render the creative using your site's component
  renderCreative(ad);
  
  // Report verified view beacon
  await lume.report("impression", ad.campaignId, "homepage-top");
}`}</pre>
                </div>
              </div>
            </section>

            {/* Section 4: Anti-Fraud */}
            <section id="anti-fraud" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-muted">04.</span>
                <h2 className="text-2xl font-bold tracking-tight text-ink">
                  Anti-Fraud & Event Ingestion Engine
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted">
                Ad traffic is subject to multi-stage server-side validation. Raw browser events are treated
                as untrusted claims until attested by the coordinator engine:
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-white p-5">
                  <h4 className="font-semibold text-sm text-ink">Placement Attestation</h4>
                  <p className="mt-1.5 text-xs text-muted leading-relaxed">
                    Publishers must verify domain ownership via DNS TXT or HTML meta tags. Unverified domains cannot request ads or accrue payable liabilities.
                  </p>
                </div>

                <div className="rounded-2xl border border-line bg-white p-5">
                  <h4 className="font-semibold text-sm text-ink">Duplicate Nonce Suppression</h4>
                  <p className="mt-1.5 text-xs text-muted leading-relaxed">
                    Every impression and click requires a unique UUIDv4 nonce signed by the client. Repeated nonces are discarded immediately.
                  </p>
                </div>

                <div className="rounded-2xl border border-line bg-white p-5">
                  <h4 className="font-semibold text-sm text-ink">Frequency & Velocity Capping</h4>
                  <p className="mt-1.5 text-xs text-muted leading-relaxed">
                    IP and user-agent hashes are rate-limited to avoid bot farms spamming impressions or clicks against advertiser budgets.
                  </p>
                </div>

                <div className="rounded-2xl border border-line bg-white p-5">
                  <h4 className="font-semibold text-sm text-ink">Idempotent Batch Hashes</h4>
                  <p className="mt-1.5 text-xs text-muted leading-relaxed">
                    The settlement coordinator hashes event sets to produce deterministic settlement batch IDs. The contract prevents executing the same batch twice.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 5: Base Units */}
            <section id="base-units" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-muted">05.</span>
                <h2 className="text-2xl font-bold tracking-tight text-ink">
                  Strict Integer Base-Unit Accounting
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted">
                To guarantee zero financial drift, floating-point numbers are prohibited across both the
                database and the Rust smart contract. All values are represented as string or <code>u128</code> integer base units.
              </p>

              <div className="rounded-2xl border border-line bg-white p-6">
                <div className="grid gap-4 sm:grid-cols-3 text-xs">
                  <div className="rounded-xl bg-paper p-3 border border-line">
                    <span className="text-muted block">Token Spec</span>
                    <strong className="text-sm font-semibold text-ink">USDC (NEP-141)</strong>
                    <span className="text-muted block mt-1">6 decimal places</span>
                  </div>
                  <div className="rounded-xl bg-paper p-3 border border-line">
                    <span className="text-muted block">Display Value</span>
                    <strong className="text-sm font-semibold text-ink">$1.00 USDC</strong>
                    <span className="text-muted block mt-1">Human readable</span>
                  </div>
                  <div className="rounded-xl bg-paper p-3 border border-line">
                    <span className="text-muted block">Protocol Base Unit</span>
                    <strong className="text-sm font-semibold text-ink">1,000,000 units</strong>
                    <span className="text-muted block mt-1">1 * 10^6</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6: REST API */}
            <section id="api" className="scroll-mt-24 space-y-6">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-muted">06.</span>
                <h2 className="text-2xl font-bold tracking-tight text-ink">REST API Endpoints</h2>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="rounded-2xl border border-line bg-white p-5">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                      POST
                    </span>
                    <strong className="text-ink">/api/auth/nonce</strong>
                  </div>
                  <p className="mt-2 font-sans text-muted">
                    Issue a cryptographic short-lived challenge nonce for NEAR wallet signature verification.
                  </p>
                </div>

                <div className="rounded-2xl border border-line bg-white p-5">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      GET / POST
                    </span>
                    <strong className="text-ink">/api/campaigns</strong>
                  </div>
                  <p className="mt-2 font-sans text-muted">
                    Authenticated route to retrieve advertiser campaigns or submit a new campaign definition.
                  </p>
                </div>

                <div className="rounded-2xl border border-line bg-white p-5">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                      GET
                    </span>
                    <strong className="text-ink">/api/ads</strong>
                  </div>
                  <p className="mt-2 font-sans text-muted">
                    Placement-aware creative matching boundary. Returns eligible ad creative and signature.
                  </p>
                </div>

                <div className="rounded-2xl border border-line bg-white p-5">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                      POST
                    </span>
                    <strong className="text-ink">/api/events</strong>
                  </div>
                  <p className="mt-2 font-sans text-muted">
                    Validated event intake. Deduplicates impression/click events and queues liabilities for settlement.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Sticky Sidebar Navigation */}
          <aside className="hidden lg:block">
            <div className="sticky top-10 space-y-6">
              <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">On this page</h4>
                <nav className="mt-4 space-y-2.5 text-xs font-medium text-muted">
                  <a href="#overview" className="block hover:text-ink transition">
                    Architecture Overview
                  </a>
                  <a href="#contract" className="block hover:text-ink transition">
                    NEAR Smart Contract
                  </a>
                  <a href="#sdk" className="block hover:text-ink transition">
                    Publisher SDK
                  </a>
                  <a href="#anti-fraud" className="block hover:text-ink transition">
                    Anti-Fraud Engine
                  </a>
                  <a href="#base-units" className="block hover:text-ink transition">
                    Integer Base Units
                  </a>
                  <a href="#api" className="block hover:text-ink transition">
                    REST API Endpoints
                  </a>
                </nav>
              </div>

              <div className="rounded-2xl border border-line bg-paper p-5">
                <span className="text-xs font-bold text-ink">Explore Live Workspaces</span>
                <p className="mt-1 text-xs text-muted">
                  Test the platform in action on NEAR Testnet.
                </p>
                <div className="mt-3 space-y-2">
                  <Link
                    href="/advertiser"
                    className="block text-xs font-semibold text-ink hover:underline"
                  >
                    → Advertiser Studio
                  </Link>
                  <Link
                    href="/publisher"
                    className="block text-xs font-semibold text-ink hover:underline"
                  >
                    → Publisher Portal
                  </Link>
                  <Link
                    href="/admin"
                    className="block text-xs font-semibold text-ink hover:underline"
                  >
                    → Operations Center
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </main>
  );
}

