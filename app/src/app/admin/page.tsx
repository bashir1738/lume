"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Database,
  Eye,
  Flag,
  Gauge,
  ShieldCheck,
  Users,
  Activity,
  Play,
  RotateCw,
  Search,
  Filter,
  Check,
  X,
  Layers,
  Coins,
  Cpu,
  Terminal,
  ExternalLink,
} from "lucide-react";
import { WorkspaceHeader } from "@/components/layout/WorkspaceHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useWallet } from "@/lib/wallet/WalletContext";

interface ReviewItem {
  id: string;
  title: string;
  target: string;
  severity: "High" | "Normal" | "Info";
  time: string;
  status: "pending" | "resolved" | "flagged";
}

const INITIAL_REVIEW_ITEMS: ReviewItem[] = [
  {
    id: "rev-01",
    title: "Traffic anomaly: Sudden 280% click spike on /24 subnet",
    target: "domain: lume.news · placement: homepage-top",
    severity: "High",
    time: "12 min ago",
    status: "pending",
  },
  {
    id: "rev-02",
    title: "New publisher placement awaiting DNS TXT attestation",
    target: "domain: crypto-radar.xyz · placement: sidebar",
    severity: "Normal",
    time: "38 min ago",
    status: "pending",
  },
  {
    id: "rev-03",
    title: "Settlement batch #0248 staged for coordinator execution",
    target: "1,284 verified events · 2,840.00 USDC liability",
    severity: "Info",
    time: "1 hr ago",
    status: "pending",
  },
  {
    id: "rev-04",
    title: "Duplicate nonce suppression triggered (UUID reused)",
    target: "ip: 198.51.100.42 · campaign: #00492",
    severity: "Normal",
    time: "2 hr ago",
    status: "resolved",
  },
];

