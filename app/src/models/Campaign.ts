import mongoose, { Schema } from "mongoose";

const CampaignSchema = new Schema({
  advertiserId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String, default: "" },
  budgetBaseUnits: { type: String, required: true },
  spentBaseUnits: { type: String, default: "0" },
  pricingModel: { type: String, enum: ["cpm", "cpc"], required: true },
  rateBaseUnits: { type: String, required: true },
  startsAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  status: { type: String, enum: ["draft", "active", "paused", "completed"], default: "draft", index: true },
  targeting: { countries: [String], categories: [String], devices: [String] },
  onChainId: { type: String, index: true },
}, { timestamps: true });

export const CampaignModel = mongoose.models.Campaign ?? mongoose.model("Campaign", CampaignSchema);

