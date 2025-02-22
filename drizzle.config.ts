import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./app/lib/server/db/drizzle",
  schema: "./app/lib/server/db/schema/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
