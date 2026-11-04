import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (!searchParams.get("publisherId") || !searchParams.get("placementId")) return NextResponse.json({ error: "Missing placement context" }, { status: 400 });
  return NextResponse.json({ ad: null, reason: "No eligible live campaign" });
}

