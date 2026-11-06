import { SignJWT, jwtVerify } from "jose";
import type { UserRole } from "@/types/domain";

function getSecret() {
  const envSecret = process.env.SESSION_SECRET;
  if (!envSecret || envSecret.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET must be configured with at least 32 characters in production");
    }
    return new TextEncoder().encode("lume-development-fallback-session-secret-32-chars-min");
  }
  return new TextEncoder().encode(envSecret);
}

export async function createSession(accountId: string, role: UserRole) {
  const secret = getSecret();
  return new SignJWT({ accountId, role }).setProtectedHeader({ alg: "HS256" })
    .setIssuedAt().setExpirationTime("7d").sign(secret);
}

export async function readSession(token: string | undefined) {
  if (!token) return null;
  try {
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);
    if (typeof payload.accountId !== "string" || typeof payload.role !== "string") return null;
    return { accountId: payload.accountId, role: payload.role as UserRole };
  } catch {
    return null;
  }
}


