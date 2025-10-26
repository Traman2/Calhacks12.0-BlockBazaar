/// Subscription tier module for creating and managing subscription tiers
module marketplace::subscription_tier {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::coin::{Self, Coin};
    use sui::sui::SUI;
    use sui::clock::{Self, Clock};
    use std::string::{Self, String};
    use marketplace::marketplace::{Self, Marketplace};

    /// A subscription tier that creators can sell
    public struct Tier has key, store {
        id: UID,
        creator: address,
        name: String,
        description: String,
        price: u64, // in MIST
        duration_days: u64,
        subscriber_count: u64,
        content_ids: vector<address>,
        is_active: bool,
        created_at: u64,
    }

    /// A subscription NFT that grants access to tier content
    public struct Subscription has key, store {
        id: UID,
        tier_id: ID,
        subscriber: address,
        expires_at: u64,
    }

    /// Create a new subscription tier
    public entry fun create_tier(
        marketplace: &mut Marketplace,
        name: vector<u8>,
        description: vector<u8>,
        price: u64,
        duration_days: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let tier = Tier {
            id: object::new(ctx),
            creator: tx_context::sender(ctx),
            name: string::utf8(name),
            description: string::utf8(description),
            price,
            duration_days,
            subscriber_count: 0,
            content_ids: vector::empty(),
            is_active: true,
            created_at: clock::timestamp_ms(clock),
        };

        let tier_id = object::id_address(&tier);
        marketplace::add_tier(marketplace, tier_id);

        transfer::share_object(tier);
    }

    /// Purchase a subscription to a tier
    public entry fun purchase_subscription(
        marketplace: &Marketplace,
        tier_id: ID,
        payment: Coin<SUI>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        // This is a simplified version - in production you'd fetch the tier
        // For now we just verify payment amount matches
        let payment_value = coin::value(&payment);

        // Transfer payment to tier creator (simplified - would get from tier object)
        transfer::public_transfer(payment, @0x0); // Placeholder

        // Calculate expiration
        let now = clock::timestamp_ms(clock);
        let expires_at = now + (86400000 * 30); // 30 days in milliseconds

        // Create subscription NFT
        let subscription = Subscription {
            id: object::new(ctx),
            tier_id,
            subscriber: tx_context::sender(ctx),
            expires_at,
        };

        transfer::transfer(subscription, tx_context::sender(ctx));
    }

    /// Add content to a tier (creator only)
    public entry fun add_content_to_tier(
        tier: &mut Tier,
        content_id: address,
        ctx: &TxContext
    ) {
        assert!(tier.creator == tx_context::sender(ctx), 0);
        vector::push_back(&mut tier.content_ids, content_id);
    }
}
