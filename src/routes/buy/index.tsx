import { BillingAddress } from "@/components/forms/billing-address-form";
import { HeroHeader } from "@/components/layout/landing/hero6-header";
import { PricingSection } from "@/components/pricing/pricing-section";
import {
  checkoutCreditPlanFn,
  getIpFromServerFn,
} from "@/lib/server/rpc/payments";
import { GeoApiResponse } from "@/lib/types/geo-types";
import {
  createFileRoute,
  getRouteApi,
  useNavigate,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
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

// const getIpFromServerFn = createServerFn({ method: "GET" }).handler(
//   async () => {
//     const request = getWebRequest();
//     console.log("WEBREQ", request);
//     const xForwardedForHeader = request?.headers.get("X-Forwarded-For");
//     return xForwardedForHeader ?? "";
//   }
// );

// export function getCountryCode(ip: string): string | null {
//   const lookup = geoip.lookup(ip);
//   return lookup?.country ?? null;
// }
export const Route = createFileRoute("/buy/")({
  beforeLoad: async () => {
    const ipAdds = await getIpFromServerFn();
    const req = await fetch(
      `https://api.ipinfo.io/lite/${ipAdds}token=${import.meta.env.VITE_IPINFO_TOKEN}`
    );
    const res = await req.json();
    // const country = geoip.lookup(ipAdds)?.country ?? "";

    return { ipAdds, country: (res.country_code as string) ?? "" };
  },

  // loader: ({ request }) => {},

  loader: async ({ context: { ipAdds, country } }) => {
    return { ipAdds, country };
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
