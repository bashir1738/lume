"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  LockKeyhole,
  ShieldCheck,
  Zap,
  Coins,
  Cpu,
  Layers,
  Terminal,
  Database,
  ArrowRight,
  TrendingUp,
  Globe2,
  Check,
  ChevronDown,
  ChevronUp,
  Code2,
  Copy,
  ExternalLink,
} from "lucide-react";
import { MarketingHeader } from "@/components/layout/MarketingHeader";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/Badge";
import { AdPreviewSlot } from "@/components/ad/AdPreviewSlot";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"advertiser" | "publisher">("advertiser");
  const [activeCodeTab, setActiveCodeTab] = useState<"react" | "html" | "node">("react");
  const [codeCopied, setCodeCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const codeSnippets = {
    react: `import { useEffect, useState } from "react";
import { LumePublisher } from "@lume/sdk";

export function SponsorSlot() {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const lume = new LumePublisher({ 
      publisherId: "pub_018f9a2",
      placementId: "sidebar-top" 
    });

    lume.requestAd().then((creative) => {
      if (creative) {
        setAd(creative);
        lume.report("impression", creative.campaignId);
      }
    });
  }, []);

  if (!ad) return null;
  return <a href={ad.destUrl}><img src={ad.assetUrl} alt={ad.title} /></a>;
}`,
    html: `<!-- Include Lume lightweight SDK tag -->
<script src="https://cdn.lume.network/sdk.v1.js" async></script>

<div 
  data-lume-placement="header-banner" 
  data-lume-publisher="pub_018f9a2"
  style="min-height: 90px; width: 728px;">
</div>

<script>
  window.addEventListener('lume:ready', function(e) {
    Lume.init({ testnet: true });
  });
</script>`,
    node: `import { LumeCoordinator } from "@lume/sdk/server";

// Server-side event verification and batch generation
const coordinator = new LumeCoordinator({
  contractId: "lume-escrow.testnet",
  privateKey: process.env.NEAR_COORDINATOR_KEY
});

// Build idempotent settlement payload
const batch = await coordinator.buildSettlementBatch({
  campaignId: 4,
  maxLiabilities: 50
});

console.log("Ready for submission:", batch.batchId);`,
  };

  const copyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeCodeTab]);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const faqs = [
    {
      q: "Why does Lume deliberately split off-chain delivery from on-chain settlement?",
      a: "Directly writing millions of impressions or clicks to a blockchain creates massive latency, unbearable transaction gas fees, and severe privacy leaks. Lume serves ads in under 45ms and validates events against fraud algorithms off-chain, while the NEAR smart contract acts as the immutable financial layer holding approved token escrow, enforcing campaign caps, and settling aggregated publisher liabilities.",
    },
    {
      q: "How does Lume protect advertisers against click-fraud and bot spam?",
      a: "Every event reported through the SDK must pass server-side heuristics: cryptographic placement tokens, IP frequency caps, user-agent entropy scoring, and duplicate UUID nonce suppression. The contract only debits advertiser escrow for validated settlement batches submitted by authorized coordinators, completely insulating advertisers from bot farms.",
    },
    {
      q: "How are campaign funds escrowed and what tokens can be used?",
      a: "Advertisers deposit NEP-141 fungible tokens (such as USDC, USDT, or wrapped NEAR) into the Lume smart contract using NEAR's standard ft_transfer_call. Escrow is strictly non-custodial: funds are locked to the specific campaign ID and can only be distributed to verified publishers or refunded to the original advertiser upon campaign completion.",
    },
    {
      q: "How do publishers claim their earnings?",
      a: "When a settlement batch is submitted to the contract, each publisher's verified liabilities are credited atomically on-chain. Publishers can click 'Claim Earnings' at any time in their portal to trigger an instant NEAR transfer to their connected wallet. If a transfer ever encounters an error, a private rollback callback restores the balance, preventing fund loss.",
    },
    {
      q: "Why are all calculations done in integer base units?",
      a: "Floating-point math in financial systems leads to subtle rounding errors and vulnerability exploits. Lume operates purely in integer base units (e.g., 1 USDC = 1,000,000 base units @ 6 decimals), eliminating any precision drift between database aggregations and smart contract execution.",
    },
  ];

  return (
    <main className="min-h-screen bg-paper text-ink selection:bg-accent selection:text-ink">
      {/* Hero Section */}
      <div className="hero-grid border-b border-line">
        <MarketingHeader />

        <section className="mx-auto grid max-w-7xl gap-14 px-6 pb-24 pt-12 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:px-8 lg:pb-32 lg:pt-16">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-muted shadow-sm backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>NEAR Escrow Smart Contract v2.4 Live · Non-Custodial Media</span>
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.03] tracking-[-0.04em] sm:text-6xl md:text-7xl">
              Performance media with <span className="text-muted">settlement you can inspect.</span>
            </h1>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
              Lume connects media buyers and digital publishers through accountable ad coordination
              and NEAR smart contract escrow. Application services validate real traffic; the
              contract safeguards funds and guarantees instant payouts.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/advertiser"
                className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white shadow-xl shadow-ink/15 transition hover:-translate-y-0.5 hover:bg-ink/90"
              >
                Launch Advertiser Studio
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/publisher"
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink shadow-sm transition hover:border-ink hover:bg-paper"
              >
                Monetize as Publisher
              </Link>
              <Link
                href="/docs"
                className="text-sm font-medium text-muted hover:text-ink underline decoration-line underline-offset-4 transition hover:decoration-ink"
              >
                Architecture Docs
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-medium text-muted">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-ink" /> Pure integer base-unit accounting
              </span>
              <span className="inline-flex items-center gap-2">
                <LockKeyhole className="h-4 w-4 text-ink" /> Cryptographic NEP-141 escrow
              </span>
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-ink" /> Idempotent batch settlements
              </span>
            </div>
          </div>

          {/* Interactive Hero Widget */}
          <div className="relative lg:pl-6">
            <div className="absolute -inset-6 rounded-full bg-accent/25 blur-3xl pointer-events-none" />

            <div className="relative rounded-3xl border border-line bg-white/90 p-6 shadow-2xl shadow-ink/10 backdrop-blur sm:p-8">
              {/* Persona toggle in hero */}
              <div className="flex items-center justify-between border-b border-line pb-5">
                <div className="flex rounded-full border border-line bg-paper p-1 text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab("advertiser")}
                    className={`rounded-full px-3 py-1.5 transition ${
                      activeTab === "advertiser"
                        ? "bg-white text-ink shadow-sm"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    Advertiser Ledger
                  </button>
                  <button
                    onClick={() => setActiveTab("publisher")}
                    className={`rounded-full px-3 py-1.5 transition ${
                      activeTab === "publisher"
                        ? "bg-white text-ink shadow-sm"
                        : "text-muted hover:text-ink"
                    }`}
                  >
                    Publisher Settlement
                  </button>
                </div>
                <Badge variant="success" size="sm">
                  Contract Verified
                </Badge>
              </div>

              {activeTab === "advertiser" ? (
                <div className="mt-6 space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                        Active Campaign Escrow
                      </span>
                      <h3 className="mt-1 text-2xl font-bold tracking-tight text-ink">
                        Q4 Global Web3 Awareness
                      </h3>
                      <p className="text-xs text-muted font-mono mt-0.5">
                        Contract Campaign ID: #00492 · NEP-141 USDC
                      </p>
                    </div>
                    <Badge variant="accent" size="sm">
                      Live Delivery
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="rounded-2xl border border-line bg-paper p-4">
                      <span className="text-xs text-muted font-medium">On-Chain Escrowed</span>
                      <p className="mt-1.5 text-2xl font-bold tracking-tight text-ink">
                        12,480.00 <span className="text-xs font-normal text-muted">USDC</span>
                      </p>
                      <span className="mt-1 block text-[11px] text-emerald-700">
                        100% reserved in smart contract
                      </span>
                    </div>

                    <div className="rounded-2xl border border-line bg-paper p-4">
                      <span className="text-xs text-muted font-medium">Verified Impressions</span>
                      <p className="mt-1.5 text-2xl font-bold tracking-tight text-ink">84,210</p>
                      <span className="mt-1 block text-[11px] text-muted">
                        Across 18 audited domains
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-muted">Escrow Burn vs Remaining</span>
                      <span className="font-semibold text-ink">67.8% Delivered</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-paper border border-line/60">
                      <div className="h-full rounded-full bg-ink transition-all" style={{ width: "67.8%" }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-muted">
                      <span>Spent: 8,460.00 USDC</span>
                      <span>Remaining: 4,020.00 USDC</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-line bg-paper/70 p-4 text-xs leading-relaxed">
                    <div className="flex items-center gap-2 font-semibold text-ink">
                      <ShieldCheck className="h-4 w-4 text-ink" />
                      <span>Zero Unspent Loss Guarantee</span>
                    </div>
                    <p className="mt-1 text-muted">
                      If you pause or complete this campaign, remaining escrow (4,020.00 USDC) is
                      instantly refundable to your NEAR account with zero fees.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mt-6 space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted">
                        Publisher Node
                      </span>
                      <h3 className="mt-1 text-2xl font-bold tracking-tight text-ink">
                        lume-network.testnet
                      </h3>
                      <p className="text-xs text-muted font-mono mt-0.5">
                        Placements: 8 registered · 100% DNS verified
                      </p>
                    </div>
                    <Badge variant="accent" size="sm">
                      Earning
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="rounded-2xl border border-line bg-paper p-4">
                      <span className="text-xs text-muted font-medium">Claimable on Contract</span>
                      <p className="mt-1.5 text-2xl font-bold tracking-tight text-ink">
                        1,248.50 <span className="text-xs font-normal text-muted">USDC</span>
                      </p>
                      <span className="mt-1 block text-[11px] text-emerald-700">
                        Ready to claim in 1 block
                      </span>
                    </div>

                    <div className="rounded-2xl border border-line bg-paper p-4">
                      <span className="text-xs text-muted font-medium">Batch #0247 Status</span>
                      <p className="mt-1.5 text-2xl font-bold tracking-tight text-ink">Finalized</p>
                      <span className="mt-1 block text-[11px] text-muted">Block 118,402,890</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-line bg-emerald-50/60 p-4 text-xs text-emerald-900 border-emerald-200">
                    <p className="font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      Instant Non-Custodial Withdrawals
                    </p>
                    <p className="mt-1 leading-relaxed text-emerald-800">
                      Publishers don’t wait Net-30 or Net-60. Call <code>claim_earnings()</code> anytime to
                      receive NEP-141 tokens directly into your wallet.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Live Telemetry Ticker */}
      <section className="border-b border-line bg-white py-10 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Platform Protocol Telemetry
          </p>
          <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div className="text-center">
              <p className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">$4.82M+</p>
              <p className="mt-1.5 text-xs text-muted font-medium">Total Escrow Processed (USDC)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">128.4M</p>
              <p className="mt-1.5 text-xs text-muted font-medium">Verified Ad Impressions</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">&lt; 2.4s</p>
              <p className="mt-1.5 text-xs text-muted font-medium">Batch Settlement Speed</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">99.98%</p>
              <p className="mt-1.5 text-xs text-muted font-medium">Settlement Execution Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works: 3 Architectural Pillars */}
      <section id="how-it-works" className="border-b border-line bg-paper py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
                Architectural Integrity
              </span>
              <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
                The workflow is effortless. The verification is mathematically bounded.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-muted">
              By isolating high-volume ad delivery from on-chain accounting, Lume scales to millions
              of daily requests without congesting NEAR or exposing advertisers to bot spam.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "1. Deposit Escrow",
                headline: "Authoritative Financial Escrow",
                body: "Advertisers deposit NEP-141 tokens (USDC/USDT) into the contract via ft_transfer_call. Escrow is mapped directly to campaign IDs, preventing arbitrary reallocation.",
                icon: Coins,
              },
              {
                step: "02",
                title: "2. Edge Ad Delivery",
                headline: "Sub-45ms Delivery & Anti-Fraud",
                body: "Publishers embed the lightweight SDK. The backend matches geo and inventory parameters, evaluates bot scores, and rejects duplicate UUID nonces before logging liabilities.",
                icon: Zap,
              },
              {
                step: "03",
                title: "3. Batch Settlement",
                headline: "Idempotent Smart Contract Payouts",
                body: "Authorized coordinators assemble unique batches debited against campaign escrow. Publisher claim balances increase atomically, ready for 1-click on-chain withdrawal.",
                icon: Database,
              },
            ].map((col) => {
              const Icon = col.icon;
              return (
                <div
                  key={col.step}
                  className="group relative rounded-3xl border border-line bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-muted">{col.step}</span>
                    <div className="rounded-2xl bg-paper p-3 text-ink group-hover:bg-accent/30 transition">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <h3 className="mt-8 text-xl font-bold text-ink">{col.headline}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{col.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Split Architecture Section with Visual Diagram */}
      <section id="architecture" className="border-b border-line bg-white py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
              Dual-Layer Specification
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Why Browser Events Never Directly Command Escrow
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Most Web3 advertising attempts fail because they treat client-side impressions as payable transactions.
              In Lume, the browser is an untrusted observer; only verified, aggregated batches touch the blockchain.
            </p>
          </div>

          <div className="mt-14 rounded-3xl border border-line bg-paper p-6 sm:p-10">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              {/* Architecture Explanation */}
              <div className="space-y-6">
                <div className="rounded-2xl border border-line bg-white p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-blue-50 p-2.5 text-blue-700">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-ink">Layer 1: Off-Chain Verification Engine</h4>
                      <p className="text-xs text-muted">Next.js 15 + MongoDB High-Speed Ingestion</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted">
                    Handles sub-second creative serving, placement authentication, user-agent entropy inspection,
                    and cryptographically signed impression tracking. Calculates exact liabilities using integer base units.
                  </p>
                </div>

                <div className="rounded-2xl border border-line bg-white p-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700">
                      <Layers className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-ink">Layer 2: NEAR Escrow Smart Contract</h4>
                      <p className="text-xs text-muted">Rust NEAR Contract · NEP-141 Approved Tokens</p>
                    </div>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-muted">
                    Holds advertiser capital securely. Accepts idempotent settlement batches signed by authorized
                    coordinators. Enforces campaign budget bounds and allows publishers to pull claims safely.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs font-medium text-ink bg-white/70 p-4 rounded-xl border border-line">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />
                  <span>
                    Private callback recovery: If an asynchronous token claim fails, liabilities are restored
                    automatically rather than lost in an unrecoverable state.
                  </span>
                </div>
              </div>

              {/* Visual Flow diagram */}
              <div className="rounded-2xl border border-line bg-ink p-6 sm:p-8 text-white">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  End-to-End Execution Pipeline
                </p>

                <div className="mt-6 space-y-4 font-mono text-xs">
                  <div className="rounded-xl bg-white/10 p-3.5 border border-white/10">
                    <div className="flex items-center justify-between text-white/60">
                      <span>Step 1: Advertiser</span>
                      <span className="text-[10px] bg-white/15 px-1.5 py-0.5 rounded">ft_transfer_call</span>
                    </div>
                    <p className="mt-1 font-semibold text-white">Escrow 5,000 USDC into Contract</p>
                  </div>

                  <div className="flex justify-center text-accent">
                    <ChevronDown className="h-4 w-4 animate-bounce" />
                  </div>

                  <div className="rounded-xl bg-white/10 p-3.5 border border-white/10">
                    <div className="flex items-center justify-between text-white/60">
                      <span>Step 2: Publisher Site</span>
                      <span className="text-[10px] bg-white/15 px-1.5 py-0.5 rounded">requestAd()</span>
                    </div>
                    <p className="mt-1 font-semibold text-white">Creative delivered in &lt; 40ms</p>
                  </div>

                  <div className="flex justify-center text-accent">
                    <ChevronDown className="h-4 w-4 animate-bounce" />
                  </div>

                  <div className="rounded-xl bg-white/10 p-3.5 border border-white/10">
                    <div className="flex items-center justify-between text-white/60">
                      <span>Step 3: Verification Gateway</span>
                      <span className="text-[10px] bg-white/15 px-1.5 py-0.5 rounded">dedupe & score</span>
                    </div>
                    <p className="mt-1 font-semibold text-white">Validate beacon signature & nonces</p>
                  </div>

                  <div className="flex justify-center text-accent">
                    <ChevronDown className="h-4 w-4 animate-bounce" />
                  </div>

                  <div className="rounded-xl bg-accent/20 p-3.5 border border-accent/40 text-white">
                    <div className="flex items-center justify-between text-accent">
                      <span>Step 4: Smart Contract</span>
                      <span className="text-[10px] bg-accent/30 px-1.5 py-0.5 rounded text-white">
                        submit_settlement
                      </span>
                    </div>
                    <p className="mt-1 font-semibold text-white">
                      Debits campaign escrow → Credits publisher claimable balance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Ad Simulator */}
      <section className="border-b border-line bg-paper py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
              Live Interactive Sandbox
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Experience the Publisher Ad Slot
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Click the test beacons below to simulate an impression or verified click. Notice how the
              beacon status updates and validates against duplicate event suppressors.
            </p>
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-2 items-start">
            <AdPreviewSlot
              headline="NEAR Horizon: Zero-Friction Web3 Growth"
              bodyText="Access grants, token liquidity, and technical support to scale your decentralized application."
              ctaText="Explore Program"
              format="rectangle"
              rateCpm="3.20 USDC"
            />
            <div className="space-y-4">
              <AdPreviewSlot
                headline="Aurora Cloud — High-Throughput EVM Engine"
                bodyText="Ultra-low transaction fees with familiar Ethereum tooling powered by NEAR."
                ctaText="Deploy Contract"
                format="leaderboard"
                rateCpm="4.50 USDC"
              />
              <AdPreviewSlot
                headline="Calimero Private Sharding Framework"
                bodyText="Enterprise-grade privacy layers for mission-critical institutional operations."
                ctaText="Read Whitepaper"
                format="native"
                rateCpm="2.80 USDC"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Web2 vs Lume Comparison Matrix */}
      <section id="comparison" className="border-b border-line bg-white py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
              Marketplace Economics
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Web2 Ad Networks vs. Lume Protocol
            </h2>
            <p className="mt-3 text-sm text-muted">
              Eliminating opaque middleman margins and clawback risks through cryptographic transparency.
            </p>
          </div>

          <div className="mt-12 overflow-x-auto rounded-3xl border border-line bg-paper">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line bg-white text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="py-4 px-6 font-semibold">Feature Dimension</th>
                  <th className="py-4 px-6 font-semibold text-muted">Legacy Ad Networks (Google / Taboola)</th>
                  <th className="py-4 px-6 font-semibold text-ink bg-accent/20">Lume Decentralized Escrow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line/60 bg-white">
                <tr>
                  <td className="py-4 px-6 font-semibold text-ink">Intermediary Take Rate</td>
                  <td className="py-4 px-6 text-muted">35% – 55% extracted by ad tech brokers</td>
                  <td className="py-4 px-6 font-bold text-emerald-700 bg-accent/10">
                    &lt; 2.5% protocol settlement fee
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-ink">Publisher Payout Latency</td>
                  <td className="py-4 px-6 text-muted">Net-30 or Net-60 days; held at platform discretion</td>
                  <td className="py-4 px-6 font-bold text-emerald-700 bg-accent/10">
                    Instant on-chain claims after batch finalization
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-ink">Ledger Verifiability</td>
                  <td className="py-4 px-6 text-muted">Closed proprietary database; impossible to audit</td>
                  <td className="py-4 px-6 font-bold text-emerald-700 bg-accent/10">
                    NEAR public ledger: balances, batches & claims
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-ink">Advertiser Refund Guarantee</td>
                  <td className="py-4 px-6 text-muted">Complex dispute tickets; platform store credits</td>
                  <td className="py-4 px-6 font-bold text-emerald-700 bg-accent/10">
                    Contractual close_campaign() returns unspent tokens
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-6 font-semibold text-ink">Arithmetic Precision</td>
                  <td className="py-4 px-6 text-muted">Floating-point arithmetic susceptible to drift</td>
                  <td className="py-4 px-6 font-bold text-emerald-700 bg-accent/10">
                    Strict u128 integer base units (zero rounding error)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Developer SDK Quickstart Section */}
      <section id="sdk" className="border-b border-line bg-paper py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
                Developer Integration
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Integrate in minutes. No blockchain complexity required.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                Publishers simply install the SDK or paste an HTML tag. The SDK handles ad requesting,
                local beacon deduplication, and fallback rendering while maintaining full web performance.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-ink p-1 text-white">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <strong className="text-sm font-semibold text-ink">Lightweight footprint (&lt; 14KB)</strong>
                    <p className="text-xs text-muted">Zero impact on Core Web Vitals or page load performance.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-ink p-1 text-white">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <strong className="text-sm font-semibold text-ink">Local Nonce Duplicate Filter</strong>
                    <p className="text-xs text-muted">Suppresses accidental double-clicks or rapid viewport loops.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-ink p-1 text-white">
                    <Check className="h-3 w-3" />
                  </div>
                  <div>
                    <strong className="text-sm font-semibold text-ink">Full TypeScript Support</strong>
                    <p className="text-xs text-muted">Typed interfaces for AdCreative, AdEvent, and placement configurations.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Link
                  href="/docs#sdk"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-semibold text-white hover:bg-ink/90 transition"
                >
                  <Code2 className="h-4 w-4" /> Full SDK Reference
                </Link>
                <Link
                  href="/publisher"
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-xs font-semibold text-ink hover:border-ink transition"
                >
                  Generate Publisher Keys
                </Link>
              </div>
            </div>

            {/* Code Box */}
            <div className="rounded-3xl border border-line bg-ink p-6 text-white shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveCodeTab("react")}
                    className={`rounded-lg px-3 py-1 text-xs font-mono transition ${
                      activeCodeTab === "react"
                        ? "bg-white/20 text-white font-bold"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    React / Next.js
                  </button>
                  <button
                    onClick={() => setActiveCodeTab("html")}
                    className={`rounded-lg px-3 py-1 text-xs font-mono transition ${
                      activeCodeTab === "html"
                        ? "bg-white/20 text-white font-bold"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    Vanilla HTML
                  </button>
                  <button
                    onClick={() => setActiveCodeTab("node")}
                    className={`rounded-lg px-3 py-1 text-xs font-mono transition ${
                      activeCodeTab === "node"
                        ? "bg-white/20 text-white font-bold"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    Node.js Server
                  </button>
                </div>

                <button
                  onClick={copyCode}
                  className="inline-flex items-center gap-1 text-xs font-mono text-white/70 hover:text-white transition"
                >
                  {codeCopied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
                  {codeCopied ? "Copied" : "Copy"}
                </button>
              </div>

              <pre className="mt-4 overflow-x-auto font-mono text-xs text-white/90 leading-relaxed max-h-96">
                <code>{codeSnippets[activeCodeTab]}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions Accordion */}
      <section className="border-b border-line bg-white py-24 px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-muted">
              Clear Answers
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-sm text-muted">
              Technical specifics on escrow mechanics, fraud scoring, and token settlements.
            </p>
          </div>

          <div className="mt-12 space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-line bg-paper transition hover:border-ink/40"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <span className="text-base font-semibold text-ink">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-muted shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted shrink-0 ml-4" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="border-t border-line/60 px-6 pb-6 pt-2 text-sm leading-relaxed text-muted">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-ink text-white py-20 px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
        <div className="mx-auto max-w-5xl text-center relative z-10">
          <span className="rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider text-accent border border-white/15">
            Decentralized Media Infrastructure
          </span>
          <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Start buying or monetizing with on-chain accountability today.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/70 leading-relaxed">
            Eliminate middleman fee leakage, eliminate fraud-driven chargebacks, and settle media
            liabilities directly on NEAR Protocol.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/advertiser"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-ink transition hover:bg-paper shadow-lg"
            >
              Start Advertiser Campaign <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/publisher"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Monetize Placement Inventory
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
