"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  MoreHorizontal,
  Plus,
  WalletCards,
  Coins,
  Search,
  Filter,
  Play,
  Pause,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Globe2,
  Smartphone,
  Laptop,
  Check,
  X,
  Layers,
} from "lucide-react";
import { WorkspaceHeader } from "@/components/layout/WorkspaceHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";
import { useWallet } from "@/lib/wallet/WalletContext";

interface CampaignItem {
  id: string;
  name: string;
  category: string;
  pricingModel: "cpm" | "cpc";
  rate: string;
  escrowTotal: string;
  spent: string;
  progressPercent: number;
  impressions: string;
  clicks: string;
  ctr: string;
  status: "Live" | "Paused" | "Completed" | "Draft";
  onChainId: string;
}

const INITIAL_CAMPAIGNS: CampaignItem[] = [
  {
    id: "camp-001",
    name: "Q4 Global Web3 Awareness",
    category: "Display & Native · Global",
    pricingModel: "cpm",
    rate: "2.50 USDC",
    escrowTotal: "12,480.00 USDC",
    spent: "8,460.00 USDC",
    progressPercent: 67.8,
    impressions: "84,210",
    clicks: "3,014",
    ctr: "3.58%",
    status: "Live",
    onChainId: "00492",
  },
  {
    id: "camp-002",
    name: "Developer SDK Launch Retargeting",
    category: "Banner 300x250 · North America & Europe",
    pricingModel: "cpc",
    rate: "0.45 USDC",
    escrowTotal: "4,200.00 USDC",
    spent: "1,720.00 USDC",
    progressPercent: 41.0,
    impressions: "42,650",
    clicks: "3,822",
    ctr: "8.96%",
    status: "Live",
    onChainId: "00495",
  },
  {
    id: "camp-003",
    name: "Institutional DeFi Ecosystem Pilot",
    category: "Native Feed · Tier 1 Markets",
    pricingModel: "cpm",
    rate: "4.80 USDC",
    escrowTotal: "6,000.00 USDC",
    spent: "2,880.00 USDC",
    progressPercent: 48.0,
    impressions: "60,000",
    clicks: "1,920",
    ctr: "3.20%",
    status: "Paused",
    onChainId: "00498",
  },
  {
    id: "camp-004",
    name: "Q3 Ecosystem Retrospective",
    category: "Video & Newsletter · Global",
    pricingModel: "cpm",
    rate: "2.10 USDC",
    escrowTotal: "2,100.00 USDC",
    spent: "2,100.00 USDC",
    progressPercent: 100,
    impressions: "100,000",
    clicks: "3,800",
    ctr: "3.80%",
    status: "Completed",
    onChainId: "00478",
  },
];

