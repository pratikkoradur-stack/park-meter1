import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// User roles for parking system
export const ROLES = {
  ADMIN: "admin",
  STAFF: "staff", 
  USER: "user",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.STAFF),
  v.literal(ROLES.USER),
);
export type Role = Infer<typeof roleValidator>;

// Vehicle status types
export const VEHICLE_STATUS = {
  REGISTERED: "registered",
  PENDING: "pending",
  BLOCKED: "blocked",
} as const;

export const vehicleStatusValidator = v.union(
  v.literal(VEHICLE_STATUS.REGISTERED),
  v.literal(VEHICLE_STATUS.PENDING),
  v.literal(VEHICLE_STATUS.BLOCKED),
);

// Parking session status
export const PARKING_STATUS = {
  ACTIVE: "active",
  COMPLETED: "completed",
  VIOLATION: "violation",
} as const;

export const parkingStatusValidator = v.union(
  v.literal(PARKING_STATUS.ACTIVE),
  v.literal(PARKING_STATUS.COMPLETED),
  v.literal(PARKING_STATUS.VIOLATION),
);

const schema = defineSchema(
  {
    ...authTables,

    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
      phone: v.optional(v.string()),
      department: v.optional(v.string()), // For staff users
    }).index("email", ["email"]),

    // Vehicle registration table
    vehicles: defineTable({
      licensePlate: v.string(),
      ownerName: v.string(),
      ownerEmail: v.string(),
      ownerPhone: v.string(),
      vehicleModel: v.string(),
      vehicleColor: v.string(),
      status: vehicleStatusValidator,
      registeredBy: v.id("users"), // Staff member who registered
      notes: v.optional(v.string()),
    })
      .index("by_license_plate", ["licensePlate"])
      .index("by_owner_email", ["ownerEmail"])
      .index("by_status", ["status"]),

    // Parking sessions table
    parkingSessions: defineTable({
      vehicleId: v.id("vehicles"),
      licensePlate: v.string(),
      entryTime: v.number(),
      exitTime: v.optional(v.number()),
      status: parkingStatusValidator,
      location: v.string(), // Parking spot/zone
      staffId: v.optional(v.id("users")), // Staff who handled entry/exit
      notes: v.optional(v.string()),
    })
      .index("by_vehicle", ["vehicleId"])
      .index("by_status", ["status"])
      .index("by_license_plate", ["licensePlate"]),

    // Parking violations table
    violations: defineTable({
      vehicleId: v.optional(v.id("vehicles")),
      licensePlate: v.string(),
      violationType: v.string(), // "unauthorized", "expired", "wrong_zone", etc.
      description: v.string(),
      location: v.string(),
      reportedBy: v.id("users"), // Staff member who reported
      resolved: v.boolean(),
      resolvedBy: v.optional(v.id("users")),
      resolvedAt: v.optional(v.number()),
    })
      .index("by_vehicle", ["vehicleId"])
      .index("by_license_plate", ["licensePlate"])
      .index("by_resolved", ["resolved"]),
  },
  {
    schemaValidation: false,
  },
);

export default schema;