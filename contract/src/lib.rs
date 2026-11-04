use near_sdk::{
    env, near, AccountId, BorshStorageKey, Gas, NearToken, PanicOnDefault, Promise,
    PromiseOrValue,
};
use near_sdk::collections::{LookupMap, UnorderedMap, UnorderedSet};
use near_sdk::json_types::U128;
use std::collections::HashSet;

const GAS_FT_TRANSFER: Gas = Gas::from_tgas(10);
const ONE_YOCTO: NearToken = NearToken::from_yoctonear(1);

#[derive(BorshStorageKey)]
enum StorageKey {
    Campaigns,
    Publishers,
    Settlements,
    AuthorizedSettlers,
    PendingRefunds,
    PublisherEarnings,
    PendingClaims,
}

#[near(serializers = [borsh, json])]
#[derive(Clone)]
pub enum CampaignStatus { Draft, Active, Paused, Completed }

#[near(serializers = [borsh, json])]
#[derive(Clone)]
pub struct Campaign {
    pub id: u64,
    pub advertiser_id: AccountId,
    pub name: String,
    pub description: String,
    pub budget: u128,
    pub balance: u128,
    pub spent: u128,
    pub rate: u128,
    pub pricing_model: String,
    pub starts_at: u64,
    pub ends_at: u64,
    pub status: CampaignStatus,
}

#[near(serializers = [borsh, json])]
pub struct SettlementItem { pub publisher_id: AccountId, pub amount: u128 }

#[near(serializers = [borsh, json])]
pub struct SettlementBatch {
    pub batch_id: String,
    pub campaign_id: u64,
    pub items: Vec<SettlementItem>,
}

#[near(serializers = [borsh, json])]
pub struct ContractConfig {
    pub owner_id: AccountId,
    pub token_id: AccountId,
}

#[near(contract_state)]
#[derive(PanicOnDefault)]
pub struct LumeContract {
    pub owner_id: AccountId,
    pub token_id: AccountId,
    pub next_campaign_id: u64,
    pub campaigns: UnorderedMap<u64, Campaign>,
    pub publishers: UnorderedSet<AccountId>,
    pub settlements: LookupMap<String, bool>,
    pub pending_refunds: LookupMap<u64, u128>,
    pub publisher_earnings: LookupMap<AccountId, u128>,
    pub pending_claims: LookupMap<AccountId, u128>,
    pub authorized_settlers: UnorderedSet<AccountId>,
}

#[near]
impl LumeContract {
    #[init]
    pub fn new(owner_id: AccountId, token_id: AccountId) -> Self {
        assert!(!env::state_exists(), "Already initialized");
        assert_ne!(owner_id, token_id, "Owner and token accounts must differ");
        let mut settlers = UnorderedSet::new(StorageKey::AuthorizedSettlers);
        settlers.insert(&owner_id);
        Self {
            owner_id, token_id, next_campaign_id: 0,
            campaigns: UnorderedMap::new(StorageKey::Campaigns),
            publishers: UnorderedSet::new(StorageKey::Publishers),
            settlements: LookupMap::new(StorageKey::Settlements),
            pending_refunds: LookupMap::new(StorageKey::PendingRefunds),
            publisher_earnings: LookupMap::new(StorageKey::PublisherEarnings),
            pending_claims: LookupMap::new(StorageKey::PendingClaims),
            authorized_settlers: settlers,
        }
    }

    pub fn create_campaign(&mut self, name: String, description: String, rate: u128, pricing_model: String, starts_at: u64, ends_at: u64) -> u64 {
        assert!(ends_at > starts_at, "Invalid campaign dates");
        assert!(!name.trim().is_empty() && name.len() <= 100, "Invalid campaign name");
        assert!(description.len() <= 1_000, "Description is too long");
        assert!(pricing_model == "cpm" || pricing_model == "cpc", "Unsupported pricing model");
        assert!(rate > 0, "Rate must be positive");
        let id = self.next_campaign_id;
        self.next_campaign_id += 1;
        self.campaigns.insert(&id, &Campaign {
            id,
            advertiser_id: env::predecessor_account_id(),
            name,
            description,
            budget: 0,
            balance: 0,
            spent: 0,
            rate,
            pricing_model,
            starts_at,
            ends_at,
            status: CampaignStatus::Draft,
        });
        self.log_event("campaign_created", near_sdk::serde_json::json!({ "campaign_id": id }));
        id
    }

