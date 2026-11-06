import Link from "next/link";
import { ArrowUpRight, ShieldCheck, Terminal, Layers, Lock, Cpu } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper/60 text-ink">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-semibold tracking-tight">
              lume<span className="text-accent">.</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
              Decentralized advertising marketplace with deliberate split-architecture:
              high-throughput off-chain ad delivery & fraud validation paired with authoritative
              NEAR smart contract escrow and settlement.
            </p>

            <div className="mt-6 flex items-center gap-3 text-xs text-muted">
              <span className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                NEAR Testnet v2.4
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 font-mono">
                NEP-141 Escrow
              </span>
            </div>

            <div className="mt-8 flex items-center gap-2 text-xs text-muted">
              <ShieldCheck className="h-4 w-4 text-ink" />
              <span>Zero floating-point accounting. Pure integer base units.</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Platform</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/advertiser" className="text-muted hover:text-ink transition">
                  Advertiser Studio
                </Link>
              </li>
              <li>
                <Link href="/advertiser/campaigns/new" className="text-muted hover:text-ink transition">
                  Create Campaign
                </Link>
              </li>
              <li>
                <Link href="/publisher" className="text-muted hover:text-ink transition">
                  Publisher Portal
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-muted hover:text-ink transition">
                  Operations & Settlement
                </Link>
              </li>
              <li>
                <Link href="/docs" className="text-muted hover:text-ink transition">
                  Architecture & Docs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Developers</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li>
                <Link href="/docs#sdk" className="text-muted hover:text-ink transition inline-flex items-center gap-1">
                  Publisher SDK <Terminal className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/docs#contract" className="text-muted hover:text-ink transition inline-flex items-center gap-1">
                  NEAR Contract <Layers className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <Link href="/docs#anti-fraud" className="text-muted hover:text-ink transition inline-flex items-center gap-1">
                  Fraud Engine <Lock className="h-3 w-3" />
                </Link>
              </li>
              <li>
                <a
                  href="https://testnet.nearblocks.io"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted hover:text-ink transition inline-flex items-center gap-1"
                >
                  NEAR Explorer <ArrowUpRight className="h-3 w-3" />
                </a>
              </li>
              <li>
                <Link href="/docs#api" className="text-muted hover:text-ink transition">
                  REST APIs & Ingestion
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Guarantees</h3>
            <div className="mt-4 space-y-3 text-xs text-muted">
              <div className="rounded-xl border border-line bg-white p-3">
                <span className="font-semibold text-ink block">Non-Custodial Escrow</span>
                Ad funds remain locked in smart contract until cryptographically batched.
              </div>
              <div className="rounded-xl border border-line bg-white p-3">
                <span className="font-semibold text-ink block">Idempotent Batches</span>
                Duplicate settlement protection prevents double-payouts permanently.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} Lume Protocol. Open-source decentralized advertising marketplace.</p>
          <div className="flex gap-6">
            <Link href="/docs" className="hover:text-ink transition">
              Documentation
            </Link>
            <Link href="/docs#security" className="hover:text-ink transition">
              Security Model
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-ink transition inline-flex items-center gap-1"
            >
              GitHub <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

