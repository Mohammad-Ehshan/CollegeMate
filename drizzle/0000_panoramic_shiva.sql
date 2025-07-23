CREATE TYPE "public"."donation_status" AS ENUM('PENDING', 'SCHEDULED', 'DELIVERED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."donation_unit" AS ENUM('plates', 'kgs', 'servings', 'boxes', 'liters');--> statement-breakpoint
CREATE TYPE "public"."found_status" AS ENUM('FOUND', 'RETURNED', 'DONATED');--> statement-breakpoint
CREATE TYPE "public"."item_category" AS ENUM('electronics', 'documents', 'jewelry', 'clothing', 'bags', 'other');--> statement-breakpoint
CREATE TYPE "public"."lost_status" AS ENUM('LOST', 'FOUND', 'CLAIMED');--> statement-breakpoint
CREATE TABLE "donations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"food_item" varchar(255) NOT NULL,
	"quantity" varchar(50) NOT NULL,
	"unit" "donation_unit" NOT NULL,
	"description" text,
	"best_before" date NOT NULL,
	"ngo" varchar(255) NOT NULL,
	"image_url" varchar(512),
	"clerk_user_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" "donation_status" DEFAULT 'PENDING'
);
--> statement-breakpoint
CREATE TABLE "found_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text DEFAULT '',
	"category" "item_category" NOT NULL,
	"location_found" varchar(255) NOT NULL,
	"image_urls" json NOT NULL,
	"geo_location" json,
	"tags" json DEFAULT '[]'::json,
	"status" "found_status" DEFAULT 'FOUND',
	"reported_at" timestamp DEFAULT now() NOT NULL,
	"clerk_user_id" varchar(255) NOT NULL,
	"user_phone_number" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lost_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text DEFAULT '',
	"category" "item_category" NOT NULL,
	"location_lost" varchar(255) NOT NULL,
	"image_urls" json NOT NULL,
	"geo_location" json,
	"tags" json DEFAULT '[]'::json,
	"status" "lost_status" DEFAULT 'LOST',
	"reported_at" timestamp DEFAULT now() NOT NULL,
	"clerk_user_id" varchar(255) NOT NULL,
	"user_phone_number" varchar(20) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
