DROP INDEX "payments_transaction_id_idx";--> statement-breakpoint
DROP INDEX "payments_customer_email_idx";--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "payment_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "payment_link" text;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "customer_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "pro_start_date" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "pro_end_date" timestamp;--> statement-breakpoint
CREATE INDEX "payments_payment_id_idx" ON "payments" USING btree ("payment_id");--> statement-breakpoint
CREATE INDEX "payments_customer_id_idx" ON "payments" USING btree ("customer_id");--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "transaction_id";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "customer_email";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "customer_name";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "billing_city";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "billing_country";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "billing_state";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "billing_street";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "billing_zipcode";