import { db } from "./dbConfig";
import { eq, sql } from "drizzle-orm";
import { lostItems } from "./schema";
import { ItemCategory, lostItemStatus } from "@/app/LostAndFound/_Component/lostandfound-type";
import { User } from "@clerk/nextjs/server";

/**
 * Creates a lost item report using Clerk user information
 * @param data - Object containing report data
 * @param user - Clerk user object
 * @throws {Error} When required fields are missing or database operations fail
 */


export async function testDbConnection() {
  try {
    const result = await db.execute(sql`SELECT 1 AS result`);

    // Log the raw result for debugging if needed
    console.log(result);

    // Extract the row from the correct property
    const rows = (result as any).rows || []; // safe fallback
    return { success: true, data: rows[0] || null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export const createLostItemReport = async (
  data: {
    title: string;
    description: string;
    category: string;
    locationLost: string;
    Geolocation: { lat: number; lng: number };
    tags: string[];
    phoneNumber: string;
    imageUrl: string;
  },
  clerkUserId: string
) => {
  try {
    // Debug logging
    console.log("Inserting with values:", {
      title: data.title,
      description: data.description,
      category: data.category,
      locationLost: data.locationLost,
      geolocation: {lat:data.Geolocation.lat,lng:data.Geolocation.lng},
      imageUrls: [data.imageUrl],
      tags: data.tags,
      clerkUserId: clerkUserId,
      phoneNumber: data.phoneNumber
    });
    
    // Create the item object first to check for any issues
    const newItem = {
      title: data.title,
      description: data.description,
      category: data.category as ItemCategory,
      locationLost: data.locationLost,
      imageUrls: [data.imageUrl],
      geoLocation: {lat:data.Geolocation.lat,lng:data.Geolocation.lng},
      tags: data.tags,
      status: "LOST" as lostItemStatus,
      reportedAt: new Date(),
      clerkUserId: clerkUserId,
      userPhoneNumber: data.phoneNumber,
      createdAt: new Date(),
    };
    
    console.log("Assembled item object:", newItem);
    
    // Execute the insert
    const result = await db.insert(lostItems).values(newItem);
    console.log("Insert result:", result);
    
    return { success: true };
  } catch (error: any) {
    // More detailed error logging
    console.error("Database error details:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    if (error.stack) console.error("Error stack:", error.stack);
    
    // If it's a specific DB error, log more details
    if (error.code) console.error("Error code:", error.code);
    if (error.detail) console.error("Error detail:", error.detail);
    
    throw new Error(`Failed to create lost item report: ${error.message}`);
  }
};


/**
 * Helper function to get user's existing reports using Clerk user ID
 * @param clerkUserId - Authenticated user's ID from Clerk
 */
export const getUserLostItems = async (clerkUserId: string) => {
  try {
    return await db
      .select()
      .from(lostItems)
      .where(eq(lostItems.clerkUserId, clerkUserId));
  } catch (error) {
    console.error("Failed to fetch user items:", error);
    throw new Error("Failed to retrieve lost items");
  }
};