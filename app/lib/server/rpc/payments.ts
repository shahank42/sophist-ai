import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY_ID!,
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

export const createSubscriptionFn = createServerFn({ method: "POST" }).handler(
  async () => {
    const order = await razorpay.subscriptions.create({
      plan_id: "plan_PzZI7z3awvGme5",
      total_count: 1,
    });

    return order;
  }
);

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
        // return new Response(
        //   JSON.stringify({
        //     message: "Payment verification failed",
        //     isOk: false,
        //   }),
        //   {
        //     status: 400,
        //   }
        // );
        return {
          message: "Payment verification failed",
          isOk: false,
        };
      }

      // Probably some database calls here to update order or add premium status to user
      // return new Response(
      //   JSON.stringify({
      //     message: "Payment verified successfully",
      //     isOk: true,
      //   }),
      //   {
      //     status: 200,
      //   }
      // );
      return {
        message: "Payment verified successfully",
        isOk: true,
      };
    }
  );
