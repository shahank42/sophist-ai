import { createServerFn } from "@tanstack/start";
import { z } from "zod";
import Razorpay from "razorpay";

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

export const createSubscriptionFn = createServerFn({ method: "POST" })
  // .validator((data: unknown) =>
  //   z
  //     .object({
  //       amount: z.number(),
  //     })
  //     .parse(data)
  // )
  .handler(async () => {
    const order = await razorpay.subscriptions.create({
      plan_id: "plan_PzZI7z3awvGme5",
      total_count: 1,
    });

    return order;
  });
