import { eq } from "drizzle-orm";
import { db } from "../db";
import { user } from "../db/schema/auth-schema";

export async function setUserProStatus(userId: string, isPro: boolean) {
  await db.update(user).set({ isPro }).where(eq(user.id, userId));
}
