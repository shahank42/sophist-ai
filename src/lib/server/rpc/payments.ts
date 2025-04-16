import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";
import {
  createOrUpdateInactiveSubscription,
  getSubscriptionByRazorpayId,
  activateSubscription,
} from "../queries/payments";
import { setUserProFn } from "./users";

const razorpay = new Razorpay({
  key_id: process.env.VITE_RAZORPAY_API_KEY_ID!,
  key_secret: process.env.RAZORPAY_API_SECRET!,
});

export const createOrderFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        amount: z.number(),
      })
      .parse(data)
  )
  .handler(async ({ data: { amount } }) => {
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
    });

    return order;
  });

export const createSubscriptionFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        userId: z.string(),
      })
      .parse(data)
  )
  .handler(async ({ data: { userId } }) => {
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.VITE_RAZORPAY_PLAN_ID as string,
      total_count: 6,
    });

    // Create an inactive subscription in our database
    const amount = 50;

    // Get subscription period details if available
    let currentPeriodStart = undefined;
    let currentPeriodEnd = undefined;

    if (subscription.current_start && subscription.current_end) {
      currentPeriodStart = new Date(subscription.current_start * 1000);
      currentPeriodEnd = new Date(subscription.current_end * 1000);
    }

    // Create or update inactive subscription in database with null values for payment details
    const dbSubscription = await createOrUpdateInactiveSubscription(
      userId,
      subscription.id,
      null, // Payment ID will be updated after payment
      null, // Signature will be updated after verification
      amount,
      currentPeriodStart,
      currentPeriodEnd
    );

    return {
      razorpaySubscription: subscription,
      dbSubscription,
    };
  });

const generatedSignature = (
  razorpaySubscriptionId: string,
  razorpayPaymentId: string
) => {
  const keySecret = process.env.RAZORPAY_API_SECRET as string;

  const sig = crypto
    .createHmac("sha256", keySecret)
    .update(razorpayPaymentId + "|" + razorpaySubscriptionId)
    .digest("hex");
  return sig;
};

export const verifyOrderFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        subscriptionId: z.string(),
        razorpayPaymentId: z.string(),
        razorpaySignature: z.string(),
      })
      .parse(data)
  )
  .handler(
    async ({
      data: { subscriptionId, razorpayPaymentId, razorpaySignature },
    }) => {
      const signature = generatedSignature(subscriptionId, razorpayPaymentId);
      if (signature !== razorpaySignature) {
        return {
          message: "Payment verification failed",
          isOk: false,
          subscription: null,
        };
      }

      // Find the subscription in our database
      const subscription = await getSubscriptionByRazorpayId(subscriptionId);

      if (!subscription) {
        return {
          message: "Subscription not found",
          isOk: false,
          subscription: null,
        };
      }

      // Update subscription with payment details and activate it using the query function
      const updatedSubscription = await activateSubscription(
        subscription.id,
        razorpayPaymentId,
        razorpaySignature
      );

      await setUserProFn({ data: { isPro: true } });

      return {
        message: "Payment verified successfully",
        isOk: true,
        subscription: updatedSubscription,
      };
    }
  );
