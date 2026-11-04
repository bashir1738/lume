import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AdvertiserPage() {
  return <main className="mx-auto min-h-screen max-w-7xl px-6 py-8"><header className="flex items-center justify-between border-b border-line pb-6"><Link href="/" className="text-xl font-semibold">lume.</Link><Button>Connect wallet</Button></header><section className="py-12"><p className="text-sm text-muted">Advertiser workspace</p><div className="mt-3 flex flex-wrap items-end justify-between gap-5"><div><h1 className="text-4xl font-semibold tracking-tight">Campaign overview</h1><p className="mt-2 text-muted">Connect a wallet to load live campaigns and escrow balances.</p></div><Link href="/advertiser/campaigns/new" className="rounded-md bg-ink px-4 py-2 text-sm text-white">Create campaign</Link></div><div className="mt-10 grid gap-4 md:grid-cols-3">{[["Active campaigns","—"],["Verified impressions","—"],["Escrow balance","—"]].map(([label,value]) => <div className="border border-line bg-white p-5" key={label}><p className="text-sm text-muted">{label}</p><p className="mt-8 text-3xl font-semibold">{value}</p><p className="mt-2 text-xs text-muted">Live data appears after wallet connection</p></div>)}</div></section></main>;
}

