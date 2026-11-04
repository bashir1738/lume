export interface LumeAd { id: string; campaignId: string; creativeUrl: string; clickUrl: string; }
export interface LumeOptions { publisherId: string; apiBaseUrl?: string; }

export class LumePublisher {
  private readonly baseUrl: string;
  private readonly sent = new Set<string>();
  constructor(private readonly options: LumeOptions) {
    this.baseUrl = options.apiBaseUrl ?? "https://app.lume.network";
  }
  async requestAd(placementId: string): Promise<LumeAd | null> {
    const response = await fetch(`${this.baseUrl}/api/ads?publisherId=${encodeURIComponent(this.options.publisherId)}&placementId=${encodeURIComponent(placementId)}`);
    if (!response.ok) return null;
    return response.json() as Promise<LumeAd>;
  }
  async report(type: "impression" | "click", campaignId: string, placementId: string) {
    const eventId = crypto.randomUUID();
    if (this.sent.has(`${type}:${campaignId}:${placementId}`)) return;
    this.sent.add(`${type}:${campaignId}:${placementId}`);
    try { await fetch(`${this.baseUrl}/api/events`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ eventId, type, campaignId, placementId, occurredAt: new Date().toISOString(), signature: "client-event" }) }); } catch { /* delivery is best effort; server validation remains authoritative */ }
  }
}

