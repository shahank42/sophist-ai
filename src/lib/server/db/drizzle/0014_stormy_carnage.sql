ALTER TABLE "credit_transactions" RENAME COLUMN "related_payment_id" TO "related_id";--> statement-breakpoint
ALTER TABLE "credit_transactions" DROP CONSTRAINT "credit_transactions_bundle_id_credit_bundles_id_fk";
--> statement-breakpoint
ALTER TABLE "credit_transactions" DROP CONSTRAINT "credit_transactions_related_payment_id_payments_id_fk";
--> statement-breakpoint
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_related_id_payments_id_fk" FOREIGN KEY ("related_id") REFERENCES "public"."payments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "credit_transactions" DROP COLUMN "bundle_id";