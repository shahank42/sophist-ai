import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import Razorpay from "razorpay";
import {
  markSubscriptionAsPending,
  haltSubscription,
} from "../../../lib/server/queries/payments";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY_ID!,
  key_secret: process.env.RAZORPAY_API_SECRET!,
});

export const APIRoute = createAPIFileRoute("/api/payments/webhook")({
  POST: async ({ request, params }) => {
    // TODO: verify webhook signature
    console.log("Webhook hit!");

    const { event, payload } = await request.json();

    switch (event) {
      case "subscription.pending":
        await markSubscriptionAsPending(payload.subscription_id);
        break;
      case "subscription.halted":
        await haltSubscription(payload.subscription_id);
        break;
      case "subscription.cancelled":
        break;
      default:
        console.log(`Unhandled event: ${event}`);
        break;
    }

    return json({ success: true }, { status: 200 });
  },
});
