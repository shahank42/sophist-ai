CREATE TABLE "user_purchases" (
	"id" text PRIMARY KEY NOT NULL,
	"subsription_id" text NOT NULL,
	"product_id" text NOT NULL,
	"payment_method" text,
	"status" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
