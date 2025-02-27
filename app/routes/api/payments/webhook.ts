import { json } from "@tanstack/start";
import { createAPIFileRoute } from "@tanstack/start/api";
import Razorpay from "razorpay";
import {
  markSubscriptionAsPending,
  haltSubscription,
  cancelSubscriptionByRazorpayId,
} from "../../../lib/server/queries/payments";
import { c } from "node_modules/better-auth/dist/index-Y--3ocl8";

// const razorpay = new Razorpay({
//   key_id: process.env.VITE_RAZORPAY_API_KEY_ID!,
//   key_secret: process.env.RAZORPAY_API_SECRET!,
// });

export const APIRoute = createAPIFileRoute("/api/payments/webhook")({
  POST: async ({ request, params }) => {
    // TODO: verify webhook signature
    console.log("Webhook hit!");

    const { event, payload } = await request.json();

    switch (event) {
      case "subscription.pending":
        console.log(
          `Marking subscription as pending: ${payload.subscription.entity.id}`
        );
        await markSubscriptionAsPending(payload.subscription.entity.id);
        break;
      case "subscription.halted":
        console.log(`Halting subscription: ${payload.subscription.entity.id}`);
        await haltSubscription(payload.subscription.entity.id);
        break;
      case "subscription.cancelled":
        console.log(
          `Cancelling subscription: ${payload.subscription.entity.id}`
        );
        await cancelSubscriptionByRazorpayId(payload.subscription.entity.id);
        break;
      default:
        console.log(
          `Unhandled event: ${event} for subscription: ${payload.subscription.entity.id}`
        );
        break;
    }

    return json({ success: true }, { status: 200 });
  },
});
