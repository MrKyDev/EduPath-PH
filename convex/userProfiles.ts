import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getUserProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    return await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

export const createOrUpdateProfile = mutation({
  args: {
    skills: v.array(v.string()),
    interests: v.array(v.string()),
    location: v.string(),
    educationLevel: v.string(),
    preferredType: v.string(),
    budget: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existingProfile = await ctx.db
      .query("userProfiles")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existingProfile) {
      await ctx.db.patch(existingProfile._id, {
        skills: args.skills,
        interests: args.interests,
        location: args.location,
        educationLevel: args.educationLevel,
        preferredType: args.preferredType,
        budget: args.budget,
      });
      return existingProfile._id;
    } else {
      return await ctx.db.insert("userProfiles", {
        userId,
        skills: args.skills,
        interests: args.interests,
        location: args.location,
        educationLevel: args.educationLevel,
        preferredType: args.preferredType,
        budget: args.budget,
      });
    }
  },
});
