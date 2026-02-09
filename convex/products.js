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
        price: v.number(),
        image: v.optional(v.string()),
        category: v.optional(v.string()),
        specs: v.optional(v.string()),
        isHotDeal: v.boolean(),
    },
    handler: async (ctx, args) => {
        const productId = await ctx.db.insert("products", {
            title: args.title,
            description: args.description || "",
            price: args.price,
            image: args.image || "",
            category: args.category || "",
            specs: args.specs || "",
            isHotDeal: args.isHotDeal,
        });
        return productId;
    },
});

// Delete a product
export const remove = mutation({
    args: { id: v.id("products") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
