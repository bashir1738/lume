import mongoose, { Schema } from "mongoose";

const AdEventSchema = new Schema({
  eventId: { type: String, required: true, unique: true },
  campaignId: { type: String, required: true, index: true },
  placementId: { type: String, required: true, index: true },
  type: { type: String, enum: ["impression", "click"], required: true },
  occurredAt: { type: Date, required: true },
  verified: { type: Boolean, default: false, index: true },
}, { timestamps: true });

export const AdEventModel = mongoose.models.AdEvent ?? mongoose.model("AdEvent", AdEventSchema);

