"use client";

import React, { useState } from "react";
import { useWallet, PRESET_ACCOUNTS, WalletAccount } from "@/lib/wallet/WalletContext";
import { X, Check, Copy, ExternalLink, ShieldCheck, Wallet, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function WalletModal() {
  const { isWalletModalOpen, setWalletModalOpen, account, connect, disconnect } = useWallet();
  const [copied, setCopied] = useState(false);
  const [customInput, setCustomInput] = useState("");

  if (!isWalletModalOpen) return null;

  const copyAddress = () => {
    if (!account) return;
    navigator.clipboard.writeText(account.accountId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCustomConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const acc: WalletAccount = {
      accountId: customInput.endsWith(".testnet") ? customInput : `${customInput}.testnet`,
      role: "advertiser",
      balanceUsdc: "10,000.00",
      balanceNear: "75.00",
      network: "testnet",
    };
    connect(acc);
    setCustomInput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        onClick={() => setWalletModalOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-3xl border border-line bg-white p-6 shadow-2xl sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-accent/20 p-2 text-ink">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">NEAR Wallet Connection</h2>
              <p className="text-xs text-muted">Testnet Escrow & Settlement Layer</p>
            </div>
          </div>
          <button
            onClick={() => setWalletModalOpen(false)}
            className="rounded-full p-1.5 text-muted hover:bg-paper hover:text-ink transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Currently Connected Info */}
        {account ? (
          <div className="mt-6 rounded-2xl border border-line bg-paper p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-muted">Active Session</span>
              <Badge variant="success" size="sm">
                Connected · {account.network}
              </Badge>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="font-mono text-sm font-semibold text-ink">{account.accountId}</p>
                <p className="mt-1 text-xs text-muted capitalize">Role: {account.role}</p>
              </div>
              <button
                onClick={copyAddress}
                className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-medium text-ink hover:bg-paper transition"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-muted" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-line/60 pt-4">
              <div className="rounded-xl bg-white p-3 border border-line">
                <span className="text-[11px] text-muted">USDC Escrow Asset</span>
                <p className="text-base font-semibold">{account.balanceUsdc} USDC</p>
              </div>
              <div className="rounded-xl bg-white p-3 border border-line">
                <span className="text-[11px] text-muted">NEAR Gas Reserve</span>
                <p className="text-base font-semibold">{account.balanceNear} NEAR</p>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <a
                href={`https://testnet.nearblocks.io/address/${account.accountId}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-line bg-white py-2 text-xs font-medium text-muted hover:text-ink transition"
              >
                View on Explorer <ExternalLink className="h-3 w-3" />
              </a>
              <Button
                onClick={disconnect}
                className="rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 px-4 py-2 text-xs"
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-800">
            No wallet currently connected. Select an account role below or enter your NEAR testnet address.
          </div>
        )}

        {/* Quick Role Switcher / Demo Accounts */}
        <div className="mt-6">
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            Switch Persona / Select Sandbox Account
          </p>
          <div className="mt-3 space-y-2">
            {PRESET_ACCOUNTS.map((preset) => {
              const isCurrent = account?.accountId === preset.accountId;
              return (
                <div
                  key={preset.accountId}
                  onClick={() => connect(preset)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition ${
                    isCurrent
                      ? "border-ink bg-ink/5"
                      : "border-line bg-white hover:border-ink/40 hover:bg-paper"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        preset.role === "advertiser"
                          ? "bg-blue-500"
                          : preset.role === "publisher"
                          ? "bg-emerald-500"
                          : "bg-purple-500"
                      }`}
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold font-mono">{preset.accountId}</p>
                        <span className="rounded bg-paper px-1.5 py-0.5 text-[10px] uppercase font-semibold text-muted border border-line">
                          {preset.role}
                        </span>
                      </div>
                      <p className="text-xs text-muted">
                        Balance: {preset.balanceUsdc} USDC · {preset.balanceNear} NEAR
                      </p>
                    </div>
                  </div>
                  {isCurrent ? (
                    <Badge variant="accent" size="sm">Active</Badge>
                  ) : (
                    <ArrowRight className="h-4 w-4 text-muted" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Custom Account Input */}
        <form onSubmit={handleCustomConnect} className="mt-6 border-t border-line pt-5">
          <label className="block text-xs font-medium text-muted">
            Or connect custom NEAR Testnet account ID
          </label>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              placeholder="your-name.testnet"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="flex-1 rounded-xl border border-line bg-paper px-3.5 py-2 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:bg-white focus:outline-none"
            />
            <Button type="submit" className="rounded-xl px-4 text-xs font-semibold">
              Connect
            </Button>
          </div>
        </form>

        <div className="mt-6 flex items-center gap-2 rounded-xl bg-paper p-3 text-xs text-muted">
          <ShieldCheck className="h-4 w-4 shrink-0 text-ink" />
          <span>
            Non-custodial NEAR contract integration. Private keys never touch application servers.
          </span>
        </div>
      </div>
    </div>
  );
}

