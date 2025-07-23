import { db } from "./dbConfig";
import { eq, sql } from "drizzle-orm";
import { donations, lostItems } from "./schema";
import { ItemCategory, lostItemStatus, RecentItem } from "@/app/LostAndFound/_Component/lostandfound-type";
import { User } from "@clerk/nextjs/server";
import { pgEnum } from "drizzle-orm/pg-core";
import { DonationStatus, DonationUnit } from "@/app/Donate/Components/donation-types";

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

export const getRecentLostItems = async (): Promise<RecentItem[]> => {
  try {
    const items = await db
      .select({
        id: lostItems.id,
        title: lostItems.title,
        imageUrls: lostItems.imageUrls,
        locationLost: lostItems.locationLost,
        reportedAt: lostItems.reportedAt,
        status: lostItems.status,
        geoLocation: lostItems.geoLocation,
        createdAt: lostItems.createdAt
      })
      .from(lostItems)
      .orderBy(lostItems.reportedAt)
    
    // Ensure status is not null - provide a default if needed
    return items.map(item => ({
      ...item,
      status: item.status || "LOST" // Default to "LOST" if null
    }));
  } catch (error) {
    console.error("Failed to fetch recent items:", error);
    throw new Error("Failed to retrieve recent lost items");
  }
};



export const createDonation = async (
  data: {
    foodItem: string;
    quantity: string;
    unit: string;
    description?: string;
    bestBefore: Date;
    ngo: string;
    imageUrl?: string;
  },
  clerkUserId: string,
) => {
  try {
    console.log("Inserting donation with values:", {
      ...data,
      clerkUserId,
    });

    const newDonation = {
      foodItem: data.foodItem,
      quantity: data.quantity,
      unit: data.unit as DonationUnit,
      description: data.description || '',
      bestBefore: data.bestBefore.toISOString(),
      ngo: data.ngo,
      imageUrl: data.imageUrl || null,
      clerkUserId: clerkUserId,
      status: 'PENDING' as DonationStatus,
      createdAt: new Date()
    };

    console.log("Assembled donation object:", newDonation);

    const result = await db.insert(donations).values(newDonation);
    console.log("Insert result:", result);

    return { success: true };
  } catch (error: any) {
    console.error("Database error details:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    if (error.stack) console.error("Error stack:", error.stack);
    if (error.code) console.error("Error code:", error.code);
    if (error.detail) console.error("Error detail:", error.detail);

    throw new Error(`Failed to create donation record: ${error.message}`);
  }
};

/**
 * Gets user's donations by Clerk user ID
 * @param clerkUserId - Authenticated user's ID from Clerk
 */
export const getUserDonations = async (clerkUserId: string) => {
  try {
    return await db
      .select()
      .from(donations)
      .where(eq(donations.clerkUserId, clerkUserId))
      .orderBy(donations.createdAt);
  } catch (error) {
    console.error("Failed to fetch user donations:", error);
    throw new Error("Failed to retrieve donations");
  }
};

/**
 * Gets recent donations (default limit 6)
 * @param limit - Number of donations to return
 */
export const getRecentDonations = async () => {
  try {
    return await db
      .select({
        id: donations.id,
        foodItem: donations.foodItem,
        quantity: donations.quantity,
        unit: donations.unit,
        ngo: donations.ngo,
        bestBefore: donations.bestBefore,
        imageUrl: donations.imageUrl,
        status: donations.status,
        createdAt: donations.createdAt
      })
      .from(donations)
      .orderBy(donations.createdAt)
  } catch (error) {
    console.error("Failed to fetch recent donations:", error);
    throw new Error("Failed to retrieve recent donations");
  }
};

/**
 * Updates donation status
 * @param donationId - ID of the donation to update
 * @param newStatus - New status to set
 */
export const updateDonationStatus = async (
  donationId: string,
  newStatus: DonationStatus
) => {
  try {
    await db
      .update(donations)
      .set({ status: newStatus })
      .where(eq(donations.id, donationId));
    return { success: true };
  } catch (error) {
    console.error("Failed to update donation status:", error);
    throw new Error("Failed to update donation status");
  }
};