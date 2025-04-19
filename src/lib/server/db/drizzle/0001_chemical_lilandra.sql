CREATE TYPE "public"."payment_type" AS ENUM('one_time', 'subscription');--> statement-breakpoint
CREATE TABLE "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"amount" integer NOT NULL,
	"currency" text NOT NULL,
	"status" text NOT NULL,
	"payment_type" "payment_type" DEFAULT 'one_time' NOT NULL,
	"payment_method" text,
	"transaction_id" text NOT NULL,
	"customer_email" text NOT NULL,
	"customer_name" text,
	"billing_city" text,
	"billing_country" text,
	"billing_state" text,
	"billing_street" text,
	"billing_zipcode" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "subscriptions" CASCADE;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "payments_user_id_idx" ON "payments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "payments_transaction_id_idx" ON "payments" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "payments_customer_email_idx" ON "payments" USING btree ("customer_email");