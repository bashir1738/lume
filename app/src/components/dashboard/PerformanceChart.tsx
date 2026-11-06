"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface PerformanceDataPoint {
  date: string;
  impressions: number;
  clicks: number;
  spend: number;
  ctr: number;
}

const PERFORMANCE_DATA: PerformanceDataPoint[] = [
  { date: "Oct 22", impressions: 4200, clicks: 126, spend: 105, ctr: 3.0 },
  { date: "Oct 24", impressions: 6100, clicks: 195, spend: 152, ctr: 3.2 },
  { date: "Oct 26", impressions: 8400, clicks: 278, spend: 210, ctr: 3.3 },
  { date: "Oct 28", impressions: 9800, clicks: 312, spend: 245, ctr: 3.18 },
  { date: "Oct 30", impressions: 12400, clicks: 420, spend: 310, ctr: 3.38 },
  { date: "Nov 01", impressions: 15200, clicks: 532, spend: 380, ctr: 3.5 },
  { date: "Nov 03", impressions: 18900, clicks: 680, spend: 472, ctr: 3.6 },
  { date: "Nov 04", impressions: 21400, clicks: 768, spend: 535, ctr: 3.58 },
];

export function PerformanceChart() {
  const [mounted, setMounted] = useState(false);
  const [metric, setMetric] = useState<"impressions" | "clicks" | "spend" | "ctr">("impressions");

  useEffect(() => {
    setMounted(true);
  }, []);

  const metricConfig = {
    impressions: {
      label: "Verified Impressions",
      color: "#142018",
      formatter: (v: number) => `${v.toLocaleString()}`,
      suffix: "imps",
    },
    clicks: {
      label: "Attributed Clicks",
      color: "#3b82f6",
      formatter: (v: number) => `${v.toLocaleString()}`,
      suffix: "clicks",
    },
    spend: {
      label: "Escrow Spend (USDC)",
      color: "#10b981",
      formatter: (v: number) => `$${v.toLocaleString()} USDC`,
      suffix: "USDC",
    },
    ctr: {
      label: "Click-Through Rate (CTR)",
      color: "#8b5cf6",
      formatter: (v: number) => `${v.toFixed(2)}%`,
      suffix: "%",
    },
  };

  const current = metricConfig[metric];

  if (!mounted) {
    return (
      <div className="h-72 w-full animate-pulse rounded-2xl bg-paper flex items-center justify-center text-xs text-muted">
        Loading delivery telemetry...
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Metric Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <span className="text-xs uppercase font-medium tracking-wider text-muted">
            Delivery Telemetry
          </span>
          <p className="mt-0.5 text-xl font-bold tracking-tight text-ink">
            {metric === "impressions" && "21,400 daily verified impressions"}
            {metric === "clicks" && "768 verified clicks"}
            {metric === "spend" && "535.00 USDC consumed"}
            {metric === "ctr" && "3.58% average CTR"}
          </p>
        </div>

        <div className="flex rounded-xl border border-line bg-paper p-1 text-xs font-medium">
          <button
            onClick={() => setMetric("impressions")}
            className={`rounded-lg px-3 py-1.5 transition ${
              metric === "impressions"
                ? "bg-white font-semibold text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            Impressions
          </button>
          <button
            onClick={() => setMetric("clicks")}
            className={`rounded-lg px-3 py-1.5 transition ${
              metric === "clicks"
                ? "bg-white font-semibold text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            Clicks
          </button>
          <button
            onClick={() => setMetric("spend")}
            className={`rounded-lg px-3 py-1.5 transition ${
              metric === "spend"
                ? "bg-white font-semibold text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            Escrow Spend
          </button>
          <button
            onClick={() => setMetric("ctr")}
            className={`rounded-lg px-3 py-1.5 transition ${
              metric === "ctr"
                ? "bg-white font-semibold text-ink shadow-sm"
                : "text-muted hover:text-ink"
            }`}
          >
            CTR %
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="mt-6 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="metricGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={current.color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={current.color} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dce3db" strokeOpacity={0.6} />
            <XAxis
              dataKey="date"
              stroke="#66736a"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: "#dce3db" }}
            />
            <YAxis
              stroke="#66736a"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : `${v}`)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as PerformanceDataPoint;
                  return (
                    <div className="rounded-xl border border-line bg-white/95 p-3 shadow-lg backdrop-blur text-xs">
                      <p className="font-semibold text-ink">{data.date}</p>
                      <p className="mt-1 font-mono font-medium text-ink">
                        {current.label}: {current.formatter(data[metric])}
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-2 border-t border-line/60 pt-1.5 text-[11px] text-muted">
                        <span>CTR: {data.ctr}%</span>
                        <span>Spend: ${data.spend}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey={metric}
              stroke={current.color}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#metricGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

