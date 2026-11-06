"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Coins,
  Globe2,
  Layers,
  Sparkles,
  ShieldCheck,
  Check,
  Smartphone,
  Laptop,
  Calendar,
  DollarSign,
  Eye,
} from "lucide-react";
import { WorkspaceHeader } from "@/components/layout/WorkspaceHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { AdPreviewSlot } from "@/components/ad/AdPreviewSlot";
import { useWallet } from "@/lib/wallet/WalletContext";

export default function NewCampaignPage() {
  const router = useRouter();
  const { account } = useWallet();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOnChainId, setSubmittedOnChainId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("NEAR Protocol Developer Adoption");
  const [objective, setObjective] = useState<"awareness" | "traffic" | "conversions">("awareness");
  const [category, setCategory] = useState("Infrastructure & DevTools");

  // Creative State
  const [format, setFormat] = useState<"rectangle" | "leaderboard" | "native">("rectangle");
  const [headline, setHeadline] = useState("Build Scalable Apps on NEAR Protocol");
  const [bodyText, setBodyText] = useState(
    "Experience 1.2s transaction finality, account abstraction, and zero-loss smart contract escrow."
  );
  const [ctaText, setCtaText] = useState("Start Building");
  const [destinationUrl, setDestinationUrl] = useState("https://near.org/developers");
  const [imageUrl, setImageUrl] = useState(
    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&auto=format&fit=crop&q=80"
  );

  // Targeting State
  const [countries, setCountries] = useState<string[]>(["US", "DE", "UK", "JP"]);
  const [devices, setDevices] = useState<string[]>(["desktop", "mobile"]);
  const [frequencyCap, setFrequencyCap] = useState("3 imps / 24 hours");

  // Budget & Bidding State
  const [pricingModel, setPricingModel] = useState<"cpm" | "cpc">("cpm");
  const [rateUsdc, setRateUsdc] = useState("2.50"); // $2.50 CPM
  const [budgetUsdc, setBudgetUsdc] = useState("5000"); // $5,000 USDC
  const [durationDays, setDurationDays] = useState("30");

  const rateFloat = parseFloat(rateUsdc) || 2.5;
  const budgetFloat = parseFloat(budgetUsdc) || 5000;
  const estimatedImpressions =
    pricingModel === "cpm"
      ? Math.floor((budgetFloat / rateFloat) * 1000)
      : Math.floor(budgetFloat / rateFloat);

  const rateBaseUnits = Math.floor(rateFloat * 1_000_000).toString();
  const budgetBaseUnits = Math.floor(budgetFloat * 1_000_000).toString();

  const handleCountryToggle = (code: string) => {
    setCountries((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleDeviceToggle = (device: string) => {
    setDevices((prev) =>
      prev.includes(device) ? prev.filter((d) => d !== device) : [...prev, device]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 4) {
      setCurrentStep((s) => s + 1);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const generatedId = `00${Math.floor(100 + Math.random() * 900)}`;
      setSubmittedOnChainId(generatedId);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-paper text-ink pb-24">
      <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <WorkspaceHeader
          label="Campaign Creation Studio"
          backHref="/advertiser"
          backLabel="Back to Advertiser Workspace"
        />

        <div className="mt-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>NEAR On-Chain Escrow Initialization</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Launch a Verifiable Advertising Campaign
          </h1>
          <p className="mt-2 text-sm text-muted max-w-2xl">
            Configure your campaign parameters, live preview creative assets, and deploy the escrow
            contract state with integer base units.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="mt-8 grid grid-cols-4 gap-3 border-b border-line pb-6 text-xs font-semibold">
          {[
            { num: 1, title: "1. Identity & Objective" },
            { num: 2, title: "2. Creative & Assets" },
            { num: 3, title: "3. Audience & Geo" },
            { num: 4, title: "4. Budget & Escrow" },
          ].map((st) => (
            <div
              key={st.num}
              onClick={() => setCurrentStep(st.num)}
              className={`cursor-pointer rounded-xl border p-3 transition ${
                currentStep === st.num
                  ? "border-ink bg-white text-ink shadow-sm"
                  : currentStep > st.num
                  ? "border-emerald-200 bg-emerald-50/50 text-emerald-800"
                  : "border-line bg-paper text-muted hover:border-ink/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{st.title}</span>
                {currentStep > st.num && <Check className="h-3.5 w-3.5 text-emerald-600" />}
              </div>
            </div>
          ))}
        </div>

        {/* Success Screen after submission */}
        {submittedOnChainId ? (
          <div className="mt-10 rounded-3xl border border-line bg-white p-8 shadow-xl max-w-2xl mx-auto text-center animate-in zoom-in-95">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-ink">
              Campaign #{submittedOnChainId} Successfully Initialized!
            </h2>
            <p className="mt-2 text-sm text-muted">
              Campaign state has been broadcast to the Lume smart contract on NEAR Testnet.
              Escrow of <strong>{budgetUsdc} USDC</strong> ({budgetBaseUnits} base units) is ready for
              deposit via <code>ft_transfer_call</code>.
            </p>

            <div className="mt-6 rounded-2xl border border-line bg-paper p-4 font-mono text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-muted">On-Chain Campaign ID:</span>
                <span className="font-bold text-ink">#{submittedOnChainId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Advertiser Account:</span>
                <span className="text-ink">{account?.accountId || "aurora-media.testnet"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Allocated Budget:</span>
                <span className="font-bold text-emerald-700">{budgetUsdc} USDC</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Rate:</span>
                <span className="text-ink">{rateUsdc} USDC ({pricingModel.toUpperCase()})</span>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-3">
              <Link
                href="/advertiser"
                className="rounded-full bg-ink px-6 py-3 text-xs font-semibold text-white shadow-md hover:bg-ink/90 transition"
              >
                Go to Advertiser Dashboard
              </Link>
            </div>
          </div>
        ) : (
          /* Two Column Layout: Form Wizard + Live Preview Sticky Sidebar */
          <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_.9fr] items-start">
            {/* Form Wizard */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: IDENTITY */}
              {currentStep === 1 && (
                <div className="rounded-3xl border border-line bg-white p-6 shadow-sm space-y-5 animate-in fade-in">
                  <h3 className="text-lg font-bold text-ink">Step 1: Campaign Identity & Goal</h3>
                  <p className="text-xs text-muted">
                    Set campaign name, brand category, and optimization goal.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-ink">Campaign Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm font-medium text-ink focus:border-ink focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink">Campaign Objective</label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {[
                        { key: "awareness", label: "Brand Awareness", desc: "Maximize verified reach" },
                        { key: "traffic", label: "Web Traffic", desc: "Attract targeted visitors" },
                        { key: "conversions", label: "Web3 Actions", desc: "Drive dApp interactions" },
                      ].map((item) => (
                        <div
                          key={item.key}
                          onClick={() => setObjective(item.key as any)}
                          className={`cursor-pointer rounded-xl border p-3 transition ${
                            objective === item.key
                              ? "border-ink bg-paper font-semibold text-ink shadow-sm"
                              : "border-line bg-white text-muted hover:border-ink/40"
                          }`}
                        >
                          <p className="text-xs font-bold text-ink">{item.label}</p>
                          <p className="text-[10px] text-muted mt-0.5">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink">Primary Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-xs font-semibold text-ink focus:border-ink focus:bg-white focus:outline-none"
                    >
                      <option>Infrastructure & DevTools</option>
                      <option>DeFi & Financial Primitives</option>
                      <option>Web3 Gaming & Metaverse</option>
                      <option>Layer 1 & Layer 2 Protocols</option>
                      <option>AI & Autonomous Agents</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 2: CREATIVE & FORMAT */}
              {currentStep === 2 && (
                <div className="rounded-3xl border border-line bg-white p-6 shadow-sm space-y-5 animate-in fade-in">
                  <h3 className="text-lg font-bold text-ink">Step 2: Creative Format & Content</h3>
                  <p className="text-xs text-muted">
                    Choose ad format and customize headline, copy, and destination link.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-ink">Display Format</label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {[
                        { key: "rectangle", label: "Medium Rectangle", size: "300x250" },
                        { key: "leaderboard", label: "Leaderboard Banner", size: "728x90" },
                        { key: "native", label: "Native Sponsored Feed", size: "Fluid" },
                      ].map((fmt) => (
                        <div
                          key={fmt.key}
                          onClick={() => setFormat(fmt.key as any)}
                          className={`cursor-pointer rounded-xl border p-3 transition ${
                            format === fmt.key
                              ? "border-ink bg-paper font-semibold text-ink shadow-sm"
                              : "border-line bg-white text-muted hover:border-ink/40"
                          }`}
                        >
                          <p className="text-xs font-bold text-ink">{fmt.label}</p>
                          <p className="text-[10px] text-muted">{fmt.size}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink">Headline</label>
                    <input
                      type="text"
                      required
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm font-medium text-ink focus:border-ink focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink">Description / Copy</label>
                    <textarea
                      rows={2}
                      value={bodyText}
                      onChange={(e) => setBodyText(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2 text-xs font-medium text-ink focus:border-ink focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink">Button Label (CTA)</label>
                      <input
                        type="text"
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2 text-xs font-medium text-ink focus:border-ink focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink">Destination URL</label>
                      <input
                        type="url"
                        value={destinationUrl}
                        onChange={(e) => setDestinationUrl(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2 text-xs font-medium text-ink focus:border-ink focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink">Asset Image URL</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2 text-xs font-mono text-ink focus:border-ink focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: TARGETING */}
              {currentStep === 3 && (
                <div className="rounded-3xl border border-line bg-white p-6 shadow-sm space-y-5 animate-in fade-in">
                  <h3 className="text-lg font-bold text-ink">Step 3: Audience & Geo Targeting</h3>
                  <p className="text-xs text-muted">
                    Define eligible delivery jurisdictions and devices.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-ink">Target Countries</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[
                        { code: "US", name: "United States" },
                        { code: "UK", name: "United Kingdom" },
                        { code: "DE", name: "Germany" },
                        { code: "FR", name: "France" },
                        { code: "JP", name: "Japan" },
                        { code: "SG", name: "Singapore" },
                        { code: "CA", name: "Canada" },
                        { code: "KR", name: "South Korea" },
                      ].map((c) => {
                        const selected = countries.includes(c.code);
                        return (
                          <button
                            type="button"
                            key={c.code}
                            onClick={() => handleCountryToggle(c.code)}
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                              selected
                                ? "bg-ink text-white"
                                : "border border-line bg-paper text-muted hover:text-ink"
                            }`}
                          >
                            {c.name} ({c.code})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink">Eligible Devices</label>
                    <div className="mt-2 flex gap-3">
                      {[
                        { id: "desktop", label: "Desktop & Laptop", icon: Laptop },
                        { id: "mobile", label: "Mobile Phones", icon: Smartphone },
                      ].map((dev) => {
                        const selected = devices.includes(dev.id);
                        const Icon = dev.icon;
                        return (
                          <div
                            key={dev.id}
                            onClick={() => handleDeviceToggle(dev.id)}
                            className={`flex-1 cursor-pointer rounded-xl border p-3 transition flex items-center gap-2.5 ${
                              selected
                                ? "border-ink bg-paper font-semibold text-ink shadow-sm"
                                : "border-line bg-white text-muted hover:border-ink/40"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="text-xs">{dev.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink">Frequency Capping</label>
                    <select
                      value={frequencyCap}
                      onChange={(e) => setFrequencyCap(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2 text-xs font-semibold text-ink focus:border-ink focus:bg-white focus:outline-none"
                    >
                      <option>1 impression / 24 hours per unique user</option>
                      <option>3 imps / 24 hours (Recommended)</option>
                      <option>5 imps / 24 hours</option>
                      <option>Uncapped (Maximum Delivery)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 4: BUDGET & ESCROW */}
              {currentStep === 4 && (
                <div className="rounded-3xl border border-line bg-white p-6 shadow-sm space-y-5 animate-in fade-in">
                  <h3 className="text-lg font-bold text-ink">Step 4: Pricing Model & Escrow Budget</h3>
                  <p className="text-xs text-muted">
                    Enter budget and rate as token units. No floating-point values accepted by contract.
                  </p>

                  <div>
                    <label className="block text-xs font-semibold text-ink">Pricing Model</label>
                    <div className="mt-2 flex gap-3">
                      <div
                        onClick={() => setPricingModel("cpm")}
                        className={`flex-1 cursor-pointer rounded-xl border p-3 transition ${
                          pricingModel === "cpm"
                            ? "border-ink bg-paper font-semibold text-ink shadow-sm"
                            : "border-line bg-white text-muted hover:border-ink/40"
                        }`}
                      >
                        <p className="text-xs font-bold text-ink">CPM (Cost per 1,000 imps)</p>
                        <p className="text-[10px] text-muted">Pay for verified view beacons</p>
                      </div>

                      <div
                        onClick={() => setPricingModel("cpc")}
                        className={`flex-1 cursor-pointer rounded-xl border p-3 transition ${
                          pricingModel === "cpc"
                            ? "border-ink bg-paper font-semibold text-ink shadow-sm"
                            : "border-line bg-white text-muted hover:border-ink/40"
                        }`}
                      >
                        <p className="text-xs font-bold text-ink">CPC (Cost per Click)</p>
                        <p className="text-[10px] text-muted">Pay only for attributed clicks</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-ink">
                        Rate ({pricingModel.toUpperCase()}) USDC
                      </label>
                      <input
                        type="number"
                        min="0.1"
                        step="0.05"
                        required
                        value={rateUsdc}
                        onChange={(e) => setRateUsdc(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm font-bold text-ink focus:border-ink focus:bg-white focus:outline-none"
                      />
                      <p className="mt-1 text-[11px] text-muted font-mono">
                        Base units: {rateBaseUnits}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-ink">
                        Total Escrow Budget (USDC)
                      </label>
                      <input
                        type="number"
                        min="50"
                        step="50"
                        required
                        value={budgetUsdc}
                        onChange={(e) => setBudgetUsdc(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2.5 text-sm font-bold text-ink focus:border-ink focus:bg-white focus:outline-none"
                      />
                      <p className="mt-1 text-[11px] text-muted font-mono">
                        Base units: {budgetBaseUnits}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink">Campaign Duration</label>
                    <select
                      value={durationDays}
                      onChange={(e) => setDurationDays(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-line bg-paper px-3.5 py-2 text-xs font-semibold text-ink focus:border-ink focus:bg-white focus:outline-none"
                    >
                      <option value="14">14 Days Run</option>
                      <option value="30">30 Days Run (Standard)</option>
                      <option value="60">60 Days Run</option>
                      <option value="90">90 Days Run</option>
                    </select>
                  </div>

                  <div className="rounded-xl border border-line bg-paper p-4 text-xs space-y-1.5">
                    <div className="flex justify-between font-medium">
                      <span className="text-muted">Estimated Deliverable Volume:</span>
                      <span className="font-bold text-ink">
                        ~{estimatedImpressions.toLocaleString()} {pricingModel === "cpm" ? "Impressions" : "Clicks"}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span className="text-muted">Daily Burn Allocation:</span>
                      <span className="font-bold text-ink">
                        ${(budgetFloat / parseInt(durationDays)).toFixed(2)} USDC/day
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Wizard Navigation Buttons */}
              <div className="flex items-center justify-between pt-4">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((s) => s - 1)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-5 py-2.5 text-xs font-semibold text-ink hover:border-ink"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> Previous Step
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((s) => s + 1)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-ink px-6 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-ink/90"
                  >
                    Continue to Step {currentStep + 1} <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="rounded-full bg-emerald-700 px-7 py-3 text-xs font-semibold text-white shadow-lg hover:bg-emerald-800"
                  >
                    {isSubmitting ? "Deploying On-Chain..." : "Deploy Campaign to NEAR Contract"}
                  </Button>
                )}
              </div>
            </form>

            {/* Right Column: Real-time Live Ad Preview Sidebar */}
            <aside className="sticky top-8 space-y-6">
              <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-line pb-3.5">
                  <h3 className="font-bold text-sm text-ink flex items-center gap-2">
                    <Eye className="h-4 w-4 text-muted" /> Live Creative Preview
                  </h3>
                  <Badge variant="accent" size="sm">
                    {format.toUpperCase()}
                  </Badge>
                </div>

                <div className="mt-5">
                  <AdPreviewSlot
                    name={name}
                    headline={headline}
                    bodyText={bodyText}
                    ctaText={ctaText}
                    destinationUrl={destinationUrl}
                    imageUrl={imageUrl}
                    format={format}
                    rateCpm={`${rateUsdc} USDC`}
                  />
                </div>
              </div>

              {/* Contract Escrow Summary Card */}
              <div className="rounded-3xl border border-line bg-ink p-6 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono tracking-wider text-accent">
                    Contract Escrow Specification
                  </span>
                  <ShieldCheck className="h-4 w-4 text-accent" />
                </div>

                <div className="mt-5 space-y-3 font-mono text-xs">
                  <div className="flex justify-between text-white/70">
                    <span>Deposit Amount:</span>
                    <span className="font-bold text-white">{budgetUsdc} USDC</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Token Base Units:</span>
                    <span className="font-bold text-accent">{budgetBaseUnits}</span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Pricing Rate:</span>
                    <span className="text-white">
                      {rateUsdc} USDC / {pricingModel.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between text-white/70">
                    <span>Refund Guarantee:</span>
                    <span className="text-emerald-400 font-bold">100% on close</span>
                  </div>
                </div>

                <div className="mt-5 border-t border-white/15 pt-4 text-[11px] text-white/70 leading-relaxed">
                  Funds are transferred non-custodially via NEAR NEP-141 <code>ft_transfer_call</code>.
                  Application servers cannot withdraw or divert escrowed capital.
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