    pub fn activate_campaign(&mut self, campaign_id: u64) {
        self.assert_campaign_owner(campaign_id);
        let mut campaign = self.campaign(campaign_id);
        assert!(campaign.balance > 0, "Campaign is not funded");
        assert!(matches!(campaign.status, CampaignStatus::Draft), "Campaign is not a draft");
        campaign.status = CampaignStatus::Active;
        self.campaigns.insert(&campaign_id, &campaign);
        self.log_event("campaign_activated", near_sdk::serde_json::json!({ "campaign_id": campaign_id }));
    }

    pub fn pause_campaign(&mut self, campaign_id: u64) {
        self.assert_campaign_owner(campaign_id);
        let mut campaign = self.campaign(campaign_id);
        assert!(matches!(campaign.status, CampaignStatus::Active), "Campaign is not active");
        campaign.status = CampaignStatus::Paused;
        self.campaigns.insert(&campaign_id, &campaign);
        self.log_event("campaign_paused", near_sdk::serde_json::json!({ "campaign_id": campaign_id }));
    }

    pub fn resume_campaign(&mut self, campaign_id: u64) {
        self.assert_campaign_owner(campaign_id);
        let mut campaign = self.campaign(campaign_id);
        assert!(matches!(campaign.status, CampaignStatus::Paused), "Campaign is not paused");
        campaign.status = CampaignStatus::Active;
        self.campaigns.insert(&campaign_id, &campaign);
        self.log_event("campaign_resumed", near_sdk::serde_json::json!({ "campaign_id": campaign_id }));
    }
    pub fn complete_campaign(&mut self, campaign_id: u64) {
        self.assert_campaign_owner(campaign_id);
        let mut campaign = self.campaign(campaign_id);
        assert!(matches!(campaign.status, CampaignStatus::Active | CampaignStatus::Paused), "Campaign cannot be completed");
        campaign.status = CampaignStatus::Completed;
        self.campaigns.insert(&campaign_id, &campaign);
        self.log_event("campaign_completed", near_sdk::serde_json::json!({ "campaign_id": campaign_id }));
    }
    pub fn register_publisher(&mut self, publisher_id: AccountId) {
        self.assert_owner();
        self.publishers.insert(&publisher_id);
        self.log_event("publisher_registered", near_sdk::serde_json::json!({ "publisher_id": publisher_id }));
    }

    pub fn authorize_settler(&mut self, account_id: AccountId, authorized: bool) {
        self.assert_owner();
        if authorized {
            self.authorized_settlers.insert(&account_id);
        } else {
            assert_ne!(account_id, self.owner_id, "Owner cannot be removed as settler");
            self.authorized_settlers.remove(&account_id);
        }
        self.log_event("settler_authorization_updated", near_sdk::serde_json::json!({
            "account_id": account_id,
            "authorized": authorized
        }));
    }

