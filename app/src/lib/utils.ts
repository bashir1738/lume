import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUnits(value: string | number, decimals = 6): string {
  const raw = typeof value === "number" ? value : Number(value) / 10 ** decimals;
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(raw);
}

