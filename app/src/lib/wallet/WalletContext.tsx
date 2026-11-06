"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { UserRole } from "@/types/domain";

export interface WalletAccount {
  accountId: string;
  role: UserRole;
  balanceUsdc: string;
  balanceNear: string;
  network: "testnet" | "mainnet";
}

export const PRESET_ACCOUNTS: WalletAccount[] = [
  {
    accountId: "aurora-media.testnet",
    role: "advertiser",
    balanceUsdc: "25,400.00",
    balanceNear: "142.50",
    network: "testnet",
  },
  {
    accountId: "lume-network.testnet",
    role: "publisher",
    balanceUsdc: "1,248.50",
    balanceNear: "38.20",
    network: "testnet",
  },
  {
    accountId: "coordinator.lume-contract.testnet",
    role: "admin",
    balanceUsdc: "84,000.00",
    balanceNear: "890.00",
    network: "testnet",
  },
];

interface WalletContextType {
  account: WalletAccount | null;
  isConnected: boolean;
  connect: (account?: WalletAccount) => void;
  disconnect: () => void;
  switchRole: (role: UserRole) => void;
  isWalletModalOpen: boolean;
  setWalletModalOpen: (open: boolean) => void;
  claimEarningsNotification?: string | null;
  setClaimNotification: (msg: string | null) => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<WalletAccount | null>(null);
  const [isWalletModalOpen, setWalletModalOpen] = useState(false);
  const [claimEarningsNotification, setClaimNotification] = useState<string | null>(null);

  useEffect(() => {
    // Load persisted wallet or default to advertiser demo account
    const saved = localStorage.getItem("lume_wallet_account");
    if (saved) {
      try {
        setAccount(JSON.parse(saved));
      } catch {
        setAccount(PRESET_ACCOUNTS[0]);
      }
    } else {
      setAccount(PRESET_ACCOUNTS[0]);
    }
  }, []);

  const connect = (acc?: WalletAccount) => {
    const selected = acc || PRESET_ACCOUNTS[0];
    setAccount(selected);
    localStorage.setItem("lume_wallet_account", JSON.stringify(selected));
    setWalletModalOpen(false);
  };

  const disconnect = () => {
    setAccount(null);
    localStorage.removeItem("lume_wallet_account");
  };

  const switchRole = (role: UserRole) => {
    const match = PRESET_ACCOUNTS.find((a) => a.role === role) || {
      accountId: `user-${role}.testnet`,
      role,
      balanceUsdc: "10,000.00",
      balanceNear: "50.00",
      network: "testnet",
    };
    setAccount(match);
    localStorage.setItem("lume_wallet_account", JSON.stringify(match));
  };

  return (
    <WalletContext.Provider
      value={{
        account,
        isConnected: Boolean(account),
        connect,
        disconnect,
        switchRole,
        isWalletModalOpen,
        setWalletModalOpen,
        claimEarningsNotification,
        setClaimNotification,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}

