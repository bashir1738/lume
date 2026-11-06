import type { Metadata } from "next";
import "./globals.css";
import { WalletProvider } from "@/lib/wallet/WalletContext";

export const metadata: Metadata = {
  title: "Lume — Decentralized Advertising Infrastructure",
  description:
    "Measured advertising marketplace with high-throughput off-chain ad delivery and transparent NEAR on-chain escrow & batch settlement.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
