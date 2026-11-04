import Link from "next/link";

export function MarketingHeader() {
  return <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
    <Link href="/" className="text-xl font-semibold tracking-tight">lume<span className="text-muted">.</span></Link>
    <nav className="hidden gap-6 text-sm text-muted md:flex"><Link href="#how-it-works">How it works</Link><Link href="#security">Security</Link><Link href="/advertiser">Advertiser workspace</Link></nav>
    <Link href="/advertiser" className="rounded-md border border-line px-4 py-2 text-sm font-medium">Open workspace</Link>
  </header>;
}

