import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY_ID!,
  key_secret: process.env.RAZORPAY_API_SECRET!,
});

export const APIRoute = createAPIFileRoute("/api/payment/order/create")({
  POST: async ({ request, params }) => {
    const { amount } = await request.json(); // Not type safe!
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
    });

    return json({ order });
  },
});
