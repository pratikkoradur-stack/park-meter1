import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

// Register a new vehicle
export const registerVehicle = mutation({
  args: {
    licensePlate: v.string(),
    ownerName: v.string(),
    ownerEmail: v.string(),
    ownerPhone: v.string(),
    vehicleModel: v.string(),
    vehicleColor: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || (user.role !== "staff" && user.role !== "admin")) {
      throw new Error("Unauthorized: Only staff can register vehicles");
    }

    // Check if vehicle already exists
    const existing = await ctx.db
      .query("vehicles")
      .withIndex("by_license_plate", (q) => q.eq("licensePlate", args.licensePlate))
      .unique();

    if (existing) {
      throw new Error("Vehicle with this license plate already registered");
    }

    return await ctx.db.insert("vehicles", {
      ...args,
      status: "registered",
      registeredBy: user._id,
    });
  },
});

// Get all vehicles with pagination
export const getVehicles = query({
  args: {
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || (user.role !== "staff" && user.role !== "admin")) {
      throw new Error("Unauthorized");
    }

    if (args.status) {
      return await ctx.db
        .query("vehicles")
        .withIndex("by_status", (q) => q.eq("status", args.status as any))
        .collect();
    }

    return await ctx.db.query("vehicles").collect();
  },
});

// Search vehicle by license plate
export const searchVehicle = query({
  args: {
    licensePlate: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || (user.role !== "staff" && user.role !== "admin")) {
      throw new Error("Unauthorized");
    }

    return await ctx.db
      .query("vehicles")
      .withIndex("by_license_plate", (q) => q.eq("licensePlate", args.licensePlate))
      .unique();
  },
});

// Update vehicle status
export const updateVehicleStatus = mutation({
  args: {
    vehicleId: v.id("vehicles"),
    status: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user || (user.role !== "staff" && user.role !== "admin")) {
      throw new Error("Unauthorized");
    }

    await ctx.db.patch(args.vehicleId, {
      status: args.status as any,
      notes: args.notes,
    });
  },
});
