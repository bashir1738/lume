import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as { accountId?: string } | null;
  if (!body?.accountId || !/^[a-z0-9._-]+$/.test(body.accountId)) return NextResponse.json({ error: "Invalid account" }, { status: 400 });
  return NextResponse.json({ nonce: randomUUID(), message: `Sign in to Lume as ${body.accountId}` });
}

