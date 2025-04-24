import { dodopayments } from "@/lib/dodopayments";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { Country, State } from "country-state-city";
import { CountryCode } from "dodopayments/resources/misc.mjs";
import requestIp from "request-ip";
import { z } from "zod";
import { getSubscription } from "../queries/payments";
import { setUserCustomerId } from "../queries/users";

const billingSchema = z.object({
  city: z.string().min(1, "City is required"),
  country: z
    .string()
    .refine(
      (countryCode) =>
        Country.getAllCountries().some((c) => c.isoCode === countryCode),
      "Invalid country code"
    ),
  state: z.string(),
  street: z.string().min(1, "Street address is required"),
  zipcode: z.string().min(1, "Postal code is required"),
});

export const checkoutCreditPlanFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        userId: z.string(),
        name: z.string(),
        email: z.string().email(),
        creditPlanId: z.string(),
        discountCode: z.string(),
        billing: billingSchema.superRefine((data, ctx) => {
          const states = State.getStatesOfCountry(data.country);
          if (
            states.length > 0 &&
            !states.some((s) => s.isoCode === data.state)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Invalid state for selected country ${data.country}`,
              path: ["state"],
            });
          }
        }),
      })
      .parse(data)
  )
  .handler(
    async ({
      data: { userId, name, email, creditPlanId, billing, discountCode },
    }) => {
      console.log("DISCOUNT: ", discountCode);

      const payment = await dodopayments.payments.create({
        billing: {
          city: billing.city,
          country: billing.country as CountryCode,
          state: billing.state,
          street: billing.street,
          zipcode: billing.zipcode,
        },
        customer: { create_new_customer: true, email, name },
        product_cart: [{ product_id: creditPlanId, quantity: 1 }],
        payment_link: true,
        return_url: `${process.env.BETTER_AUTH_URL}/study`,
        discount_code: discountCode || "",
      });

      await setUserCustomerId(userId, payment.customer.customer_id);

      return payment;
    }
  );

export const checkoutMonthFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        userId: z.string(),
        name: z.string(),
        email: z.string().email(),
        billing: billingSchema.superRefine((data, ctx) => {
          const states = State.getStatesOfCountry(data.country);
          if (
            states.length > 0 &&
            !states.some((s) => s.isoCode === data.state)
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Invalid state for selected country ${data.country}`,
              path: ["state"],
            });
          }
        }),
      })
      .parse(data)
  )
  .handler(async ({ data: { userId, name, email, billing } }) => {
    const payment = await dodopayments.payments.create({
      billing: {
        city: billing.city,
        country: billing.country as CountryCode,
        state: billing.state,
        street: billing.street,
        zipcode: billing.zipcode,
      },
      customer: { create_new_customer: true, email, name },
      product_cart: [{ product_id: "pdt_dIAbS43JcxN2JH8VG730t", quantity: 1 }],
      payment_link: true,
      return_url: `${process.env.BETTER_AUTH_URL}/study`,
    });

    await setUserCustomerId(userId, payment.customer.customer_id);

    return payment;
  });

export const getUserSubscriptionFn = createServerFn({ method: "GET" })
  .validator((data: unknown) =>
    z
      .object({
        userId: z.string(),
      })
      .parse(data)
  )
  .handler(async ({ data: { userId } }) => {
    const subscription = await getSubscription(userId);
    return {
      ...subscription,
    };
  });

export const queryUserSubscriptionOptions = (userId: string) =>
  queryOptions({
    queryKey: ["userProStatus", userId],
    queryFn: () => getUserSubscriptionFn({ data: { userId } }),
  });

export const getIpFromServerFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getWebRequest();
    if (request === undefined) return "none";
    const clientIp = requestIp.getClientIp({
      headers: Object.fromEntries(request.headers.entries()),
      connection: { remoteAddress: "" },
      socket: { remoteAddress: "" },
    });
    console.log("CLIENTIP", clientIp);
    // const xForwardedForHeader = request?.headers.get("X-Forwarded-For");
    return clientIp ?? "none";
  }
);
