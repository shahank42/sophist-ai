import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getCreditPlans } from "../queries/credits";

export const getCreditPlansFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const creditPlans = await getCreditPlans();
    return creditPlans;
  }
);

export const getCreditPlansQueryOptions = queryOptions({
  queryKey: ["creditPlans"],
  queryFn: () => getCreditPlansFn(),
});
