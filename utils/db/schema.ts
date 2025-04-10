import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  json,
  pgEnum,
} from 'drizzle-orm/pg-core';

// Enums
export const itemCategoryEnum = pgEnum('item_category', [
  'electronics',
  'documents',
  'jewelry',
  'clothing',
  'bags',
  'other',
]);

export const lostItemStatusEnum = pgEnum('lost_status', ['LOST', 'FOUND', 'CLAIMED']);
export const foundItemStatusEnum = pgEnum('found_status', ['FOUND', 'RETURNED', 'DONATED']);

// Lost Items Table with Clerk user integration
export const lostItems = pgTable('lost_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').default(''),
  category: itemCategoryEnum('category').notNull(),
  locationLost: varchar('location_lost', { length: 255 }).notNull(),
  imageUrls: json('image_urls').$type<string[]>().notNull(),
  geoLocation: json('geo_location').$type<{ lat: number; lng: number }>(),
  tags: json('tags').$type<string[]>().default([]),
  status: lostItemStatusEnum('status').default('LOST'),
  reportedAt: timestamp('reported_at').defaultNow().notNull(),
  // Clerk user fields
  clerkUserId: varchar('clerk_user_id', { length: 255 }).notNull(),
  userPhoneNumber: varchar('user_phone_number', { length: 20 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type LostItem = typeof lostItems.$inferSelect;
export type NewLostItem = typeof lostItems.$inferInsert;

// Found Items Table with Clerk user integration
export const foundItems = pgTable('found_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').default(''),
  category: itemCategoryEnum('category').notNull(),
  locationFound: varchar('location_found', { length: 255 }).notNull(),
  imageUrls: json('image_urls').$type<string[]>().notNull(),
  geoLocation: json('geo_location').$type<{ lat: number; lng: number }>(),
  tags: json('tags').$type<string[]>().default([]),
  status: foundItemStatusEnum('status').default('FOUND'),
  reportedAt: timestamp('reported_at').defaultNow().notNull(),
  // Clerk user fields
  clerkUserId: varchar('clerk_user_id', { length: 255 }).notNull(),
  userPhoneNumber: varchar('user_phone_number', { length: 20 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type FoundItem = typeof foundItems.$inferSelect;
export type NewFoundItem = typeof foundItems.$inferInsert;