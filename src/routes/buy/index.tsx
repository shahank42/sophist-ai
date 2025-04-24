import { BillingAddress } from "@/components/forms/billing-address-form";
import { HeroHeader } from "@/components/layout/landing/hero6-header";
import { PricingSection } from "@/components/pricing/pricing-section";
import { fetchGeoData } from "@/hooks/use-country-code";
import { checkoutCreditPlanFn } from "@/lib/server/rpc/payments";
import {
  createFileRoute,
  getRouteApi,
  useNavigate,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import React from "react";

export const Route = createFileRoute("/buy/")({
  loader: async () => {
    const geoData = await fetchGeoData();

    return { userCountryCode: geoData.geo.country.code };
  },

  // loader: async ({}) => {

  // }

  component: RouteComponent,
});

function RouteComponent() {
  const { user } = getRouteApi("__root__").useRouteContext();
  const navigate = useNavigate();
  const checkoutCreditPlan = useServerFn(checkoutCreditPlanFn);

  const [billing, setBilling] = React.useState<BillingAddress>({
    city: "",
    country: "",
    state: "",
    street: "",
    zipcode: "",
  });

  const checkoutCreditBundleHandler = async (
    bundleId: string,
    discountCode: string
  ) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    const payment = await checkoutCreditPlan({
      data: {
        userId: user.id,
        name: user.name,
        email: user.email,
        creditPlanId: bundleId,
        billing,
        discountCode,
      },
    });

    navigate({ href: payment.payment_link ?? "/", reloadDocument: true });
  };

  return (
    <>
      <HeroHeader />
      <PricingSection
        billing={billing}
        onBillingChange={setBilling}
        onCheckout={checkoutCreditBundleHandler}
      />
    </>
  );
}
