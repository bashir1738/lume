import Link from "next/link";

export default function AdminPage() {
  return <main className="mx-auto min-h-screen max-w-7xl px-6 py-8"><header className="flex items-center justify-between border-b border-line pb-6"><Link href="/" className="text-xl font-semibold">lume.</Link><span className="text-sm text-muted">Restricted admin workspace</span></header><section className="py-12"><h1 className="text-4xl font-semibold tracking-tight">Platform operations</h1><p className="mt-3 max-w-xl text-muted">Review application activity, suspicious traffic and settlement status. Admin actions cannot redirect escrow funds.</p><div className="mt-10 grid gap-4 md:grid-cols-4">{["Accounts","Websites","Campaigns","Settlements"].map(label => <div className="border border-line bg-white p-5" key={label}><p className="text-sm text-muted">{label}</p><p className="mt-8 text-3xl font-semibold">—</p></div>)}</div></section></main>;
}

