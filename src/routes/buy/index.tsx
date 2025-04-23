import {
  BillingAddress,
  BillingAddressForm,
} from "@/components/forms/billing-address-form";
import { HeroHeader } from "@/components/layout/landing/hero6-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getCreditPlansQueryOptions } from "@/lib/server/rpc/credits";
import { checkoutCreditPlanFn } from "@/lib/server/rpc/payments";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  getRouteApi,
  useNavigate,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check } from "lucide-react";
import React from "react";

export const Route = createFileRoute("/buy/")({
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

  const checkoutCreditBundleHandler = async (bundleId: string) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    console.log("billing", billing);

    const payment = await checkoutCreditPlan({
      data: {
        userId: user.id,
        name: user.name,
        email: user.email,
        creditPlanId: bundleId,
        billing,
      },
    });

    console.log("payment created", payment);

    navigate({ href: payment.payment_link ?? "/", reloadDocument: true });
  };

  const {
    data: creditBundles,
    isPending: creditBundlesQueryIsPending,
    isError: creditBundlesQueryIsError,
  } = useQuery(getCreditPlansQueryOptions);

  if (creditBundlesQueryIsPending) {
    return <div className="flex justify-center py-32">Loading bundles...</div>;
  }

  if (creditBundlesQueryIsError) {
    return (
      <div className="flex justify-center py-32 text-red-500">
        Sorry, we couldn't load the credit bundles. Please try again later.
      </div>
    );
  }

  return (
    <>
      <HeroHeader />

      <section className="py-16 md:py-32 pt-32 w-full bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <h1 className="text-center text-4xl font-bold lg:text-5xl">
              Credit Bundles for Your Study Needs
            </h1>
            <p className="text-lg">
              Pay only for what you need with our flexible credit system. Stock
              up during exam season and use whenever you want.{" "}
              <span className="font-medium">
                Made for students, by students.
              </span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <Badge
                variant="secondary"
                className="flex items-center gap-1 rounded-full"
              >
                <Check className="h-4 w-4" /> No subscription required
              </Badge>
              <Badge
                variant="secondary"
                className="flex items-center gap-1 rounded-full"
              >
                <Check className="h-4 w-4" /> Credits never expire
              </Badge>
            </div>
          </div>

          <div className="mt-8 md:mt-16 relative">
            {/* Mobile view: stacked cards */}
            <div className="flex flex-col gap-6 md:hidden">
              {creditBundles.map((bundle) => {
                const isPopular = bundle.isPrimary;

                return (
                  <div key={bundle.id} className="relative">
                    <Card
                      className={`rounded-xl ${isPopular ? "border-primary shadow-lg bg-gradient-to-br from-primary/10 to-primary/5 dark:from-zinc-900 dark:to-zinc-800" : ""}`}
                    >
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground rounded-full">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      <CardHeader
                        className={`space-y-1 pt-6 rounded-t-xl ${isPopular ? "dark:text-zinc-100" : ""}`}
                      >
                        <h2 className="font-semibold text-xl">{bundle.name}</h2>
                        <div className="flex items-baseline mt-2">
                          <span className="text-3xl font-bold">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(bundle.price / 100)}
                          </span>
                          <span
                            className={`ml-1 ${isPopular ? "dark:text-zinc-400" : "text-muted-foreground"}`}
                          >
                            one-time
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent
                        className={isPopular ? "dark:text-zinc-100" : ""}
                      >
                        <p className="text-lg">
                          <span
                            className={
                              isPopular
                                ? "text-primary font-bold dark:text-primary-foreground"
                                : "text-primary font-bold"
                            }
                          >
                            {bundle.credits}
                          </span>{" "}
                          Credits
                        </p>
                        <p
                          className={
                            isPopular
                              ? "text-muted-foreground text-sm dark:text-zinc-400"
                              : "text-muted-foreground text-sm"
                          }
                        >
                          {(bundle.price / bundle.credits / 100).toFixed(2)} per
                          credit
                        </p>
                      </CardContent>
                      <CardFooter className="pb-6">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant={isPopular ? "default" : "outline"}
                              className="w-full rounded-full"
                              size="lg"
                            >
                              {bundle.buttonText}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-xl sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Billing Information</DialogTitle>
                              <DialogDescription>
                                Please provide your billing address details to
                                proceed with checkout.
                              </DialogDescription>
                            </DialogHeader>
                            <BillingAddressForm
                              billing={billing}
                              onChange={setBilling}
                            />
                            <DialogFooter>
                              <Button
                                onClick={() =>
                                  checkoutCreditBundleHandler(bundle.id)
                                }
                                type="submit"
                                className="w-full"
                              >
                                Proceed to Checkout
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  </div>
                );
              })}
            </div>

            {/* Desktop view: overlapping cards */}
            <div className="hidden md:flex md:items-stretch">
              {creditBundles.map((bundle, index) => {
                const isPopular = bundle.isPrimary;
                const isFirst = index === 0;
                const isLast = index === creditBundles.length - 1;

                // For popular card (middle), keep all corners rounded
                const borderRadiusClasses = isPopular
                  ? "rounded-xl"
                  : isFirst
                    ? "rounded-l-xl rounded-r-none"
                    : isLast
                      ? "rounded-r-xl rounded-l-none"
                      : "rounded-none";

                // Dynamic positioning and z-index for the cards
                const positionClasses = isPopular
                  ? "z-10 scale-105 my-0"
                  : "z-0";

                return (
                  <div
                    key={bundle.id}
                    className={`relative flex-1 ${positionClasses}`}
                    style={{ margin: isPopular ? "-16px 0" : "0" }}
                  >
                    <Card
                      className={`h-full border ${borderRadiusClasses} ${
                        isPopular
                          ? "border-primary shadow-lg bg-gradient-to-br from-primary/10 to-primary/5 dark:from-zinc-900 dark:to-zinc-800"
                          : isFirst
                            ? "border-r-0"
                            : isLast
                              ? "border-l-0"
                              : ""
                      }`}
                    >
                      {isPopular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-primary text-primary-foreground rounded-full">
                            Most Popular
                          </Badge>
                        </div>
                      )}
                      <CardHeader
                        className={`space-y-1 pt-6 ${isPopular ? "dark:text-zinc-100" : ""}`}
                      >
                        <h2 className="font-semibold text-xl">{bundle.name}</h2>
                        <div className="flex items-baseline mt-2">
                          <span className="text-3xl font-bold">
                            {new Intl.NumberFormat("en-US", {
                              style: "currency",
                              currency: "USD",
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0,
                            }).format(bundle.price / 100)}
                          </span>
                          <span
                            className={`ml-1 ${isPopular ? "dark:text-zinc-400" : "text-muted-foreground"}`}
                          >
                            one-time
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent
                        className={isPopular ? "dark:text-zinc-100" : ""}
                      >
                        <p className="text-lg">
                          <span className={"text-primary font-bold"}>
                            {bundle.credits}
                          </span>{" "}
                          Credits
                        </p>
                        <p
                          className={
                            isPopular
                              ? "text-muted-foreground text-sm dark:text-zinc-400"
                              : "text-muted-foreground text-sm"
                          }
                        >
                          {(bundle.price / bundle.credits / 100).toFixed(2)} per
                          credit
                        </p>
                      </CardContent>
                      <CardFooter className="pb-6">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant={isPopular ? "default" : "outline"}
                              className="w-full rounded-full"
                              size="lg"
                            >
                              {bundle.buttonText}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-xl sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Billing Information</DialogTitle>
                              <DialogDescription>
                                Please provide your billing address details to
                                proceed with checkout.
                              </DialogDescription>
                            </DialogHeader>
                            <BillingAddressForm
                              billing={billing}
                              onChange={setBilling}
                            />
                            <DialogFooter>
                              <Button
                                onClick={() =>
                                  checkoutCreditBundleHandler(bundle.id)
                                }
                                type="submit"
                                className="w-full"
                              >
                                Proceed to Checkout
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-12 text-center max-w-xl mx-auto">
            <p className="text-sm text-muted-foreground mb-4">
              Credits never expire. Use them at your own pace.
            </p>
            <div className="bg-muted p-4 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-2">
              <span className="text-sm">
                Need more credits? Contact us for custom bundles at{" "}
              </span>
              <span className="font-medium">team.sophistai@gmail.com</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
