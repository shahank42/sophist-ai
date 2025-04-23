ALTER TABLE "credit_transactions" DROP CONSTRAINT "credit_transactions_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "credit_transactions" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "credit_transactions" ADD CONSTRAINT "credit_transactions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;