export default function AdminPage() {
  const { account } = useWallet();
  const [activeTab, setActiveTab] = useState<"settlement" | "queue" | "contract" | "audit">("settlement");
  const [reviewItems, setReviewItems] = useState<ReviewItem[]>(INITIAL_REVIEW_ITEMS);
  const [isSubmittingBatch, setIsSubmittingBatch] = useState(false);
  const [batchSubmitted, setBatchSubmitted] = useState(false);
  const [activeBatchId, setActiveBatchId] = useState("batch_#0248");

  const resolveItem = (id: string) => {
    setReviewItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: "resolved" } : item))
    );
  };

  const handleExecuteSettlementBatch = () => {
    setIsSubmittingBatch(true);
    setTimeout(() => {
      setIsSubmittingBatch(false);
      setBatchSubmitted(true);
      setTimeout(() => {
        setActiveBatchId("batch_#0249");
        setBatchSubmitted(false);
      }, 3500);
    }, 1800);
  };

  return (
    <main className="min-h-screen bg-paper text-ink pb-24">
      <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <WorkspaceHeader label="Restricted admin workspace" />

        {/* Top Operations Header */}
        <section className="pt-8">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>
                  Settlement Coordinator · Account: {account?.accountId || "coordinator.lume-contract.testnet"}
                </span>
              </div>
              <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-ink">
                Settlement Operations & Platform Health
              </h1>
              <p className="mt-2 text-sm text-muted max-w-2xl">
                Real-time review of event ingestion pipelines, anti-fraud heuristics, and smart
                contract batch settlements. Admin actions cannot reassign escrow funds.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-semibold text-muted shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>NEAR RPC Sync: Block 118,402,912</span>
            </div>
          </div>

          {/* 4 KPI Cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-muted">Ingestion Throughput</span>
                <div className="rounded-xl bg-paper p-2">
                  <Activity className="h-4 w-4 text-emerald-600" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-ink">1,420</p>
              <p className="mt-2 text-xs text-muted">events / sec sustained</p>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-muted">Total Escrowed Capital</span>
                <div className="rounded-xl bg-paper p-2">
                  <Coins className="h-4 w-4 text-ink" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-ink">148,200.00</p>
              <p className="mt-2 text-xs text-muted">USDC locked across 27 campaigns</p>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-muted">Fraud Anomaly Rate</span>
                <div className="rounded-xl bg-paper p-2">
                  <ShieldCheck className="h-4 w-4 text-ink" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-ink">0.78%</p>
              <p className="mt-2 text-xs text-emerald-700 font-medium">99.22% verified clean</p>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <span className="text-xs font-medium text-muted">Settlement Success Rate</span>
                <div className="rounded-xl bg-paper p-2">
                  <Database className="h-4 w-4 text-accent" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-bold tracking-tight text-ink">99.98%</p>
              <p className="mt-2 text-xs text-muted">247 batches executed idempotently</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex items-center gap-2 border-b border-line pb-3 overflow-x-auto text-xs font-semibold">
            <button
              onClick={() => setActiveTab("settlement")}
              className={`rounded-full px-4 py-2 transition ${
                activeTab === "settlement"
                  ? "bg-ink text-white shadow-sm"
                  : "text-muted hover:text-ink hover:bg-white"
              }`}
            >
              Settlement Coordinator
            </button>
            <button
              onClick={() => setActiveTab("queue")}
              className={`rounded-full px-4 py-2 transition ${
                activeTab === "queue"
                  ? "bg-ink text-white shadow-sm"
                  : "text-muted hover:text-ink hover:bg-white"
              }`}
            >
              Review & Anomaly Queue ({reviewItems.filter((i) => i.status === "pending").length})
            </button>
            <button
              onClick={() => setActiveTab("contract")}
              className={`rounded-full px-4 py-2 transition ${
                activeTab === "contract"
                  ? "bg-ink text-white shadow-sm"
                  : "text-muted hover:text-ink hover:bg-white"
              }`}
            >
              NEAR Smart Contract State
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`rounded-full px-4 py-2 transition ${
                activeTab === "audit"
                  ? "bg-ink text-white shadow-sm"
                  : "text-muted hover:text-ink hover:bg-white"
              }`}
            >
              Event Telemetry Stream
            </button>
          </div>

          {/* TAB 1: SETTLEMENT COORDINATOR ENGINE */}
          {activeTab === "settlement" && (
            <div className="mt-6 space-y-6 animate-in fade-in duration-150">
              <div className="rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-ink">
                        Staged Settlement Batch: {activeBatchId}
                      </h3>
                      <Badge variant="accent" size="sm">
                        Ready for Broadcast
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted max-w-xl leading-relaxed">
                      Aggregates verified liabilities across campaigns and debits on-chain escrow
                      atomically. Idempotent hash ensures this batch can never be executed twice.
                    </p>
                  </div>

                  <Button
                    onClick={handleExecuteSettlementBatch}
                    disabled={isSubmittingBatch || batchSubmitted}
                    className="rounded-full bg-ink px-6 py-2.5 text-xs font-semibold text-white shadow hover:bg-ink/90 transition disabled:opacity-50"
                  >
                    {isSubmittingBatch
                      ? "Executing submit_settlement()..."
                      : batchSubmitted
                      ? "Batch Finalized on NEAR!"
                      : "Submit Batch to NEAR Contract"}
                  </Button>
                </div>

                {batchSubmitted && (
                  <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-900 flex items-center gap-2.5 animate-in fade-in">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">Settlement Batch Successfully Confirmed!</p>
                      <p className="mt-0.5 text-emerald-800">
                        2,840.00 USDC credited to 12 publisher liability accounts. Transaction Hash:{" "}
                        <span className="font-mono">8f9e2b14c7...</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Staged Batch Details */}
                <div className="mt-8 grid gap-4 sm:grid-cols-3 font-mono text-xs">
                  <div className="rounded-xl border border-line bg-paper p-4">
                    <span className="text-muted block">Queued Validated Events</span>
                    <strong className="mt-1 text-lg font-bold text-ink block font-sans">
                      1,284 records
                    </strong>
                    <span className="text-[11px] text-muted">100% deduplicated</span>
                  </div>

                  <div className="rounded-xl border border-line bg-paper p-4">
                    <span className="text-muted block">Total Batch Payout</span>
                    <strong className="mt-1 text-lg font-bold text-emerald-700 block font-sans">
                      2,840.00 USDC
                    </strong>
                    <span className="text-[11px] text-muted">2,840,000,000 base units</span>
                  </div>

                  <div className="rounded-xl border border-line bg-paper p-4">
                    <span className="text-muted block">Target Publisher Accounts</span>
                    <strong className="mt-1 text-lg font-bold text-ink block font-sans">
                      12 unique accounts
                    </strong>
                    <span className="text-[11px] text-muted">Atomic multi-liability transfer</span>
                  </div>
                </div>

                {/* Staged JSON Payload Inspector */}
                <div className="mt-6 rounded-2xl border border-line bg-ink p-5 text-white font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-white/15 pb-2.5 text-white/70">
                    <span>Generated Smart Contract Batch Payload</span>
                    <span className="text-accent">Idempotent Batch ID: {activeBatchId}</span>
                  </div>
                  <pre className="mt-3 overflow-x-auto text-white/90 leading-relaxed text-[11px]">
                    {JSON.stringify(
                      {
                        batch_id: `${activeBatchId}_20261104`,
                        campaign_id: 492,
                        items: [
                          { publisher_id: "lume-network.testnet", amount: "1020000000" },
                          { publisher_id: "open-source-media.testnet", amount: "680000000" },
                          { publisher_id: "design-systems.testnet", amount: "420000000" },
                          { publisher_id: "crypto-radar.testnet", amount: "720000000" },
                        ],
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: REVIEW & ANOMALY QUEUE */}
          {activeTab === "queue" && (
            <div className="mt-6 space-y-6 animate-in fade-in duration-150">
              <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-line px-6 py-4">
                  <div>
                    <h3 className="font-semibold text-sm text-ink">Operator Decision Queue</h3>
                    <p className="text-xs text-muted">Items requiring manual or automated resolution</p>
                  </div>
                  <span className="text-xs text-muted">
                    {reviewItems.filter((i) => i.status === "pending").length} active items
                  </span>
                </div>

                <div className="divide-y divide-line">
                  {reviewItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-5 flex flex-wrap items-center justify-between gap-4 transition ${
                        item.status === "resolved" ? "bg-paper/40 opacity-60" : "hover:bg-paper/50"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-[260px] flex-1">
                        <div
                          className={`rounded-xl p-2.5 ${
                            item.severity === "High"
                              ? "bg-rose-50 text-rose-700"
                              : item.severity === "Normal"
                              ? "bg-amber-50 text-amber-700"
                              : "bg-blue-50 text-blue-700"
                          }`}
                        >
                          {item.severity === "High" ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : (
                            <Flag className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-ink">{item.title}</p>
                          <p className="text-xs text-muted font-mono mt-0.5">{item.target}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted">{item.time}</span>
                        <Badge
                          variant={
                            item.severity === "High"
                              ? "danger"
                              : item.severity === "Normal"
                              ? "warning"
                              : "outline"
                          }
                          size="sm"
                        >
                          {item.severity}
                        </Badge>

                        {item.status === "pending" ? (
                          <button
                            onClick={() => resolveItem(item.id)}
                            className="rounded-lg border border-line bg-white px-3 py-1 text-xs font-semibold text-ink hover:border-ink hover:bg-paper transition"
                          >
                            Resolve / Dismiss
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                            <Check className="h-3.5 w-3.5" /> Resolved
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SMART CONTRACT STATE */}
          {activeTab === "contract" && (
            <div className="mt-6 space-y-6 animate-in fade-in duration-150">
              <div className="rounded-3xl border border-line bg-white p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between border-b border-line pb-4">
                  <div>
                    <h3 className="font-bold text-lg text-ink">
                      Authoritative NEAR Escrow Contract State
                    </h3>
                    <p className="text-xs text-muted font-mono mt-0.5">
                      contract_account: lume-escrow.testnet
                    </p>
                  </div>
                  <Badge variant="success" size="sm">
                    State Synchronized
                  </Badge>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 text-xs font-mono">
                  <div className="rounded-2xl border border-line bg-paper p-4 space-y-2">
                    <span className="text-muted block uppercase text-[10px] font-bold">
                      Protocol Configuration
                    </span>
                    <div className="flex justify-between">
                      <span className="text-muted">owner_id:</span>
                      <span className="font-bold text-ink">lume-protocol-owner.testnet</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">token_id:</span>
                      <span className="font-bold text-ink">usdc.fakes.testnet</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">next_campaign_id:</span>
                      <span className="font-bold text-ink">499</span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-line bg-paper p-4 space-y-2">
                    <span className="text-muted block uppercase text-[10px] font-bold">
                      Settlement Authorization
                    </span>
                    <div className="flex justify-between">
                      <span className="text-muted">authorized_settlers:</span>
                      <span className="font-bold text-emerald-700">1 active key</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">registered_publishers:</span>
                      <span className="font-bold text-ink">642 accounts</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">unclaimed_liabilities:</span>
                      <span className="font-bold text-ink">12,480.50 USDC</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-line bg-white p-4 text-xs leading-relaxed text-muted">
                  <ShieldCheck className="h-4 w-4 inline-block text-ink mr-1.5" />
                  <strong>Non-Custodial Escrow Constraint:</strong> The contract is programmed in Rust with no administrative withdrawal function. Escrowed capital can only exit via <code>submit_settlement</code> to verified publisher accounts or <code>close_campaign</code> refunds back to the campaign creator.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AUDIT STREAM */}
          {activeTab === "audit" && (
            <div className="mt-6 space-y-6 animate-in fade-in duration-150">
              <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-line px-6 py-4">
                  <h3 className="font-semibold text-sm text-ink">Live Event Intake Telemetry</h3>
                  <span className="text-xs text-muted font-mono">Status: Stream Active</span>
                </div>

                <div className="divide-y divide-line text-xs font-mono">
                  {[
                    { time: "15:24:12", type: "IMPRESSION", placement: "slot-01", campaign: "#00492", latency: "38ms", status: "VALID" },
                    { time: "15:24:11", type: "IMPRESSION", placement: "slot-02", campaign: "#00495", latency: "42ms", status: "VALID" },
                    { time: "15:24:09", type: "CLICK", placement: "slot-01", campaign: "#00492", latency: "45ms", status: "VALID" },
                    { time: "15:24:06", type: "IMPRESSION", placement: "slot-03", campaign: "#00498", latency: "39ms", status: "VALID" },
                    { time: "15:24:02", type: "BOT_SUPPRESS", placement: "slot-04", campaign: "#00492", latency: "12ms", status: "REJECTED" },
                  ].map((log, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between hover:bg-paper/40">
                      <div className="flex items-center gap-4">
                        <span className="text-muted">{log.time}</span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                            log.status === "VALID"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {log.type}
                        </span>
                        <span className="text-ink">{log.placement}</span>
                        <span className="text-muted">Campaign {log.campaign}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-muted">{log.latency}</span>
                        <span
                          className={log.status === "VALID" ? "text-emerald-700 font-bold" : "text-rose-700 font-bold"}
                        >
                          {log.status}
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
    </main>
  );
}
