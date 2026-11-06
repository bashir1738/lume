"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  CircleDollarSign,
  ExternalLink,
  Globe2,
  Plus,
  Radio,
  TrendingUp,
  Coins,
  ShieldCheck,
  Copy,
  Check,
  X,
  Play,
  Pause,
  Code2,
  Terminal,
  FileCheck2,
  Search,
  Filter,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { WorkspaceHeader } from "@/components/layout/WorkspaceHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AdPreviewSlot } from "@/components/ad/AdPreviewSlot";
import { useWallet } from "@/lib/wallet/WalletContext";

interface PlacementItem {
  id: string;
  name: string;
  domain: string;
  format: "Leaderboard (728x90)" | "Rectangle (300x250)" | "Native Card" | "Skyscraper (160x600)";
  events30d: string;
  fillRate: string;
  ecpm: string;
  earningsUsdc: string;
  status: "Active" | "Paused" | "Under Review";
}

const INITIAL_PLACEMENTS: PlacementItem[] = [
  {
    id: "slot-01",
    name: "Homepage Top Banner",
    domain: "lume.news",
    format: "Leaderboard (728x90)",
    events30d: "12,840",
    fillRate: "98.2%",
    ecpm: "$3.45",
    earningsUsdc: "1,020.00 USDC",
    status: "Active",
  },
  {
    id: "slot-02",
    name: "Newsletter Issue Header",
    domain: "open-source.weekly",
    format: "Native Card",
    events30d: "8,440",
    fillRate: "95.0%",
    ecpm: "$4.12",
    earningsUsdc: "680.00 USDC",
    status: "Active",
  },
  {
    id: "slot-03",
    name: "Design Resources Sidebar",
    domain: "design.systems",
    format: "Rectangle (300x250)",
    events30d: "5,120",
    fillRate: "97.4%",
    ecpm: "$2.90",
    earningsUsdc: "420.00 USDC",
    status: "Active",
  },
  {
    id: "slot-04",
    name: "Tech Blog Sticky Footer",
    domain: "dev-radar.io",
    format: "Leaderboard (728x90)",
    events30d: "2,100",
    fillRate: "92.1%",
    ecpm: "$2.50",
    earningsUsdc: "185.00 USDC",
    status: "Paused",
  },
];

