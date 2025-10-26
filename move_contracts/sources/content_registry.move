/// Content registry module for managing encrypted content
module marketplace::content_registry {
    use sui::object::{Self, UID, ID};
    use sui::tx_context::{Self, TxContext};
    use sui::transfer;
    use sui::clock::{Self, Clock};
    use std::string::{Self, String};
    use marketplace::subscription_tier::{Self, Tier};

    /// Represents a piece of content stored on Walrus and encrypted with Seal
    public struct Content has key, store {
        id: UID,
        tier_id: ID,
        creator: address,
        title: String,
        description: String,
        walrus_blob_id: String,
        seal_policy_id: String,
        content_type: String,
        size_bytes: u64,
        created_at: u64,
    }

    /// Register new content for a tier and add it to the tier's content list
    public entry fun register_content(
        tier: &mut Tier,
        title: vector<u8>,
        description: vector<u8>,
        walrus_blob_id: vector<u8>,
        seal_policy_id: vector<u8>,
        content_type: vector<u8>,
        size_bytes: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let content = Content {
            id: object::new(ctx),
            tier_id: object::id(tier),
            creator: tx_context::sender(ctx),
            title: string::utf8(title),
            description: string::utf8(description),
            walrus_blob_id: string::utf8(walrus_blob_id),
            seal_policy_id: string::utf8(seal_policy_id),
            content_type: string::utf8(content_type),
            size_bytes,
            created_at: clock::timestamp_ms(clock),
        };

        let content_id = object::id_address(&content);

        // Add content to tier's content list
        subscription_tier::add_content_to_tier(tier, content_id, ctx);

        transfer::share_object(content);
    }
}
