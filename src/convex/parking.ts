import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Start parking session
export const startParkingSession = mutation({
  args: {
    licensePlate: v.string(),
    location: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || (user.role !== "staff" && user.role !== "admin")) {
      throw new Error("Unauthorized: Only staff can manage parking");
    }

    // Check if vehicle is registered
    const vehicle = await ctx.db
      .query("vehicles")
      .withIndex("by_license_plate", (q) => q.eq("licensePlate", args.licensePlate))
      .unique();

    if (!vehicle) {
      throw new Error("Vehicle not registered in system");
    }

    if (vehicle.status === "blocked") {
      throw new Error("Vehicle is blocked from parking");
    }

    // Check if there's already an active session
    const activeSession = await ctx.db
      .query("parkingSessions")
      .withIndex("by_license_plate", (q) => q.eq("licensePlate", args.licensePlate))
      .filter((q) => q.eq(q.field("status"), "active"))
      .unique();

    if (activeSession) {
      throw new Error("Vehicle already has an active parking session");
    }

    return await ctx.db.insert("parkingSessions", {
      vehicleId: vehicle._id,
      licensePlate: args.licensePlate,
      entryTime: Date.now(),
      status: "active",
      location: args.location,
      staffId: user._id,
      notes: args.notes,
    });
  },
});

// End parking session
export const endParkingSession = mutation({
  args: {
    sessionId: v.id("parkingSessions"),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || (user.role !== "staff" && user.role !== "admin")) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.sessionId, {
      exitTime: Date.now(),
      status: "completed",
      notes: args.notes,
    });
  },
});

// Get active parking sessions
export const getActiveSessions = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user || (user.role !== "staff" && user.role !== "admin")) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("parkingSessions")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
  },
});

// Get parking history
export const getParkingHistory = query({
  args: {
    licensePlate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || (user.role !== "staff" && user.role !== "admin")) {
      throw new Error("Unauthorized");
    }

    if (args.licensePlate) {
      const plate = args.licensePlate as string;
      return await ctx.db
        .query("parkingSessions")
        .withIndex("by_license_plate", (q) => q.eq("licensePlate", plate))
        .order("desc")
        .take(50);
    }

    return await ctx.db
      .query("parkingSessions")
      .order("desc")
      .take(50);
  },
});
