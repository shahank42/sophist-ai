import { eq } from "drizzle-orm";
import { db } from "../db";
import { user } from "../db/schema/auth-schema";

export async function setUserProStatus(
  customerId: string,
  isPro: boolean,
  proStartDate: Date,
  proEndDate: Date
) {
  await db
    .update(user)
    .set({ isPro, proStartDate, proEndDate })
    .where(eq(user.customerId, customerId));
}

export async function setUserCustomerId(userId: string, customerId: string) {
  await db.update(user).set({ customerId }).where(eq(user.id, userId));
}
