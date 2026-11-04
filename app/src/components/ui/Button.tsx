import { type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn("rounded-md bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-50", className)} {...props} />;
}

