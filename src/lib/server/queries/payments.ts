import { Payment, WebhookPayload } from "@/lib/types/api-types";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { payments, subscriptions } from "../db/schema";
import { setUserProStatus } from "./users";

export async function handleOneTimePayment(payload: WebhookPayload) {
  const payment = await db
    .insert(payments)
    .values({
      amount: (payload.data as Payment).total_amount,
      currency: (payload.data as Payment).currency,
      status: payload.type,
      paymentId: (payload.data as Payment).payment_id,
      paymentType: "one_time",
      paymentLink: (payload.data as Payment).payment_link,
      paymentMethod: (payload.data as Payment).payment_method,
      customerId: (payload.data as Payment).customer.customer_id,
    })
    .returning();

  const proStartDate = new Date();
  const proEndDate = new Date();
  proEndDate.setMonth(proStartDate.getMonth() + 1);

  await setUserProStatus(
    (payload.data as Payment).customer.customer_id,
    true,
    proStartDate,
    proEndDate
  );

  return { payment, proStartDate, proEndDate };
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
