import { NextResponse } from "next/server";
import { connectDatabase } from "@/lib/database/mongoose";
import { AdEventModel } from "@/models/AdEvent";
import { eventSchema } from "@/lib/validation/schemas";

export async function POST(request: Request) {
  const parsed = eventSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Invalid event" }, { status: 400 });
  await connectDatabase();
  try {
    const event = await AdEventModel.create({ ...parsed.data, signature: undefined, verified: false });
    return NextResponse.json({ accepted: true, eventId: event.eventId }, { status: 202 });
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === 11000) return NextResponse.json({ accepted: true, duplicate: true });
    return NextResponse.json({ error: "Could not accept event" }, { status: 500 });
  }
}

