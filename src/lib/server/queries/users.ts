import { eq } from "drizzle-orm";
import { db } from "../db";
import { user } from "../db/schema/auth-schema";

export async function setUserProStatus(
  userId: string,
  isPro: boolean,
  proStartDate: Date,
  proEndDate: Date
) {
  await db
    .update(user)
    .set({ isPro, proStartDate, proEndDate })
    .where(eq(user.id, userId));
}