    pub fn settle(&mut self, batch: SettlementBatch) {
        assert!(self.authorized_settlers.contains(&env::predecessor_account_id()), "Not an authorized settler");
        assert!(!batch.batch_id.trim().is_empty() && batch.batch_id.len() <= 128, "Invalid batch id");
        assert!(!batch.items.is_empty() && batch.items.len() <= 100, "Invalid settlement items");
        assert!(!self.settlements.get(&batch.batch_id).unwrap_or(false), "Settlement batch already processed");
        let mut campaign = self.campaign(batch.campaign_id);
        assert!(matches!(campaign.status, CampaignStatus::Active | CampaignStatus::Paused), "Campaign cannot settle");
        let total: u128 = batch.items.iter().map(|item| item.amount).sum();
        assert!(total > 0 && total <= campaign.balance, "Settlement exceeds campaign balance");
        let mut publishers = HashSet::with_capacity(batch.items.len());
        for item in &batch.items {
            assert!(item.amount > 0, "Settlement item must be positive");
            assert!(self.publishers.contains(&item.publisher_id), "Publisher is not authorized");
            assert!(publishers.insert(item.publisher_id.clone()), "Duplicate publisher in settlement");
        }
        campaign.balance -= total;
        campaign.spent = campaign.spent.checked_add(total).expect("Spent overflow");
        self.campaigns.insert(&batch.campaign_id, &campaign);
        self.settlements.insert(&batch.batch_id, &true);
        for item in &batch.items {
            let current = self.publisher_earnings.get(&item.publisher_id).unwrap_or(0);
            self.publisher_earnings.insert(
                &item.publisher_id,
                &current.checked_add(item.amount).expect("Publisher earnings overflow"),
            );
        }
        self.log_event("settlement_submitted", near_sdk::serde_json::json!({
            "batch_id": batch.batch_id,
            "campaign_id": batch.campaign_id,
            "amount": total.to_string()
        }));
    }

    pub fn claim_earnings(&mut self) -> Promise {
        let publisher_id = env::predecessor_account_id();
        assert!(self.publishers.contains(&publisher_id), "Publisher is not authorized");
        assert!(self.pending_claims.get(&publisher_id).is_none(), "Claim already pending");
        let amount = self.publisher_earnings.remove(&publisher_id).unwrap_or(0);
        assert!(amount > 0, "No earnings available");
        self.pending_claims.insert(&publisher_id, &amount);
        Promise::new(self.token_id.clone())
            .function_call(
                "ft_transfer".to_string(),
                near_sdk::serde_json::json!({
                    "receiver_id": publisher_id,
                    "amount": amount.to_string(),
                    "memo": "lume publisher earnings"
                }).to_string().into_bytes(),
                ONE_YOCTO,
                GAS_FT_TRANSFER,
            )
            .then(Self::ext(env::current_account_id()).on_claim_result(publisher_id, amount))
    }

    #[private]
    pub fn on_claim_result(&mut self, publisher_id: AccountId, amount: u128) -> bool {
        assert_eq!(env::predecessor_account_id(), env::current_account_id(), "Only self can resolve claim");
        self.pending_claims.remove(&publisher_id);
        if env::promise_result(0).is_err() {
            let current = self.publisher_earnings.get(&publisher_id).unwrap_or(0);
            self.publisher_earnings.insert(
                &publisher_id,
                &current.checked_add(amount).expect("Publisher earnings overflow"),
            );
            self.log_event("claim_failed", near_sdk::serde_json::json!({
                "publisher_id": publisher_id,
                "amount": amount.to_string()
            }));
            return false;
        }
        self.log_event("claim_completed", near_sdk::serde_json::json!({
            "publisher_id": publisher_id,
            "amount": amount.to_string()
        }));
        true
    }

    pub fn refund(&mut self, campaign_id: u64, amount: u128) -> Promise {
        self.assert_campaign_owner(campaign_id);
        let mut campaign = self.campaign(campaign_id);
        assert!(matches!(campaign.status, CampaignStatus::Paused | CampaignStatus::Completed), "Pause or complete campaign first");
        assert!(amount > 0 && amount <= campaign.balance, "Refund exceeds available balance");
        assert!(self.pending_refunds.get(&campaign_id).is_none(), "Refund already pending");
        campaign.balance -= amount;
        self.campaigns.insert(&campaign_id, &campaign);
        self.pending_refunds.insert(&campaign_id, &amount);
        Promise::new(self.token_id.clone())
            .function_call(
                "ft_transfer".to_string(),
                near_sdk::serde_json::json!({
                    "receiver_id": campaign.advertiser_id,
                    "amount": amount.to_string(),
                    "memo": format!("lume refund {}", campaign_id)
                }).to_string().into_bytes(),
                ONE_YOCTO,
                GAS_FT_TRANSFER,
            )
            .then(Self::ext(env::current_account_id()).on_refund_result(campaign_id, amount))
    }

