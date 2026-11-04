import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/database/mongoose";
import { CampaignModel } from "@/models/Campaign";
import { campaignSchema } from "@/lib/validation/schemas";
import { readSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  const session = await readSession(request.headers.get("authorization")?.replace("Bearer ", ""));
  if (!session || session.role !== "advertiser") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = campaignSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid campaign", details: parsed.error.flatten() }, { status: 400 });
  await connectDatabase();
  const campaign = await CampaignModel.create({ ...parsed.data, advertiserId: session.accountId });
  return NextResponse.json({ campaign }, { status: 201 });
}

export async function GET(request: Request) {
  const session = await readSession(request.headers.get("authorization")?.replace("Bearer ", ""));
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDatabase();
  const campaigns = await CampaignModel.find(session.role === "admin" ? {} : { advertiserId: session.accountId }).sort({ createdAt: -1 }).lean();
  return NextResponse.json({ campaigns });
}

