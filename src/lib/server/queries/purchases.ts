import { db } from "../db";
import { userPurchases } from "../db/schema";

export async function createPurchaseRecord(
  subscriptionId: string,
  productId: string,
  status: string,
  paymentMethod: string
) {
  const record = await db
    .insert(userPurchases)
    .values({
      subscriptionId,
      productId,
      status,
      paymentMethod,
    })
    .returning();

  return record;
}
