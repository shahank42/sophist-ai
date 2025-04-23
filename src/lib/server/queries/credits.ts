import { asc, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { creditTransactions, user } from "../db/schema";

export async function getCreditPlans() {
  const creditPlans = await db.query.creditBundles.findMany({
    orderBy: (creditPlan) => [asc(creditPlan.price)],
  });

  return creditPlans;
}

export async function addCreditBundle({
  customerId,
  bundleId,
  paymentId,
}: {
  customerId: string;
  bundleId: string;
  paymentId: string;
}) {
  const userToAdd = await db.query.user.findFirst({
    where: (user) => eq(user.customerId, customerId),
  });

  if (!userToAdd) {
    throw new Error("User not found");
  }

  const bundle = await db.query.creditBundles.findFirst({
    where: (bundle) => eq(bundle.id, bundleId),
  });

  if (!bundle) {
    throw new Error("Bundle not found");
  }

  const creditRecord = await db
    .insert(creditTransactions)
    .values({
      userId: userToAdd.id,
      amount: bundle.credits,
      transactionType: "purchase",
      relatedId: paymentId,
    })
    .returning();

  console.log("credit record", creditRecord);

  const newUser = await db
    .update(user)
    .set({
      credits: sql`${user.credits} + ${creditRecord[0].amount}`,
    })
    .where(eq(user.id, userToAdd.id))
    .returning();

  console.log("new user", newUser);

  return creditRecord[0];
}

export async function getUserCredits(userId: string) {
  const user = await db.query.user.findFirst({
    where: (user) => eq(user.id, userId),
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user.credits;
}
