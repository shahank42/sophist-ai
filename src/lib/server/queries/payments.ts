import { Payment, WebhookPayload } from "@/lib/types/api-types";
import { desc, eq } from "drizzle-orm";
import { db } from "../db";
import { payments, subscriptions } from "../db/schema";
import { setUserProStatus } from "./users";

export async function handleOneTimePayment(payload: WebhookPayload) {
  const payloadData = payload.data as Payment;

  const productId = payloadData.product_cart![0].product_id;

  const payment = await db
    .insert(payments)
    .values({
      amount: payloadData.total_amount,
      currency: payloadData.currency,
      status: payload.type,
      paymentId: payloadData.payment_id,
      paymentType: "one_time",
      paymentLink: payloadData.payment_link,
      paymentMethod: payloadData.payment_method,
      customerId: payloadData.customer.customer_id,
    })
    .returning();

  const proStartDate = new Date();
  const proEndDate = new Date();
  proEndDate.setMonth(proStartDate.getMonth() + 1);

  await setUserProStatus(
    payloadData.customer.customer_id,
    true,
    proStartDate,
    proEndDate
  );

  return { payment, productId, proStartDate, proEndDate };
}

export async function addSubscription(
  customerId: string,
  planType: "single.weekly" | "single.monthly",
  proStartDate: Date,
  proEndDate: Date
) {
  const user = await db.query.user.findFirst({
    where: (user) => eq(user.customerId, customerId),
  });

  if (!user) {
    throw new Error("User not found");
  }

  await db.insert(subscriptions).values({
    userId: user.id,
    plan: planType,
    status: "active",
    currentPeriodStart: proStartDate,
    currentPeriodEnd: proEndDate,
  });
}

export async function getSubscription(userId: string) {
  const subscription = await db.query.subscriptions.findFirst({
    where: (subscription) => eq(subscription.userId, userId),
    orderBy: (subscription) => [desc(subscription.createdAt)],
  });

  if (!subscription) {
    console.log("User does not have a subscription");
    return {
      subscription: null,
      isPro: false,
    };
  }

  const now = new Date();
  const isPro =
    subscription.currentPeriodStart != null &&
    subscription.currentPeriodEnd != null &&
    now >= subscription.currentPeriodStart &&
    now <= subscription.currentPeriodEnd;

  return {
    subscription,
    isPro,
  };
}