export default function PublisherPage() {
  const { account } = useWallet();
  const [activeTab, setActiveTab] = useState<"placements" | "settlements" | "verification" | "sdk">("placements");
  const [placements, setPlacements] = useState<PlacementItem[]>(INITIAL_PLACEMENTS);
  const [claimableBalance, setClaimableBalance] = useState("1,248.50");
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimSuccessMessage, setClaimSuccessMessage] = useState<string | null>(null);

  // Registration modal state
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [newDomain, setNewDomain] = useState("crypto-insider.xyz");
  const [newSlotName, setNewSlotName] = useState("Article Header Banner");
  const [newFormat, setNewFormat] = useState<PlacementItem["format"]>("Leaderboard (728x90)");

  // Site verification state
  const [verifyDomain, setVerifyDomain] = useState("lume.news");
  const [verifyStatus, setVerifyStatus] = useState<"verified" | "checking" | "idle">("verified");
  const [copiedTxt, setCopiedTxt] = useState(false);

  // SDK snippet state
  const [sdkFramework, setSdkFramework] = useState<"react" | "html" | "vue">("react");
  const [sdkCopied, setSdkCopied] = useState(false);

  const togglePlacementStatus = (id: string) => {
    setPlacements((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const next = p.status === "Active" ? "Paused" : "Active";
          return { ...p, status: next };
        }
        return p;
      })
    );
  };

  const handleClaim = () => {
    setIsClaiming(true);
    setTimeout(() => {
      setIsClaiming(false);
      setClaimSuccessMessage(
        `Successfully transferred ${claimableBalance} USDC directly to ${account?.accountId || "lume-network.testnet"} via NEAR NEP-141!`
      );
      setClaimableBalance("0.00");
      setTimeout(() => setClaimSuccessMessage(null), 4000);
    }, 1500);
  };

  const handleRegisterPlacement = (e: React.FormEvent) => {
    e.preventDefault();
    const newItem: PlacementItem = {
      id: `slot-0${placements.length + 1}`,
      name: newSlotName,
      domain: newDomain,
      format: newFormat,
      events30d: "0",
      fillRate: "100%",
      ecpm: "$3.00",
      earningsUsdc: "0.00 USDC",
      status: "Active",
    };
    setPlacements([newItem, ...placements]);
    setRegisterModalOpen(false);
  };

  const handleRunVerification = () => {
    setVerifyStatus("checking");
    setTimeout(() => {
      setVerifyStatus("verified");
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-paper text-ink pb-24">
      <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <WorkspaceHeader label="Publisher workspace" />

        {/* Claim Earnings Hero Card */}
        <section className="pt-8">
          <div className="rounded-3xl border border-line bg-gradient-to-br from-white via-white to-accent/10 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Publisher Node Account: {account?.accountId || "lume-network.testnet"}</span>
                </div>
                <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-ink">
                  Claimable Publisher Earnings
                </h1>
                <p className="mt-2 text-sm text-muted max-w-xl">
                  Accrued from verified, deduplicated ad impressions. Debited from advertiser escrow
                  and claimable non-custodially at any time.
                </p>
              </div>

              {/* Claim Action Box */}
              <div className="rounded-2xl border border-line bg-white p-5 shadow-sm min-w-[280px]">
                <span className="text-xs text-muted font-medium">Available on Smart Contract</span>
                <p className="mt-1 text-3xl font-bold text-ink">
                  {claimableBalance} <span className="text-sm font-semibold text-muted">USDC</span>
                </p>

                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={handleClaim}
                    disabled={isClaiming || claimableBalance === "0.00"}
                    className="flex-1 rounded-xl bg-ink py-2.5 text-xs font-semibold text-white shadow hover:bg-ink/90 transition disabled:opacity-50"
                  >
                    {isClaiming ? "Broadcasting NEAR Claim..." : "Claim to Wallet"}
                  </Button>
                </div>
              </div>
            </div>

            {claimSuccessMessage && (
              <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{claimSuccessMessage}</span>
              </div>
            )}
          </div>

          {/* 4 KPI Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-muted">Registered Placements</span>
                <div className="rounded-xl bg-paper p-2">
                  <Globe2 className="h-4 w-4 text-ink" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-ink">
                0{placements.length}
              </p>
              <p className="mt-2 text-xs text-muted">Across 3 verified domains</p>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-muted">Verified Events</span>
                <div className="rounded-xl bg-paper p-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-ink">26,400</p>
              <div className="mt-2 text-xs text-emerald-700 font-medium">
                +18.6% vs previous month
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-muted">Average Network eCPM</span>
                <div className="rounded-xl bg-paper p-2">
                  <CircleDollarSign className="h-4 w-4 text-ink" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-ink">$3.42</p>
              <p className="mt-2 text-xs text-muted">Top placement: $4.12 USDC</p>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-muted">Inventory Fill Rate</span>
                <div className="rounded-xl bg-paper p-2">
                  <Radio className="h-4 w-4 text-accent" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-ink">96.8%</p>
              <p className="mt-2 text-xs text-muted">Zero unfilled ad flicker</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex items-center justify-between border-b border-line pb-3">
            <div className="flex items-center gap-2 overflow-x-auto text-xs font-semibold">
              <button
                onClick={() => setActiveTab("placements")}
                className={`rounded-full px-4 py-2 transition ${
                  activeTab === "placements"
                    ? "bg-ink text-white shadow-sm"
                    : "text-muted hover:text-ink hover:bg-white"
                }`}
              >
                Placements & Inventory ({placements.length})
              </button>
              <button
                onClick={() => setActiveTab("settlements")}
                className={`rounded-full px-4 py-2 transition ${
                  activeTab === "settlements"
                    ? "bg-ink text-white shadow-sm"
                    : "text-muted hover:text-ink hover:bg-white"
                }`}
              >
                Settlements & Ledger
              </button>
              <button
                onClick={() => setActiveTab("verification")}
                className={`rounded-full px-4 py-2 transition ${
                  activeTab === "verification"
                    ? "bg-ink text-white shadow-sm"
                    : "text-muted hover:text-ink hover:bg-white"
                }`}
              >
                Domain Verification (DNS/HTML)
              </button>
              <button
                onClick={() => setActiveTab("sdk")}
                className={`rounded-full px-4 py-2 transition ${
                  activeTab === "sdk"
                    ? "bg-ink text-white shadow-sm"
                    : "text-muted hover:text-ink hover:bg-white"
                }`}
              >
                SDK Integration Code
              </button>
            </div>

            <Button
              onClick={() => setRegisterModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white shadow hover:bg-ink/90"
            >
              <Plus className="h-3.5 w-3.5" /> Register Placement
            </Button>
          </div>

          {/* TAB 1: PLACEMENTS TABLE */}
          {activeTab === "placements" && (
            <div className="mt-6 space-y-6 animate-in fade-in duration-150">
              <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-line bg-paper text-muted uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-4 px-5">Slot Name & ID</th>
                      <th className="py-4 px-4">Domain</th>
                      <th className="py-4 px-4">Ad Format</th>
                      <th className="py-4 px-4">30d Events</th>
                      <th className="py-4 px-4">Fill Rate</th>
                      <th className="py-4 px-4">eCPM</th>
                      <th className="py-4 px-4">Total Earned</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {placements.map((p) => (
                      <tr key={p.id} className="hover:bg-paper/50 transition">
                        <td className="py-4 px-5">
                          <p className="font-semibold text-ink text-sm">{p.name}</p>
                          <p className="text-[11px] text-muted font-mono">{p.id}</p>
                        </td>
                        <td className="py-4 px-4 font-mono font-medium text-ink">{p.domain}</td>
                        <td className="py-4 px-4 text-muted">{p.format}</td>
                        <td className="py-4 px-4 font-mono font-medium">{p.events30d}</td>
                        <td className="py-4 px-4">{p.fillRate}</td>
                        <td className="py-4 px-4 font-bold text-ink">{p.ecpm}</td>
                        <td className="py-4 px-4 font-bold text-emerald-700">{p.earningsUsdc}</td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={p.status === "Active" ? "success" : "warning"}
                            size="sm"
                          >
                            {p.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-5 text-right">
                          <button
                            onClick={() => togglePlacementStatus(p.id)}
                            className="rounded-lg border border-line bg-paper px-2.5 py-1 text-xs font-medium text-ink hover:border-ink transition"
                          >
                            {p.status === "Active" ? "Pause" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: SETTLEMENTS LEDGER */}
          {activeTab === "settlements" && (
            <div className="mt-6 space-y-6 animate-in fade-in duration-150">
              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <div>
                    <h3 className="font-bold text-ink text-base">On-Chain Settlement History</h3>
                    <p className="text-xs text-muted">
                      Every batch is verified against duplicate event nonces and campaign escrow before settlement.
                    </p>
                  </div>
                  <Badge variant="accent" size="sm">
                    Idempotent Batches
                  </Badge>
                </div>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="border-b border-line bg-paper text-muted uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Batch ID</th>
                        <th className="py-3 px-4">Settled At</th>
                        <th className="py-3 px-4">Verified Events</th>
                        <th className="py-3 px-4">Payout Amount</th>
                        <th className="py-3 px-4">NEAR Transaction Hash</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {[
                        { id: "batch_#0247", date: "Nov 02, 2026 14:22 UTC", events: "1,284 imps", amount: "2,840.00 USDC", tx: "8Gz7...41kL", status: "Claimed" },
                        { id: "batch_#0246", date: "Oct 28, 2026 09:15 UTC", events: "942 imps", amount: "1,980.00 USDC", tx: "2Nm1...90vP", status: "Claimed" },
                        { id: "batch_#0245", date: "Oct 24, 2026 11:40 UTC", events: "1,510 imps", amount: "3,120.00 USDC", tx: "7Kq9...18rT", status: "Claimed" },
                        { id: "batch_#0244", date: "Oct 20, 2026 16:05 UTC", events: "812 imps", amount: "1,450.00 USDC", tx: "3Yx2...55wQ", status: "Claimed" },
                      ].map((b) => (
                        <tr key={b.id} className="hover:bg-paper/50">
                          <td className="py-3.5 px-4 font-bold text-ink">{b.id}</td>
                          <td className="py-3.5 px-4 font-sans text-muted">{b.date}</td>
                          <td className="py-3.5 px-4">{b.events}</td>
                          <td className="py-3.5 px-4 font-bold text-emerald-700">{b.amount}</td>
                          <td className="py-3.5 px-4">
                            <a
                              href="https://testnet.nearblocks.io"
                              target="_blank"
                              rel="noreferrer"
                              className="text-muted hover:text-ink inline-flex items-center gap-1"
                            >
                              {b.tx} <ExternalLink className="h-3 w-3" />
                            </a>
                          </td>
                          <td className="py-3.5 px-4 font-sans">
                            <Badge variant="success" size="sm">{b.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DOMAIN VERIFICATION */}
          {activeTab === "verification" && (
            <div className="mt-6 space-y-6 animate-in fade-in duration-150">
              <div className="rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-ink">Website Domain Ownership Verification</h3>
                    <p className="mt-1 text-xs text-muted max-w-xl">
                      Prove that you own or control the media property before serving ads.
                      Unverified domains cannot participate in settlement batches.
                    </p>
                  </div>
                  <Badge variant="success" size="sm">
                    Verified Domain
                  </Badge>
                </div>

                <div className="mt-8 grid gap-8 lg:grid-cols-2">
                  {/* Method A: DNS TXT */}
                  <div className="rounded-2xl border border-line bg-paper p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded border border-line">
                        Method 1
                      </span>
                      <h4 className="font-bold text-sm text-ink">DNS TXT Record (Recommended)</h4>
                    </div>
                    <p className="text-xs text-muted">
                      Add a TXT record to your root domain DNS configuration:
                    </p>

                    <div className="rounded-xl border border-line bg-white p-3 font-mono text-xs text-ink/90 flex items-center justify-between">
                      <span className="truncate">lume-site-verification=pub_018f9a2e4b78912</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("lume-site-verification=pub_018f9a2e4b78912");
                          setCopiedTxt(true);
                          setTimeout(() => setCopiedTxt(false), 2000);
                        }}
                        className="p-1 text-muted hover:text-ink ml-2 shrink-0"
                      >
                        {copiedTxt ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Method B: HTML Meta Tag */}
                  <div className="rounded-2xl border border-line bg-paper p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-white px-2 py-0.5 rounded border border-line">
                        Method 2
                      </span>
                      <h4 className="font-bold text-sm text-ink">HTML &lt;meta&gt; Tag</h4>
                    </div>
                    <p className="text-xs text-muted">
                      Add this tag inside your homepage &lt;head&gt; element:
                    </p>

                    <div className="rounded-xl border border-line bg-white p-3 font-mono text-xs text-ink/90 flex items-center justify-between">
                      <span className="truncate">&lt;meta name=&quot;lume-verify&quot; content=&quot;pub_018f9a2&quot;&gt;</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText('<meta name="lume-verify" content="pub_018f9a2">');
                          setCopiedTxt(true);
                          setTimeout(() => setCopiedTxt(false), 2000);
                        }}
                        className="p-1 text-muted hover:text-ink ml-2 shrink-0"
                      >
                        {copiedTxt ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-line pt-6">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Domain <strong>lume.news</strong> is currently verified and active.</span>
                  </div>
                  <Button
                    onClick={handleRunVerification}
                    className="rounded-xl bg-ink px-4 py-2 text-xs font-semibold text-white"
                  >
                    {verifyStatus === "checking" ? "Checking DNS Records..." : "Re-check DNS Status"}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SDK CODE GENERATOR */}
          {activeTab === "sdk" && (
            <div className="mt-6 space-y-6 animate-in fade-in duration-150">
              <div className="grid gap-8 lg:grid-cols-2 items-start">
                <div className="rounded-3xl border border-line bg-white p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-line pb-4">
                    <h3 className="font-bold text-sm text-ink">Integration Snippet Generator</h3>
                    <div className="flex gap-1 text-xs">
                      {["react", "html", "vue"].map((fw) => (
                        <button
                          key={fw}
                          onClick={() => setSdkFramework(fw as any)}
                          className={`rounded-lg px-2.5 py-1 uppercase font-mono font-bold transition ${
                            sdkFramework === fw
                              ? "bg-ink text-white"
                              : "bg-paper text-muted hover:text-ink"
                          }`}
                        >
                          {fw}
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-muted">
                    Paste this snippet into your website markup where you want the ad slot to render.
                  </p>

                  <div className="relative rounded-2xl border border-line bg-ink p-4 font-mono text-xs text-white">
                    <button
                      onClick={() => {
                        setSdkCopied(true);
                        setTimeout(() => setSdkCopied(false), 2000);
                      }}
                      className="absolute right-3 top-3 inline-flex items-center gap-1 text-white/60 hover:text-white"
                    >
                      {sdkCopied ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
                      {sdkCopied ? "Copied" : "Copy"}
                    </button>

                    <pre className="overflow-x-auto text-white/90 pt-5 leading-relaxed">
                      {sdkFramework === "react" &&
                        `import { LumePublisher } from "@lume/sdk";

export function AdSlot() {
  return (
    <div 
      data-lume-publisher="lume-network.testnet" 
      data-lume-placement="slot-01" 
      className="lume-ad-container" 
    />
  );
}`}
                      {sdkFramework === "html" &&
                        `<!-- Embed Lume Slot -->
<div 
  data-lume-publisher="lume-network.testnet" 
  data-lume-placement="slot-01" 
  style="min-height: 90px; width: 728px;">
</div>
<script src="https://cdn.lume.network/sdk.v1.js" async></script>`}
                      {sdkFramework === "vue" &&
                        `<template>
  <div 
    data-lume-publisher="lume-network.testnet"
    data-lume-placement="slot-01"
  />
</template>`}
                    </pre>
                  </div>
                </div>

                {/* Live Slot Preview */}
                <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
                  <h4 className="font-bold text-sm text-ink mb-4">Live Placement Rendering Test</h4>
                  <AdPreviewSlot
                    name="Aurora Cloud Engine"
                    headline="Ultra-Fast EVM on NEAR Protocol"
                    bodyText="Scalable transaction speeds with turnkey cross-chain smart contract settlement."
                    ctaText="Deploy on Aurora"
                    format="leaderboard"
                    rateCpm="3.45 USDC"
                  />
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Register Placement Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setRegisterModalOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <h3 className="font-bold text-ink">Register Placement Slot</h3>
              <button
                onClick={() => setRegisterModalOpen(false)}
                className="rounded-full p-1 text-muted hover:bg-paper"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRegisterPlacement} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-muted">Website Domain</label>
                <input
                  type="text"
                  required
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-ink font-semibold focus:border-ink focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted">Placement Tag / Name</label>
                <input
                  type="text"
                  required
                  value={newSlotName}
                  onChange={(e) => setNewSlotName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-ink font-semibold focus:border-ink focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-muted">Slot Dimensions / Format</label>
                <select
                  value={newFormat}
                  onChange={(e) => setNewFormat(e.target.value as any)}
                  className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-ink font-semibold focus:border-ink focus:outline-none"
                >
                  <option>Leaderboard (728x90)</option>
                  <option>Rectangle (300x250)</option>
                  <option>Native Card</option>
                  <option>Skyscraper (160x600)</option>
                </select>
              </div>

              <div className="mt-6 flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRegisterModalOpen(false)}
                  className="flex-1 rounded-xl border border-line bg-paper py-2.5 font-semibold text-muted"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl bg-ink py-2.5 font-semibold text-white"
                >
                  Save & Generate Tag
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
