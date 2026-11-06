"use client";

import React, { useState } from "react";
import { ExternalLink, Sparkles, ShieldCheck, CheckCircle2, Eye, MousePointerClick } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface AdCreativeProps {
  name?: string;
  headline?: string;
  bodyText?: string;
  ctaText?: string;
  destinationUrl?: string;
  imageUrl?: string;
  format?: "rectangle" | "leaderboard" | "native" | "badge";
  rateCpm?: string;
  onEventTriggered?: (type: "impression" | "click") => void;
}

export function AdPreviewSlot({
  name = "Lume Protocol",
  headline = "Decentralized High-Performance Ad Network",
  bodyText = "Replace opaque ad middlemen with verified off-chain traffic and non-custodial NEAR escrow settlement.",
  ctaText = "Start Escrow",
  destinationUrl = "https://lume.network",
  imageUrl = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
  format = "rectangle",
  rateCpm = "2.50 USDC",
  onEventTriggered,
}: AdCreativeProps) {
  const [impressionLogged, setImpressionLogged] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const triggerImpression = () => {
    setImpressionLogged(true);
    setLastAction("Valid impression beacon signed & ingested (HTTP 201)");
    onEventTriggered?.("impression");
  };

  const triggerClick = () => {
    setClickCount((c) => c + 1);
    setLastAction("Click verified against duplicate nonce filter");
    onEventTriggered?.("click");
  };

  return (
    <div className="w-full">
      {/* Ad slot container */}
      <div className="overflow-hidden rounded-2xl border-2 border-dashed border-line bg-white/60 p-4 transition hover:border-ink/40">
        <div className="mb-3 flex items-center justify-between text-xs text-muted">
          <span className="flex items-center gap-1 font-mono text-[11px]">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Lume Publisher Slot · {format.toUpperCase()}
          </span>
          <span className="font-mono text-[11px] text-muted">eCPM: {rateCpm}</span>
        </div>

        {/* Formats */}
        {format === "rectangle" && (
          <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-paper">
              <img
                src={imageUrl}
                alt={headline}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <span className="absolute top-2 right-2 rounded bg-ink/75 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white backdrop-blur">
                Sponsored
              </span>
            </div>
            <div className="mt-3">
              <h4 className="text-sm font-bold text-ink leading-snug">{headline}</h4>
              <p className="mt-1 text-xs text-muted line-clamp-2 leading-relaxed">{bodyText}</p>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-line/60">
                <span className="text-[11px] font-mono text-muted truncate max-w-[150px]">
                  {destinationUrl.replace("https://", "")}
                </span>
                <button
                  onClick={triggerClick}
                  className="inline-flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-ink/85 shadow-sm"
                >
                  {ctaText} <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {format === "leaderboard" && (
          <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-line bg-white p-3.5 shadow-sm">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-paper">
              <img src={imageUrl} alt={headline} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold text-muted bg-paper px-1.5 py-0.5 rounded border border-line">
                  Ad
                </span>
                <h4 className="text-sm font-bold text-ink truncate">{headline}</h4>
              </div>
              <p className="mt-1 text-xs text-muted truncate">{bodyText}</p>
            </div>
            <button
              onClick={triggerClick}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white hover:bg-ink/90 transition shadow-sm"
            >
              {ctaText} <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        )}

        {format === "native" && (
          <div className="rounded-xl border border-line bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                Promoted by {name}
              </span>
            </div>
            <h4 className="text-base font-semibold text-ink leading-snug">{headline}</h4>
            <p className="mt-2 text-xs leading-relaxed text-muted">{bodyText}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-muted font-mono">{destinationUrl}</span>
              <button
                onClick={triggerClick}
                className="rounded-full bg-paper border border-line px-3.5 py-1 text-xs font-medium text-ink hover:border-ink transition"
              >
                {ctaText} →
              </button>
            </div>
          </div>
        )}

        {/* Verification beacon simulator controls */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line/60 pt-2.5 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={triggerImpression}
              className="inline-flex items-center gap-1 rounded-md border border-line bg-white px-2.5 py-1 text-[11px] font-medium text-ink hover:bg-paper"
            >
              <Eye className="h-3 w-3 text-muted" /> Test Impression Beacon
            </button>
            <button
              onClick={triggerClick}
              className="inline-flex items-center gap-1 rounded-md border border-line bg-white px-2.5 py-1 text-[11px] font-medium text-ink hover:bg-paper"
            >
              <MousePointerClick className="h-3 w-3 text-muted" /> Test Click
            </button>
          </div>

          <div className="text-[11px] text-muted flex items-center gap-2">
            <span>Imps: {impressionLogged ? "1 (verified)" : "0"}</span>
            <span>Clicks: {clickCount}</span>
          </div>
        </div>

        {lastAction && (
          <div className="mt-2 rounded-lg bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 text-[11px] text-emerald-800 flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span>{lastAction}</span>
          </div>
        )}
      </div>
    </div>
  );
}