    #[private]
    pub fn on_refund_result(&mut self, campaign_id: u64, amount: u128) -> bool {
        assert_eq!(env::predecessor_account_id(), env::current_account_id(), "Only self can resolve refund");
        if env::promise_result(0).is_err() {
            let mut campaign = self.campaign(campaign_id);
            campaign.balance = campaign.balance.checked_add(amount).expect("Balance overflow");
            self.campaigns.insert(&campaign_id, &campaign);
            self.pending_refunds.remove(&campaign_id);
            self.log_event("refund_failed", near_sdk::serde_json::json!({
                "campaign_id": campaign_id,
                "amount": amount.to_string()
            }));
            return false;
        }
        self.pending_refunds.remove(&campaign_id);
        self.log_event("refund_completed", near_sdk::serde_json::json!({
            "campaign_id": campaign_id,
            "amount": amount.to_string()
        }));
        true
    }

    pub fn ft_on_transfer(&mut self, sender_id: AccountId, amount: U128, msg: String) -> PromiseOrValue<U128> {
        assert_eq!(env::predecessor_account_id(), self.token_id, "Only approved token can fund campaigns");
        if amount.0 == 0 {
            return PromiseOrValue::Value(amount);
        }
        let campaign_id: u64 = msg.parse().expect("Message must be a campaign id");
        let mut campaign = self.campaign(campaign_id);
        assert_eq!(campaign.advertiser_id, sender_id, "Only campaign advertiser can fund");
        assert!(matches!(campaign.status, CampaignStatus::Draft | CampaignStatus::Paused), "Campaign cannot be funded");
        campaign.budget = campaign.budget.checked_add(amount.0).expect("Budget overflow");
        campaign.balance = campaign.balance.checked_add(amount.0).expect("Balance overflow");
        self.campaigns.insert(&campaign_id, &campaign);
        self.log_event("campaign_funded", near_sdk::serde_json::json!({
            "campaign_id": campaign_id,
            "amount": amount.0.to_string()
        }));
        PromiseOrValue::Value(U128(0))
    }

    pub fn get_config(&self) -> ContractConfig {
        ContractConfig { owner_id: self.owner_id.clone(), token_id: self.token_id.clone() }
    }

    pub fn get_campaign(&self, campaign_id: u64) -> Option<Campaign> {
        self.campaigns.get(&campaign_id)
    }

    pub fn get_publisher_earnings(&self, publisher_id: AccountId) -> U128 {
        U128(self.publisher_earnings.get(&publisher_id).unwrap_or(0))
    }

    pub fn is_publisher(&self, publisher_id: AccountId) -> bool {
        self.publishers.contains(&publisher_id)
    }

    pub fn is_settlement_processed(&self, batch_id: String) -> bool {
        self.settlements.get(&batch_id).unwrap_or(false)
    }

    fn campaign(&self, id: u64) -> Campaign { self.campaigns.get(&id).expect("Campaign not found") }
    fn assert_owner(&self) {
        assert_eq!(env::predecessor_account_id(), self.owner_id, "Only owner");
    }

    fn assert_campaign_owner(&self, id: u64) {
        assert_eq!(
            self.campaign(id).advertiser_id,
            env::predecessor_account_id(),
            "Only advertiser can manage campaign",
        );
    }
    fn log_event(&self, event: &str, data: near_sdk::serde_json::Value) {
        env::log_str(&format!(
            "EVENT_JSON:{}",
            near_sdk::serde_json::json!({
                "standard": "lume",
                "version": "1.0.0",
                "event": event,
                "data": [data]
            })
        ));
    }
}
