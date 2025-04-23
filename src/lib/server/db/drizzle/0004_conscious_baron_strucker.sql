ALTER TABLE "credit_bundles" ADD COLUMN "is_primary" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "credit_bundles" ADD COLUMN "button_text" text NOT NULL;--> statement-breakpoint
ALTER TABLE "credit_bundles" ADD COLUMN "features" text[] NOT NULL;