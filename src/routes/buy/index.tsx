import { BillingAddress } from "@/components/forms/billing-address-form";
import { HeroHeader } from "@/components/layout/landing/hero6-header";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import {
  PricingCard,
  PricingTable,
  Product,
} from "@/components/pricing/pricing-table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { checkoutCreditPlanFn } from "@/lib/server/rpc/payments";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  getRouteApi,
  useNavigate,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertCircle } from "lucide-react";
import React from "react";
import { getUserQueryOptions } from "../__root";

export const products: Product[] = [
  {
    id: "free-tier",
    name: "Free Tier",
    description: "Perfect for individuals and small projects",
    buttonText: "You're Here",
    buttonUrl: "#",
    price: {
      primaryText: "$0",
      secondaryText: "per month",
    },
    priceAnnual: {
      primaryText: "$0",
      secondaryText: "per year",
    },
    items: [
      {
        primaryText: "Up to 10 syllabus uploads",
      },
      {
        primaryText: "10 topic expansions per syllabus",
      },
    ],
  },
  {
    id: "mega-tier",
    name: "Mega Tier",
    description: "Ideal for growing teams and businesses",
    buttonText: "You already have this",
    buttonUrl: "#",
    recommendedText: "Popular",
    price: {
      primaryText: "$0",
      secondaryText: "per month",
    },
    priceAnnual: {
      primaryText: "$0",
      secondaryText: "per year",
    },
    items: [
      {
        primaryText: "Up to 30 syllabus uploads",
      },
      {
        primaryText: "30 topic expansions per syllabus",
      },
      {
        primaryText: "Share mind maps",
      },
    ],
  },
  {
    id: "giga-tier",
    name: "Giga Tier",
    description: "For large organizations with specific needs",
    buttonText: "And this too!",
    buttonUrl: "#",
    price: {
      primaryText: "$0",
      secondaryText: "per month",
    },
    priceAnnual: {
      primaryText: "$0",
      secondaryText: "per year",
    },
    items: [
      {
        primaryText: "Unlimited syllabus uploads",
      },
      {
        primaryText: "Unlimited topic expansions",
      },
      {
        primaryText: "Share mind maps",
      },
    ],
  },
];


export const Route = createFileRoute("/buy/")({
  // loader: ({ context }) => {
  //     return { user: context.user };
  //   },

  component: RouteComponent,
});

function RouteComponent() {
  // const { user } = Route.useLoaderData();
  const { data: user } = useSuspenseQuery(getUserQueryOptions)


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
    <div className="flex flex-col w-full">
      <HeroHeader />
      <div className="flex flex-col items-center justify-center py-20 w-full">
        <MaxWidthWrapper className="flex flex-col gap-10 w-full items-center">
          <Alert variant="default" className="max-w-5xl">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Limited Time:</AlertTitle>
            <AlertDescription className="text-sm font-medium">
              All premium features now available for free!
            </AlertDescription>
          </Alert>

          <div className="flex flex-col gap-4">
            <h2 className="text-4xl text-center font-bold tracking-tight sm:text-5xl pt-5 md:pt-10">
              Unlock Your Academic Potential
            </h2>
            <p className="text-muted-foreground text-center text-lg whitespace-pre-line py-2">
              Student-friendly pricing that fits your budget. Use SophistAI to
              transform your learning experience without breaking the bank.
            </p>
          </div>

          <div className="flex w-full justify-center max-w-7xl">
            <PricingTable products={products} showFeatures={false}>
              <PricingCard
                productId="free-tier"
                buttonProps={{
                  disabled: true,
                }}
              />
              <PricingCard
                productId="mega-tier"
                buttonProps={{
                  disabled: true,
                }}
              />
              <PricingCard
                productId="giga-tier"
                buttonProps={{
                  disabled: true,
                }}
              />
            </PricingTable>
          </div>
        </MaxWidthWrapper>
      </div>
    </div>
  );
}
