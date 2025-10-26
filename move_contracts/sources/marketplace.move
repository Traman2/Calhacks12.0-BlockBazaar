/// Marketplace module for managing subscription tiers and content
module marketplace::marketplace {
    use sui::object::{Self, UID};
    use sui::tx_context::TxContext;
    use sui::transfer;
    use sui::vec_set::{Self, VecSet};

    /// The main marketplace object that tracks all tiers
    public struct Marketplace has key {
        id: UID,
        tier_ids: vector<address>,
    }

    /// Initialize the marketplace (call once on deployment)
    fun init(ctx: &mut TxContext) {
        let marketplace = Marketplace {
            id: object::new(ctx),
            tier_ids: vector::empty(),
        };
        transfer::share_object(marketplace);
    }

    /// Add a tier to the marketplace
    public fun add_tier(marketplace: &mut Marketplace, tier_id: address) {
        vector::push_back(&mut marketplace.tier_ids, tier_id);
    }

    /// Get all tier IDs
    public fun get_tier_ids(marketplace: &Marketplace): &vector<address> {
        &marketplace.tier_ids
    }
}
