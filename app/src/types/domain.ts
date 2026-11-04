export type UserRole = "advertiser" | "publisher" | "admin";
export type CampaignStatus = "draft" | "active" | "paused" | "completed";
export type PricingModel = "cpm" | "cpc";

export interface Campaign {
  id: string;
  advertiserId: string;
  name: string;
  description: string;
  budgetBaseUnits: string;
  spentBaseUnits: string;
  pricingModel: PricingModel;
  rateBaseUnits: string;
  startsAt: string;
  endsAt: string;
  status: CampaignStatus;
  targeting: { countries: string[]; categories: string[]; devices: string[] };
  onChainId?: string;
}

export interface AdEvent {
  eventId: string;
  campaignId: string;
  placementId: string;
  type: "impression" | "click";
  occurredAt: string;
}

export interface SettlementBatch {
  id: string;
  campaignId: string;
  publisherId: string;
  amountBaseUnits: string;
  eventCount: number;
  status: "pending" | "submitted" | "completed" | "failed";
  transactionHash?: string;
}

