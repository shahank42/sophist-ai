ALTER TABLE "subscriptions" ALTER COLUMN "plan" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."plan_type";--> statement-breakpoint
CREATE TYPE "public"."plan_type" AS ENUM('single.weekly', 'single.monthly');--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "plan" SET DATA TYPE "public"."plan_type" USING "plan"::"public"."plan_type";