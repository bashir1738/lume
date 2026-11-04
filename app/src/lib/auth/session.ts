import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "@/types/domain";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET);
if (secret.length < 32) throw new Error("SESSION_SECRET must be at least 32 characters");

export async function createSession(accountId: string, role: UserRole) {
  return new SignJWT({ accountId, role }).setProtectedHeader({ alg: "HS256" })
    .setIssuedAt().setExpirationTime("7d").sign(secret);
}

export async function readSession(token: string | undefined) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.accountId !== "string" || typeof payload.role !== "string") return null;
    return { accountId: payload.accountId, role: payload.role as UserRole };
  } catch {
    return null;
  }
}

