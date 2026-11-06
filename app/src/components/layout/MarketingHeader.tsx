"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X, Wallet, ChevronDown } from "lucide-react";
import { useWallet } from "@/lib/wallet/WalletContext";
import { WalletModal } from "@/components/wallet/WalletModal";

export function MarketingHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { account, isConnected, setWalletModalOpen } = useWallet();

  return (
    <>
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
        <div className="flex items-center gap-10">
          <Link href="/" className="text-2xl font-bold tracking-tight text-ink flex items-center gap-1.5">
            <span>lume</span>
            <span className="h-2 w-2 rounded-full bg-accent inline-block" />
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-muted md:flex">
            <Link className="transition-colors hover:text-ink" href="/#how-it-works">
              How it works
            </Link>
            <Link className="transition-colors hover:text-ink" href="/#architecture">
              Architecture
            </Link>
            <Link className="transition-colors hover:text-ink" href="/#comparison">
              Web2 vs Lume
            </Link>
            <Link className="transition-colors hover:text-ink" href="/#sdk">
              Publisher SDK
            </Link>
            <Link className="transition-colors hover:text-ink" href="/docs">
              Docs
            </Link>
          </nav>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          {/* Quick role shortcuts */}
          <div className="flex items-center rounded-full border border-line bg-white/70 p-1 text-xs font-medium text-muted backdrop-blur">
            <Link
              href="/advertiser"
              className="rounded-full px-3 py-1.5 hover:bg-paper hover:text-ink transition"
            >
              Advertiser
            </Link>
            <Link
              href="/publisher"
              className="rounded-full px-3 py-1.5 hover:bg-paper hover:text-ink transition"
            >
              Publisher
            </Link>
            <Link
              href="/admin"
              className="rounded-full px-3 py-1.5 hover:bg-paper hover:text-ink transition"
            >
              Admin
            </Link>
          </div>

          {/* Wallet connect button */}
          <button
            onClick={() => setWalletModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink shadow-sm transition hover:border-ink hover:bg-paper"
          >
            <Wallet className="h-4 w-4 text-muted" />
            {isConnected && account ? (
              <span className="font-mono text-xs">{account.accountId.split(".")[0]}.testnet</span>
            ) : (
              <span>Connect Wallet</span>
            )}
            <ChevronDown className="h-3 w-3 text-muted" />
          </button>

          <Link
            href="/advertiser"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-ink/90"
          >
            Launch App
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setWalletModalOpen(true)}
            className="rounded-full border border-line bg-white p-2 text-ink"
          >
            <Wallet className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full border border-line bg-white p-2 text-ink"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[73px] z-30 border-b border-line bg-white/95 p-6 shadow-xl backdrop-blur md:hidden animate-in slide-in-from-top-2">
          <nav className="flex flex-col gap-4 text-base font-medium">
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-muted hover:text-ink"
            >
              How it works
            </Link>
            <Link
              href="/#architecture"
              onClick={() => setMobileMenuOpen(false)}
              className="text-muted hover:text-ink"
            >
              Architecture
            </Link>
            <Link
              href="/#comparison"
              onClick={() => setMobileMenuOpen(false)}
              className="text-muted hover:text-ink"
            >
              Web2 vs Lume
            </Link>
            <Link
              href="/#sdk"
              onClick={() => setMobileMenuOpen(false)}
              className="text-muted hover:text-ink"
            >
              Publisher SDK
            </Link>
            <Link
              href="/docs"
              onClick={() => setMobileMenuOpen(false)}
              className="text-muted hover:text-ink"
            >
              Documentation
            </Link>
            <hr className="border-line" />
            <p className="text-xs uppercase font-semibold text-muted">Select Workspace</p>
            <div className="grid grid-cols-3 gap-2">
              <Link
                href="/advertiser"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl border border-line bg-paper p-2.5 text-center text-xs font-semibold"
              >
                Advertiser
              </Link>
              <Link
                href="/publisher"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl border border-line bg-paper p-2.5 text-center text-xs font-semibold"
              >
                Publisher
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl border border-line bg-paper p-2.5 text-center text-xs font-semibold"
              >
                Admin
              </Link>
            </div>
          </nav>
        </div>
      )}

      <WalletModal />
    </>
  );
}
