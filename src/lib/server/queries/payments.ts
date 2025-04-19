import { Payment, WebhookPayload } from "@/lib/types/api-types";
import { db } from "../db";
import { payments } from "../db/schema";
import { setUserProStatus } from "./users";

export async function handleOneTimePayment(payload: WebhookPayload) {
  await db.insert(payments).values({
    amount: (payload.data as Payment).total_amount,
    currency: (payload.data as Payment).currency,
    status: payload.type,
    paymentId: (payload.data as Payment).payment_id,
    paymentType: "one_time",
    paymentLink: (payload.data as Payment).payment_link,
    paymentMethod: (payload.data as Payment).payment_method,
    customerId: (payload.data as Payment).customer.customer_id,
  });

  const proStartDate = new Date();
  const proEndDate = new Date();
  proEndDate.setMonth(proStartDate.getMonth() + 1);

  await setUserProStatus(
    (payload.data as Payment).customer.customer_id,
    true,
    proStartDate,
    proEndDate
  );
}
