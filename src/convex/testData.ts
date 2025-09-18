import { mutation } from "./_generated/server";

export const seedTestData = mutation({
  args: {},
  handler: async (ctx) => {
    // Create test vehicles
    const vehicles = [
      {
        licensePlate: "ABC123",
        ownerName: "John Doe",
        ownerEmail: "john@example.com",
        ownerPhone: "+1234567890",
        vehicleModel: "Toyota Camry",
        vehicleColor: "Blue",
        status: "registered" as const,
        registeredBy: "staff_user_id" as any,
        notes: "Regular employee vehicle"
      },
      {
        licensePlate: "XYZ789",
        ownerName: "Jane Smith",
        ownerEmail: "jane@example.com", 
        ownerPhone: "+1987654321",
        vehicleModel: "Honda Civic",
        vehicleColor: "Red",
        status: "registered" as const,
        registeredBy: "staff_user_id" as any,
        notes: "Visitor vehicle"
      },
      {
        licensePlate: "DEF456",
        ownerName: "Bob Johnson",
        ownerEmail: "bob@example.com",
        ownerPhone: "+1122334455",
        vehicleModel: "Ford F-150",
        vehicleColor: "Black",
        status: "pending" as const,
        registeredBy: "staff_user_id" as any,
        notes: "Pending verification"
      }
    ];

    for (const vehicle of vehicles) {
      await ctx.db.insert("vehicles", vehicle);
    }

    console.log("Test data seeded successfully!");
    return { success: true, message: "Test data created" };
  },
});
