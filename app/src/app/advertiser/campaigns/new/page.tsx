"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NewCampaignPage() {
  const [submitted, setSubmitted] = useState(false);
  return <main className="mx-auto max-w-3xl px-6 py-10"><Link href="/advertiser" className="text-sm text-muted">← Advertiser workspace</Link><h1 className="mt-10 text-4xl font-semibold">Create campaign</h1><p className="mt-3 text-muted">Budgets and rates are entered as token base units; no floating-point values are accepted.</p><form className="mt-10 space-y-6" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}><label className="block text-sm font-medium">Campaign name<input required minLength={2} className="mt-2 w-full border border-line bg-white p-3" /></label><label className="block text-sm font-medium">Description<textarea className="mt-2 min-h-28 w-full border border-line bg-white p-3" /></label><div className="grid gap-6 md:grid-cols-2"><label className="block text-sm font-medium">Budget base units<input required pattern="[1-9][0-9]*" inputMode="numeric" className="mt-2 w-full border border-line bg-white p-3" /></label><label className="block text-sm font-medium">CPM rate base units<input required pattern="[1-9][0-9]*" inputMode="numeric" className="mt-2 w-full border border-line bg-white p-3" /></label></div><Button type="submit">Save draft</Button>{submitted && <p className="text-sm text-muted">Draft capture is ready for wallet authentication and API submission.</p>}</form></main>;
}

