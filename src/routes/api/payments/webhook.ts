import { WebhookPayload } from "@/lib/types/api-types";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { Webhook } from "standardwebhooks";

const webhook = new Webhook(process.env.NEXT_PUBLIC_DODO_WEBHOOK_KEY!);

export const APIRoute = createAPIFileRoute("/api/payments/webhook")({
  GET: async ({ request, params }) => {
    try {
      const rawBody = await request.text();
      console.log("Received webhook request", { rawBody });

      // const webhookHeaders = {
      //   "webhook-id": headersList.get("webhook-id") || "",
      //   "webhook-signature": headersList.get("webhook-signature") || "",
      //   "webhook-timestamp": headersList.get("webhook-timestamp") || "",
      // };

      // await webhook.verify(rawBody, webhookHeaders);
      // logger.info("Webhook verified successfully");

      const payload = JSON.parse(rawBody) as WebhookPayload;

      if (!payload.data?.customer?.email) {
        throw new Error("Missing customer email in payload");
      }

      const email = payload.data.customer.email;

      if (
        payload.data.payload_type === "Payment" &&
        payload.type === "payment.succeeded" &&
        !payload.data.subscription_id
      ) {
        // await handleOneTimePayment(email, payload);
        console.log("One-time payment succeeded for email:", email);
      }

      return Response.json(
        { message: "Webhook processed successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error("Webhook processing failed", error);
      return Response.json(
        {
          error: "Webhook processing failed",
          details: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 400 }
      );
    }
  },
});
