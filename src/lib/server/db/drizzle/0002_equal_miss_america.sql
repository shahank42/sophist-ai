ALTER TABLE "payments" DROP CONSTRAINT "payments_user_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "payments_user_id_idx";--> statement-breakpoint
ALTER TABLE "payments" DROP COLUMN "user_id";