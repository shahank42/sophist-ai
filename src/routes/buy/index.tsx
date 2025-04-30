import { Pricing } from "@/components/blocks/pricing";
import { BillingAddress } from "@/components/forms/billing-address-form";
import { HeroHeader } from "@/components/layout/landing/hero6-header";
import { checkoutCreditPlanFn } from "@/lib/server/rpc/payments";
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
  // beforeLoad: async () => {
  //   const ipAdds = await getIpFromServerFn();
  //   const req = await fetch(
  //     `https://api.ipinfo.io/lite/${ipAdds}?token=${import.meta.env.VITE_IPINFO_TOKEN}`
  //   );
  //   const res = await req.json();
  //   // const country = geoip.lookup(ipAdds)?.country ?? "";

  //   return { ipAdds, country: (res.country_code as string) ?? "" };
  // },

  // loader: ({ request }) => {},

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

  const demoPlans = [
    {
      name: "KILO",
      price: "7.99",
      yearlyPrice: "76.99",
      period: "per month",
      features: [
        "Up to 10 syllabus uploads",
        "10 topic expansions per syllabus",
      ],
      description: "Perfect for individuals and small projects",
      buttonText: "Buy Now",
      href: "https://test.checkout.dodopayments.com/buy/pdt_4tBCOyYd6sNfVFlqred1L?quantity=1",
      isPopular: false,
    },
    {
      name: "MEGA",
      price: "9.99",
      yearlyPrice: "95.99",
      period: "per month",
      features: [
        "Up to 30 syllabus uploads",
        "30 topic expansions per syllabus",
        "Share mind maps",
      ],
      description: "Ideal for growing teams and businesses",
      buttonText: "Buy Now",
      href: "https://test.checkout.dodopayments.com/buy/pdt_ftbL6v20XXyArsERxbWd1?quantity=1",
      isPopular: true,
    },
    {
      name: "GIGA",
      price: "15.99",
      yearlyPrice: "153.99",
      period: "per month",
      features: [
        "Unlimited syllabus uploads",
        "Unlimited topic expansions",
        "Share mind maps",
      ],
      description: "For large organizations with specific needs",
      buttonText: "Buy Now",
      href: "https://test.checkout.dodopayments.com/buy/pdt_mhDCvoLXp6UNcRQU4ycZ6?quantity=1",
      isPopular: false,
    },
  ];

  return (
    <>
      <HeroHeader />
      {/* <PricingSection
        billing={billing}
        onBillingChange={setBilling}
        onCheckout={checkoutCreditBundleHandler}
      /> */}
      <Pricing
        plans={demoPlans}
        title="Simple, Transparent Pricing"
        description="Choose the plan that works for you\nAll plans include access to our platform, lead generation tools, and dedicated support."
      />
    </>
  );
}
