import { dodopayments } from "@/lib/dodopayments";
import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { ProductListResponse } from "dodopayments/resources/index.mjs";

export const getSubscriptionPlansFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const subscriptionPlans = await dodopayments.products.list();
    return subscriptionPlans.items as ProductListResponse[];
  }
);

export type SubscriptionPlan = Pick<
  ProductListResponse,
  "product_id" | "name" | "description" | "price" | "currency"
>;

export const getSubscriptionPlansQueryOptions = queryOptions({
  queryKey: ["subscriptionPlans"],
  queryFn: () => getSubscriptionPlansFn(),
  select: (items) =>
    items
      .map((plan) => ({
        productId: plan.product_id,
        name: plan.name,
        description: plan.description,
        price: plan.price,
        currency: plan.currency,
      }))
      .reverse(),
});
