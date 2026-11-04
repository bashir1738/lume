import { z } from "zod";

export const campaignSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().max(1000).default(""),
  budgetBaseUnits: z.string().regex(/^[1-9]\d*$/, "Budget must be integer base units"),
  pricingModel: z.enum(["cpm", "cpc"]),
  rateBaseUnits: z.string().regex(/^[1-9]\d*$/),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  targeting: z.object({
    countries: z.array(z.string().min(2).max(2)).max(50),
    categories: z.array(z.string().max(50)).max(20),
    devices: z.array(z.enum(["desktop", "mobile", "tablet"])).max(3),
  }),
}).refine((value) => value.endsAt > value.startsAt, {
  message: "End date must be after start date",
  path: ["endsAt"],
});

export const websiteSchema = z.object({
  domain: z.string().trim().toLowerCase().regex(/^(?:[a-z0-9-]+\.)+[a-z]{2,}$/),
  name: z.string().trim().min(2).max(100),
});

export const eventSchema = z.object({
  eventId: z.string().uuid(),
  placementId: z.string().min(1).max(100),
  campaignId: z.string().min(1).max(100),
  type: z.enum(["impression", "click"]),
  occurredAt: z.coerce.date(),
  signature: z.string().min(1),
});

