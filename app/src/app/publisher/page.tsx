import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function PublisherPage() {
  return <main className="mx-auto min-h-screen max-w-7xl px-6 py-8"><header className="flex items-center justify-between border-b border-line pb-6"><Link href="/" className="text-xl font-semibold">lume.</Link><Button>Connect wallet</Button></header><section className="py-12"><p className="text-sm text-muted">Publisher workspace</p><h1 className="mt-3 text-4xl font-semibold tracking-tight">Inventory and earnings</h1><div className="mt-10 grid gap-4 md:grid-cols-3">{[["Registered placements","—"],["Verified events","—"],["Available earnings","—"]].map(([label,value]) => <div className="border border-line bg-white p-5" key={label}><p className="text-sm text-muted">{label}</p><p className="mt-8 text-3xl font-semibold">{value}</p><p className="mt-2 text-xs text-muted">Live data appears after wallet connection</p></div>)}</div></section></main>;
}

