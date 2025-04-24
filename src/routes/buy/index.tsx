import { BillingAddress } from "@/components/forms/billing-address-form";
import { HeroHeader } from "@/components/layout/landing/hero6-header";
import { PricingSection } from "@/components/pricing/pricing-section";
import { checkoutCreditPlanFn } from "@/lib/server/rpc/payments";
import { GeoApiResponse } from "@/lib/types/geo-types";
import {
  createFileRoute,
  getRouteApi,
  useNavigate,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { getHeader, getHeaders } from "@tanstack/react-start/server";
import geoip from "geoip-lite";
import React from "react";

export const fetchGeoData = async (): Promise<GeoApiResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_NETLIFY_EDGE_FUNCTION_URL}/geo`
  );

  if (!response.ok) {
    throw new Error(`Network response was not ok: ${response.statusText}`);
  }

  const data: GeoApiResponse = await response.json();
  return data;
};

// const getIpFromServerFn = createServerFn().handler(async () => {
//   const xForwardedForHeader = getHeader("X-Forwarded-For");
//   if (xForwardedForHeader)
//   return ipAddresses;
// });

export function getCountryCode(ip: string): string | null {
  const lookup = geoip.lookup(ip);
  return lookup?.country ?? null;
}
export const Route = createFileRoute("/buy/")({
  beforeLoad: async () => {
    console.log("HEADSS", getHeaders());
    const ipAds = getHeader("X-Forwarded-For");
    return { ipAds: ipAds === undefined ? null : ipAds };
  },

  loader: async ({ context: { ipAds } }) => {
    // if (!ipAds) return { userCountryCode: "" };
    // const userCountryCode = getCountryCode(ipAds.split(", ")[0]);
    // return { userCountryCode: userCountryCode ?? "" };
    return { ipAds };
  },

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
