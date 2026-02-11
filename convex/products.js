import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all products
export const get = query({
    handler: async (ctx) => {
        const products = await ctx.db
            .query("products")
            .order("desc")
            .collect();
        return products;
    },
});

// Add a new product
export const add = mutation({
    args: {
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
    },
    handler: async (ctx, args) => {
        const productId = await ctx.db.insert("products", {
            title: args.title,
            description: args.description || "",
            shortDescription: args.shortDescription || "",
            price: args.price,
            originalPrice: args.originalPrice || 0,
            image: args.image || "",
            category: args.category || "",
            specs: args.specs || "",
            warranty: args.warranty || "1 godina",
            rating: args.rating || 5,
            stockStatus: args.stockStatus || "In Stock",
            isHotDeal: args.isHotDeal,
        });
        return productId;
    },
});

// Update a product
export const update = mutation({
    args: {
        id: v.id("products"),
        title: v.optional(v.string()),
        description: v.optional(v.string()),
        shortDescription: v.optional(v.string()),
        price: v.optional(v.number()),
        originalPrice: v.optional(v.number()),
        image: v.optional(v.string()),
        category: v.optional(v.string()),
        specs: v.optional(v.string()),
        warranty: v.optional(v.string()),
        rating: v.optional(v.number()),
        stockStatus: v.optional(v.string()),
        isHotDeal: v.optional(v.boolean()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;
        // Remove undefined values
        const cleanUpdates = {};
        for (const [key, value] of Object.entries(updates)) {
            if (value !== undefined) {
                cleanUpdates[key] = value;
            }
        }
        await ctx.db.patch(id, cleanUpdates);
    },
});

// Delete a product
export const remove = mutation({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
