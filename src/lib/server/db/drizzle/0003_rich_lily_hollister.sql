ALTER TABLE "user" drop column "is_pro";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "is_pro" boolean GENERATED ALWAYS AS ((
      CURRENT_DATE >= COALESCE(pro_start_date, CURRENT_DATE) 
      AND 
      CURRENT_DATE <= COALESCE(pro_end_date, CURRENT_DATE + INTERVAL '1 day')
    )) STORED;