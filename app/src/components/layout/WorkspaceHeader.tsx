"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  Wallet,
  Bell,
  CheckCircle2,
  ExternalLink,
  Coins,
  ShieldCheck,
} from "lucide-react";
import { useWallet } from "@/lib/wallet/WalletContext";
import { Badge } from "@/components/ui/Badge";
import { WalletModal } from "@/components/wallet/WalletModal";

type WorkspaceHeaderProps = {
  label: string;
  backHref?: Route;
  backLabel?: string;
};

export function WorkspaceHeader({ label, backHref, backLabel }: WorkspaceHeaderProps) {
  const pathname = usePathname();
  const { account, isConnected, setWalletModalOpen } = useWallet();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: "1",
      title: "Settlement Batch #0247 Confirmed",
      detail: "2,840.00 USDC distributed across 12 publishers.",
      time: "24m ago",
      type: "success",
    },
    {
      id: "2",
      title: "Ad Placement Verified",
      detail: "domain lume.news passed DNS TXT attestation.",
      time: "2h ago",
      type: "info",
    },
    {
      id: "3",
      title: "Escrow Deposit Acknowledged",
      detail: "5,000.00 USDC received via ft_transfer_call.",
      time: "1d ago",
      type: "info",
    },
  ];

  return (
    <>
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-5">
        {/* Left side: Brand + Nav Tabs / Back button */}
        <div className="flex flex-wrap items-center gap-6">
          <Link href="/" className="text-xl font-bold tracking-tight text-ink flex items-center gap-1.5">
            <span>lume</span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent inline-block" />
          </Link>

          <span className="hidden h-5 w-px bg-line sm:block" />

          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" /> {backLabel ?? "Back"}
            </Link>
          ) : (
            <nav className="flex items-center gap-1 rounded-full border border-line bg-white/70 p-1 text-xs font-medium">
              <Link
                href="/advertiser"
                className={`rounded-full px-3 py-1.5 transition ${
                  pathname.startsWith("/advertiser")
                    ? "bg-ink text-white font-semibold shadow-sm"
                    : "text-muted hover:text-ink hover:bg-paper"
                }`}
              >
                Advertiser
              </Link>
              <Link
                href="/publisher"
                className={`rounded-full px-3 py-1.5 transition ${
                  pathname.startsWith("/publisher")
                    ? "bg-ink text-white font-semibold shadow-sm"
                    : "text-muted hover:text-ink hover:bg-paper"
                }`}
              >
                Publisher
              </Link>
              <Link
                href="/admin"
                className={`rounded-full px-3 py-1.5 transition ${
                  pathname.startsWith("/admin")
                    ? "bg-ink text-white font-semibold shadow-sm"
                    : "text-muted hover:text-ink hover:bg-paper"
                }`}
              >
                Admin
              </Link>
            </nav>
          )}
        </div>

        {/* Right side: Network indicator, Notifications, Wallet Pill */}
        <div className="flex items-center gap-3">
          {/* Testnet Badge */}
          <div className="hidden items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-muted md:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>NEAR Testnet</span>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative rounded-full border border-line bg-white p-2 text-muted hover:border-ink hover:text-ink transition"
              title="Recent Activity Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-accent" />
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-11 z-40 w-80 rounded-2xl border border-line bg-white p-4 shadow-xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-line pb-2.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    Settlement & Escrow Alerts
                  </p>
                  <span className="text-[11px] text-muted">3 new</span>
                </div>
                <div className="mt-2 divide-y divide-line/60">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 text-xs">
                      <p className="font-semibold text-ink">{n.title}</p>
                      <p className="mt-0.5 text-muted leading-relaxed">{n.detail}</p>
                      <span className="mt-1 block text-[10px] text-muted">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Wallet Button */}
          <button
            onClick={() => setWalletModalOpen(true)}
            className="group inline-flex items-center gap-2.5 rounded-full border border-line bg-white px-3.5 py-1.5 text-xs font-medium text-ink shadow-sm transition hover:border-ink hover:bg-paper"
          >
            <div className="flex items-center gap-1.5">
              <div className="rounded-full bg-accent/30 p-1">
                <Wallet className="h-3.5 w-3.5 text-ink" />
              </div>
              {isConnected && account ? (
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold">{account.accountId.split(".")[0]}.testnet</span>
                  <span className="hidden rounded bg-paper px-1.5 py-0.5 text-[10px] font-bold text-muted sm:inline-block border border-line">
                    {account.balanceUsdc} USDC
                  </span>
                </div>
              ) : (
                <span>Connect NEAR</span>
              )}
            </div>
            <ChevronDown className="h-3 w-3 text-muted group-hover:text-ink" />
          </button>
        </div>
      </header>

      <WalletModal />
    </>
  );
}
