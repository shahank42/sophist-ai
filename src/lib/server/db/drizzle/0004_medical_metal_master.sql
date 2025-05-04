CREATE TABLE "feedback" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"text" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "is_pro" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "is_pro" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "credits" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "credits" DROP NOT NULL;