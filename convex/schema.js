import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    products: defineTable({
        title: v.string(),
        description: v.optional(v.string()),
        shortDescription: v.optional(v.string()),
        price: v.number(),
        originalPrice: v.optional(v.number()),
        image: v.optional(v.string()),
        category: v.optional(v.string()),
        specs: v.optional(v.string()),
        warranty: v.optional(v.string()),
        rating: v.optional(v.number()),
        stockStatus: v.optional(v.string()),
        isHotDeal: v.boolean(),
    }),
});
