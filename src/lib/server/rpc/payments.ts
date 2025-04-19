import { dodopayments } from "@/lib/dodopayments";
import { createServerFn } from "@tanstack/react-start";
import { CountryCode } from "dodopayments/resources/misc.mjs";
import { z } from "zod";
import { setUserCustomerId } from "../queries/users";

export const checkoutMonthFn = createServerFn({ method: "POST" })
  .validator((data: unknown) =>
    z
      .object({
        userId: z.string(),
        name: z.string(),
        email: z.string().email(),
        billing: z.object({
          city: z.string(),
          country: z.string(),
          state: z.string(),
          street: z.string(),
          zipcode: z.string(),
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