export default function AdvertiserPage() {
  const { account } = useWallet();
  const [activeTab, setActiveTab] = useState<"overview" | "campaigns" | "escrow" | "audiences">("overview");
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(INITIAL_CAMPAIGNS);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Deposit modal state
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("1000");
  const [selectedCampaignForDeposit, setSelectedCampaignForDeposit] = useState(campaigns[0].id);
  const [depositSuccessMsg, setDepositSuccessMsg] = useState<string | null>(null);

  const toggleCampaignStatus = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const nextStatus = c.status === "Live" ? "Paused" : "Live";
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(depositAmount) || 0;
    if (numericAmount <= 0) return;

    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === selectedCampaignForDeposit) {
          const currentTotal = parseFloat(c.escrowTotal.replace(/,/g, "")) || 0;
          const newTotal = currentTotal + numericAmount;
          return {
            ...c,
            escrowTotal: `${newTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })} USDC`,
          };
        }
        return c;
      })
    );

    setDepositSuccessMsg(
      `Successfully deposited ${numericAmount.toLocaleString()} USDC via ft_transfer_call into Campaign #${selectedCampaignForDeposit}!`
    );
    setTimeout(() => {
      setDepositSuccessMsg(null);
      setDepositModalOpen(false);
    }, 2500);
  };

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesStatus = filterStatus === "All" || c.status === filterStatus;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-paper text-ink pb-20">
      <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <WorkspaceHeader label="Advertiser workspace" />

        {/* Dashboard Title & Actions Bar */}
        <section className="pt-8 pb-6">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Advertiser Console · Account: {account?.accountId || "aurora-media.testnet"}</span>
              </div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Campaign Operations & Escrow
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                Monitor verified ad impressions, keep budgets strictly accountable, and fund
                campaigns through non-custodial NEAR smart contract escrow.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => setDepositModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-xs font-semibold text-ink hover:border-ink hover:bg-paper transition shadow-sm"
              >
                <Coins className="h-4 w-4 text-emerald-600" /> Deposit Escrow
              </Button>

              <Link
                href="/advertiser/campaigns/new"
                className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-ink/90"
              >
                <Plus className="h-4 w-4" /> Create Campaign
              </Link>
            </div>
          </div>

          {/* Top 4 KPI Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-muted">Active Campaigns</span>
                <div className="rounded-xl bg-paper p-2">
                  <BarChart3 className="h-4 w-4 text-ink" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-ink">04</p>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                <span className="text-emerald-700 font-semibold">2 Live</span> · 1 Paused · 1 Completed
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-muted">Verified Impressions</span>
                <div className="rounded-xl bg-paper p-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-ink">84,210</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-emerald-700 font-medium">
                <TrendingUp className="h-3.5 w-3.5" /> +24.8% vs last week
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-muted">On-Chain Escrow Balance</span>
                <div className="rounded-xl bg-paper p-2">
                  <WalletCards className="h-4 w-4 text-ink" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-ink">12,480.00</p>
              <div className="mt-2 flex items-center justify-between text-xs text-muted">
                <span>USDC reserved</span>
                <span className="text-emerald-700 font-medium">Non-custodial</span>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-muted">Pending Settlement</span>
                <div className="rounded-xl bg-paper p-2">
                  <Clock3 className="h-4 w-4 text-amber-600" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-ink">2,840.00</p>
              <div className="mt-2 text-xs text-muted">
                Batch #0248 scheduled Friday 09:00 UTC
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex items-center gap-2 border-b border-line pb-3 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab("overview")}
              className={`rounded-full px-4 py-2 transition ${
                activeTab === "overview"
                  ? "bg-ink text-white shadow-sm"
                  : "text-muted hover:text-ink hover:bg-white"
              }`}
            >
              Overview & Analytics
            </button>
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`rounded-full px-4 py-2 transition ${
                activeTab === "campaigns"
                  ? "bg-ink text-white shadow-sm"
                  : "text-muted hover:text-ink hover:bg-white"
              }`}
            >
              Campaigns ({campaigns.length})
            </button>
            <button
              onClick={() => setActiveTab("escrow")}
              className={`rounded-full px-4 py-2 transition ${
                activeTab === "escrow"
                  ? "bg-ink text-white shadow-sm"
                  : "text-muted hover:text-ink hover:bg-white"
              }`}
            >
              NEAR Escrow & Refunds
            </button>
            <button
              onClick={() => setActiveTab("audiences")}
              className={`rounded-full px-4 py-2 transition ${
                activeTab === "audiences"
                  ? "bg-ink text-white shadow-sm"
                  : "text-muted hover:text-ink hover:bg-white"
              }`}
            >
              Placement Quality & Geo
            </button>
          </div>

          {/* TAB 1: OVERVIEW & ANALYTICS */}
          {activeTab === "overview" && (
            <div className="mt-6 space-y-8 animate-in fade-in duration-150">
              {/* Delivery Chart */}
              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <PerformanceChart />
              </div>

              {/* Two columns: Campaigns preview + Settlement ledger */}
              <div className="grid gap-6 lg:grid-cols-[1.3fr_.7fr]">
                {/* Campaigns preview list */}
                <div className="rounded-2xl border border-line bg-white overflow-hidden shadow-sm">
                  <div className="flex items-center justify-between border-b border-line px-6 py-4">
                    <div>
                      <h3 className="font-semibold text-sm text-ink">Active Delivery Streams</h3>
                      <p className="text-xs text-muted">Latest verified impression pacing</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("campaigns")}
                      className="text-xs font-semibold text-muted hover:text-ink"
                    >
                      View all →
                    </button>
                  </div>

                  <div className="divide-y divide-line">
                    {campaigns.slice(0, 3).map((camp) => (
                      <div key={camp.id} className="p-5 flex flex-wrap items-center justify-between gap-4">
                        <div className="min-w-[200px] flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm text-ink">{camp.name}</h4>
                            <Badge
                              variant={camp.status === "Live" ? "success" : "warning"}
                              size="sm"
                            >
                              {camp.status}
                            </Badge>
                          </div>
                          <p className="mt-1 text-xs text-muted">{camp.category}</p>
                        </div>

                        <div className="w-32">
                          <div className="flex justify-between text-[11px] text-muted mb-1">
                            <span>Delivered</span>
                            <span>{camp.progressPercent}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper">
                            <div
                              className="h-full rounded-full bg-ink"
                              style={{ width: `${camp.progressPercent}%` }}
                            />
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-bold text-ink">{camp.escrowTotal}</p>
                          <p className="text-[11px] text-muted">{camp.impressions} imps</p>
                        </div>

                        <button
                          onClick={() => toggleCampaignStatus(camp.id)}
                          className="rounded-lg border border-line p-2 text-muted hover:text-ink hover:bg-paper"
                          title={camp.status === "Live" ? "Pause Campaign" : "Resume Campaign"}
                        >
                          {camp.status === "Live" ? (
                            <Pause className="h-3.5 w-3.5" />
                          ) : (
                            <Play className="h-3.5 w-3.5 text-emerald-600" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Settlement Batch Aside */}
                <div className="rounded-2xl border border-line bg-ink p-6 text-white shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-mono tracking-wider text-accent">
                        Settlement Coordinator
                      </span>
                      <ShieldCheck className="h-4 w-4 text-accent" />
                    </div>
                    <h3 className="mt-4 text-3xl font-bold tracking-tight">Batch #0248</h3>
                    <p className="mt-1 text-xs text-white/70">
                      Scheduled execution: Friday at 09:00 UTC
                    </p>

                    <div className="mt-6 space-y-3 border-t border-white/15 pt-4 text-xs font-mono">
                      <div className="flex justify-between text-white/70">
                        <span>Queued Verified Events:</span>
                        <span className="text-white font-bold">1,284 events</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Debited from Escrow:</span>
                        <span className="text-white font-bold">2,840.00 USDC</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Unique Recipient Publishers:</span>
                        <span className="text-white font-bold">12 accounts</span>
                      </div>
                      <div className="flex justify-between text-white/70">
                        <span>Idempotent Batch Hash:</span>
                        <span className="text-accent truncate max-w-[140px]">
                          0x8f2d...91e4
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl bg-white/10 p-3.5 text-[11px] text-white/80 leading-relaxed border border-white/10">
                    Smart contract verifies that total payout never exceeds locked campaign balances before debiting.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ALL CAMPAIGNS TABLE */}
          {activeTab === "campaigns" && (
            <div className="mt-6 space-y-6 animate-in fade-in duration-150">
              {/* Filter and Search Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted" />
                  <span className="text-xs font-semibold text-muted">Status:</span>
                  {["All", "Live", "Paused", "Completed"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                        filterStatus === status
                          ? "bg-ink text-white font-semibold"
                          : "bg-paper text-muted hover:text-ink"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <div className="relative min-w-[240px]">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-line bg-paper pl-9 pr-4 py-1.5 text-xs text-ink placeholder:text-muted/60 focus:border-ink focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-line bg-white shadow-sm">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-line bg-paper text-muted uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-4 px-5">Campaign</th>
                      <th className="py-4 px-4">Rate Model</th>
                      <th className="py-4 px-4">Escrow Budget</th>
                      <th className="py-4 px-4">Burn Progress</th>
                      <th className="py-4 px-4">Impressions</th>
                      <th className="py-4 px-4">Clicks (CTR)</th>
                      <th className="py-4 px-4">Status</th>
                      <th className="py-4 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {filteredCampaigns.map((c) => (
                      <tr key={c.id} className="hover:bg-paper/50 transition">
                        <td className="py-4 px-5">
                          <p className="font-semibold text-ink text-sm">{c.name}</p>
                          <p className="text-[11px] text-muted font-mono">
                            ID: {c.id} · On-Chain #{c.onChainId}
                          </p>
                        </td>

                        <td className="py-4 px-4">
                          <span className="font-semibold text-ink uppercase">{c.pricingModel}</span>
                          <span className="block text-muted">{c.rate}</span>
                        </td>

                        <td className="py-4 px-4">
                          <p className="font-bold text-ink">{c.escrowTotal}</p>
                          <p className="text-muted">Spent: {c.spent}</p>
                        </td>

                        <td className="py-4 px-4 w-36">
                          <div className="flex justify-between text-[11px] text-muted mb-1">
                            <span>{c.progressPercent}%</span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper">
                            <div
                              className="h-full rounded-full bg-ink"
                              style={{ width: `${c.progressPercent}%` }}
                            />
                          </div>
                        </td>

                        <td className="py-4 px-4 font-mono font-medium">{c.impressions}</td>

                        <td className="py-4 px-4">
                          <span className="font-mono font-medium">{c.clicks}</span>
                          <span className="block text-muted text-[11px]">CTR: {c.ctr}</span>
                        </td>

                        <td className="py-4 px-4">
                          <Badge
                            variant={
                              c.status === "Live"
                                ? "success"
                                : c.status === "Paused"
                                ? "warning"
                                : "outline"
                            }
                            size="sm"
                          >
                            {c.status}
                          </Badge>
                        </td>

                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => toggleCampaignStatus(c.id)}
                              className="rounded-lg border border-line bg-paper px-2.5 py-1 text-xs font-medium text-ink hover:border-ink transition"
                            >
                              {c.status === "Live" ? "Pause" : "Resume"}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCampaignForDeposit(c.id);
                                setDepositModalOpen(true);
                              }}
                              className="rounded-lg bg-ink px-2.5 py-1 text-xs font-medium text-white hover:bg-ink/85 transition"
                            >
                              + Fund
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: NEAR ESCROW & REFUNDS */}
          {activeTab === "escrow" && (
            <div className="mt-6 space-y-6 animate-in fade-in duration-150">
              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-ink">
                      Non-Custodial Escrow Contract Integration
                    </h3>
                    <p className="mt-1 text-xs text-muted max-w-xl">
                      All campaign budgets are securely locked in the Rust smart contract on NEAR
                      Protocol. Unspent balances are 100% refundable at any time by calling <code>close_campaign()</code>.
                    </p>
                  </div>
                  <Badge variant="accent" size="sm">
                    NEP-141 USDC
                  </Badge>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-line bg-paper p-4">
                    <span className="text-xs text-muted">Total Escrow Deposited</span>
                    <p className="mt-2 text-2xl font-bold text-ink">24,780.00 USDC</p>
                    <span className="text-[11px] text-muted">Cumulative across all campaigns</span>
                  </div>

                  <div className="rounded-xl border border-line bg-paper p-4">
                    <span className="text-xs text-muted">Settled to Publishers</span>
                    <p className="mt-2 text-2xl font-bold text-ink">12,300.00 USDC</p>
                    <span className="text-[11px] text-emerald-700">Verified & distributed</span>
                  </div>

                  <div className="rounded-xl border border-line bg-paper p-4">
                    <span className="text-xs text-muted">Available Refundable Reserve</span>
                    <p className="mt-2 text-2xl font-bold text-ink">12,480.00 USDC</p>
                    <span className="text-[11px] text-muted">Guaranteed in contract balance</span>
                  </div>
                </div>

                {/* Refund mechanism explanation */}
                <div className="mt-8 rounded-xl border border-line bg-emerald-50/50 p-4 border-emerald-200">
                  <div className="flex items-center gap-2 font-semibold text-emerald-900 text-sm">
                    <ShieldCheck className="h-4 w-4 text-emerald-700" />
                    <span>How Automated Campaign Refunds Work</span>
                  </div>
                  <p className="mt-2 text-xs text-emerald-800 leading-relaxed">
                    When you close or pause an active campaign, the contract calculates:
                    <br />
                    <code>refund_amount = campaign.balance - pending_unsettled_liabilities</code>
                    <br />
                    The refund is transferred asynchronously back to your original NEAR account (
                    <code>{account?.accountId || "aurora-media.testnet"}</code>) via NEP-141 <code>ft_transfer</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIENCES & PLACEMENTS */}
          {activeTab === "audiences" && (
            <div className="mt-6 grid gap-6 lg:grid-cols-2 animate-in fade-in duration-150">
              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <h3 className="font-semibold text-sm text-ink flex items-center gap-2">
                    <Globe2 className="h-4 w-4 text-muted" /> Geographic Distribution
                  </h3>
                  <span className="text-xs text-muted">Last 30 Days</span>
                </div>

                <div className="mt-6 space-y-4 text-xs">
                  {[
                    { country: "United States (US)", share: 48, imps: "40,420" },
                    { country: "European Union (EU)", share: 28, imps: "23,578" },
                    { country: "United Kingdom (UK)", share: 12, imps: "10,105" },
                    { country: "Japan & APAC (JP/SG)", share: 8, imps: "6,736" },
                    { country: "Other Markets", share: 4, imps: "3,371" },
                  ].map((geo) => (
                    <div key={geo.country} className="space-y-1">
                      <div className="flex justify-between font-medium">
                        <span>{geo.country}</span>
                        <span>{geo.imps} imps ({geo.share}%)</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-paper overflow-hidden">
                        <div
                          className="h-full rounded-full bg-ink"
                          style={{ width: `${geo.share}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <h3 className="font-semibold text-sm text-ink flex items-center gap-2">
                    <Laptop className="h-4 w-4 text-muted" /> Top Publisher Placements
                  </h3>
                  <span className="text-xs text-muted">Fill & CTR Performance</span>
                </div>

                <div className="mt-4 divide-y divide-line text-xs">
                  {[
                    { domain: "lume.news", slot: "Homepage 728x90", ctr: "3.84%", score: 99.4 },
                    { domain: "web3-pulse.io", slot: "Article Native Feed", ctr: "4.12%", score: 98.9 },
                    { domain: "crypto-radar.xyz", slot: "Sidebar 300x250", ctr: "2.95%", score: 97.8 },
                    { domain: "open-source.weekly", slot: "Header Sponsor", ctr: "5.40%", score: 99.8 },
                  ].map((p) => (
                    <div key={p.domain} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-ink">{p.domain}</p>
                        <p className="text-muted text-[11px]">{p.slot}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-ink">{p.ctr} CTR</span>
                        <span className="block text-[10px] text-emerald-700">
                          {p.score}% quality score
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Interactive Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setDepositModalOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-3xl border border-line bg-white p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl bg-emerald-50 p-2 text-emerald-800">
                  <Coins className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-ink">Deposit Campaign Escrow</h3>
                  <p className="text-xs text-muted">NEP-141 Fungible Token Transfer</p>
                </div>
              </div>
              <button
                onClick={() => setDepositModalOpen(false)}
                className="rounded-full p-1 text-muted hover:bg-paper"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted">Select Target Campaign</label>
                <select
                  value={selectedCampaignForDeposit}
                  onChange={(e) => setSelectedCampaignForDeposit(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3 py-2 text-xs font-semibold text-ink focus:border-ink focus:outline-none"
                >
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (On-Chain #{c.onChainId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted">
                  Deposit Amount (USDC)
                </label>
                <div className="mt-1.5 relative">
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full rounded-xl border border-line bg-paper px-3.5 py-2 text-sm font-bold text-ink focus:border-ink focus:outline-none"
                    placeholder="1000"
                    required
                  />
                  <span className="absolute right-3.5 top-2.5 text-xs font-bold text-muted">
                    USDC
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-muted">
                  Integer Base Units:{" "}
                  <span className="font-mono font-semibold text-ink">
                    {(parseFloat(depositAmount) * 1_000_000 || 0).toLocaleString()} units
                  </span>
                </p>
              </div>

              <div className="rounded-xl border border-line bg-paper p-3 text-xs space-y-1.5">
                <div className="flex justify-between text-muted">
                  <span>Smart Contract Action:</span>
                  <span className="font-mono text-ink">ft_transfer_call</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Estimated NEAR Gas:</span>
                  <span className="font-mono text-ink">0.0012 NEAR</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Refund Guarantee:</span>
                  <span className="text-emerald-700 font-semibold">100% Non-Custodial</span>
                </div>
              </div>

              {depositSuccessMsg && (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs text-emerald-800 flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>{depositSuccessMsg}</span>
                </div>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setDepositModalOpen(false)}
                  className="flex-1 rounded-xl border border-line bg-paper py-2.5 text-xs font-semibold text-muted hover:text-ink"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl bg-ink py-2.5 text-xs font-semibold text-white shadow-md hover:bg-ink/90"
                >
                  Confirm Escrow Deposit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
