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
    .set({ proStartDate, proEndDate })
    .where(eq(user.customerId, customerId));
}

export async function getUserProStatus(userId: string) {
  const userData = await db.query.user.findFirst({
    where: eq(user.id, userId),
  });

  if (!userData) {
    throw new Error("User not found");
  }

  const now = new Date();
  const isPro =
    userData.proStartDate != null &&
    userData.proEndDate != null &&
    now >= userData.proStartDate &&
    now <= userData.proEndDate;

  return {
    proStartDate: userData.proStartDate,
    proEndDate: userData.proEndDate,
    isPro,
  };
}

export async function setUserCustomerId(userId: string, customerId: string) {
  await db.update(user).set({ customerId }).where(eq(user.id, userId));
}
