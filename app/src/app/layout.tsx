import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "Lume — Advertising infrastructure", description: "Measured advertising with transparent on-chain settlement." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}

