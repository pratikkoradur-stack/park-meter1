import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Report a violation
export const reportViolation = mutation({
  args: {
    licensePlate: v.string(),
    violationType: v.string(),
    description: v.string(),
    location: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || (user.role !== "staff" && user.role !== "admin")) {
      throw new Error("Unauthorized: Only staff can report violations");
    }

    // Try to find the vehicle
    const vehicle = await ctx.db
      .query("vehicles")
      .withIndex("by_license_plate", (q) => q.eq("licensePlate", args.licensePlate))
      .unique();

    return await ctx.db.insert("violations", {
      vehicleId: vehicle?._id,
      licensePlate: args.licensePlate,
      violationType: args.violationType,
      description: args.description,
      location: args.location,
      reportedBy: user._id,
      resolved: false,
    });
  },
});

// Get violations
export const getViolations = query({
  args: {
    resolved: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || (user.role !== "staff" && user.role !== "admin")) {
      throw new Error("Unauthorized");
    }

    if (args.resolved !== undefined) {
      const resolved = args.resolved as boolean;
      return await ctx.db
        .query("violations")
        .withIndex("by_resolved", (q) => q.eq("resolved", resolved))
        .order("desc")
        .collect();
    }

    return await ctx.db
      .query("violations")
      .order("desc")
      .collect();
  },
});

// Resolve violation
export const resolveViolation = mutation({
  args: {
    violationId: v.id("violations"),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || (user.role !== "staff" && user.role !== "admin")) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.violationId, {
      resolved: true,
      resolvedBy: user._id,
      resolvedAt: Date.now(),
    });
  },
});
