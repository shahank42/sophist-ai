import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/utils/auth-client";
import { getRouteApi } from "@tanstack/react-router";
import { CoinsIcon } from "lucide-react";

import { getSubscriptionPlansQueryOptions } from "@/lib/server/rpc/subscriptions";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";

interface PricingCardProps {
  index: number;
  onCheckout: (bundleId: string, discountCode: string) => void;
}

export function PricingCard({ index }: PricingCardProps) {
  const { user } = getRouteApi("__root__").useRouteContext();
  const {
    data: subscriptionPlans,
    isPending,
    isError,
  } = useQuery(getSubscriptionPlansQueryOptions);

  // const { country } = getRouteApi("/buy/").useLoaderData();

  // const {
  //   data: creditBundles,
  //   isPending,
  //   isError,
  // } = useQuery(getCreditPlansQueryOptions);

  if (isPending) {
    return (
      <Card
        className={cn("h-[316px] border w-[280px]", {
          "rounded-xl h-[332px]": index === 1,
          "rounded-l-xl rounded-r-none": !(index === 1) && index === 0,
          "rounded-r-xl rounded-l-none": !(index === 1) && index === 2,
        })}
      >
        <CardHeader className="space-y-4 pt-3">
          <Skeleton className="h-6 w-32 mx-auto" />
          <div className="flex flex-col items-center mt-1">
            <Skeleton className="h-10 w-28" />
            <Skeleton className="h-4 w-24 mt-1" />
          </div>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Skeleton className="h-6 w-32" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-9 w-full rounded-full" />
        </CardFooter>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card
        className={cn("h-[316px] border", {
          "rounded-xl h-[332px]": index === 1,
          "rounded-l-xl rounded-r-none": !(index === 1) && index === 0,
          "rounded-r-xl rounded-l-none": !(index === 1) && index === 2,
        })}
      >
        <CardHeader className="space-y-1 pt-6">
          <h2 className="font-semibold text-xl text-red-500">
            Error loading plan
          </h2>
          <div className="flex items-baseline mt-2">
            <span className="text-3xl font-bold">N/A</span>
          </div>
        </CardHeader>
        <CardContent>
          <span className="flex gap-1 text-lg text-red-500">
            Unable to load credits
          </span>
        </CardContent>
        <CardFooter className="pb-6">
          <Button
            variant={index === 1 ? "default" : "outline"}
            className="w-full rounded-full"
            size="lg"
            disabled
          >
            Buy Now
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "h-[316px] border w-[280px]",
        {
          "rounded-xl h-[332px]": index === 1,
          "rounded-l-xl rounded-r-none": !(index === 1) && index === 0,
          "rounded-r-xl rounded-l-none": !(index === 1) && index === 2,
        },
        {
          "border-primary shadow-lg bg-gradient-to-br from-primary/10 to-primary/5 dark:from-zinc-900 dark:to-zinc-800":
            index === 1,
          "border-r-0": !(index === 1) && index === 0,
          "border-l-0": !(index === 1) && index === 2,
        }
      )}
    >
      {index === 1 && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground rounded-full text-sm">
            Most Popular
          </Badge>
        </div>
      )}
      <CardHeader
        className={cn("space-y-4 pt-3", {
          "dark:text-zinc-100": index === 1,
        })}
      >
        <h2 className="font-semibold text-lg text-center">
          {/* {country === "IN"
            ? creditBundles.creditPlansIndia[index].name
            : creditBundles.creditPlansUS[index].name} */}
          {subscriptionPlans && subscriptionPlans[index].name}
        </h2>
        <div className="flex flex-col items-center mt-1">
          <span className="text-4xl font-bold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency:
                (subscriptionPlans && subscriptionPlans[index].currency) ??
                "USD",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(
              ((subscriptionPlans && subscriptionPlans[index].price) ?? 0) / 100
            )}
            <div className="pricing-plan">
              <div
                className="price-container"
                data-pd-thousands-separator=","
                data-pd-decimal-places="2"
                data-pd-decimal-separator="."
                data-pd-original-price="99"
              >
                <span data-pd-price-formatted></span>
              </div>
            </div>
          </span>
          <span
            className={cn("ml-1 text-sm", {
              "dark:text-zinc-400": index === 1,
              "text-muted-foreground": !(index === 1),
            })}
          >
            monthly subscription
          </span>
        </div>
      </CardHeader>
      <CardContent
        className={cn("flex justify-center", {
          "dark:text-zinc-100": index === 1,
        })}
      >
        <span className="flex gap-1 text-lg items-center">
          <CoinsIcon className="h-4 w-4" />
          <span className="text-primary font-bold"></span>
          Credits
        </span>
      </CardContent>
      <CardFooter className="">
        {/* <a
          href={`https://checkout.dodopayments.com/buy/${
            country === "IN"
              ? creditBundles.creditPlansIndia[index].id.split(",")[0]
              : creditBundles.creditPlansUS[index].id.split(",")[0]
          }?quantity=1&redirect_url=${import.meta.env.VITE_NETLIFY_EDGE_FUNCTION_URL}%2Fstudy${country === "IN" ? "&country=IN" : ""}&discount=INDIA4LIFE`}
          className={cn(
            buttonVariants({
              variant: (index === 1) ? "default" : "outline",
            }),
            "w-full rounded-full text-sm cursor-pointer"
          )}
          // disabled={isError}
        >
          Buy Now
        </a> */}

        {!user ? (
          <Button
            variant={index === 1 ? "default" : "outline"}
            className="w-full rounded-full text-sm cursor-pointer"
            size="default"
            // disabled={isError}
            onClick={async () => {
              await authClient.signIn.social({
                provider: "google",
                callbackURL: "/buy",
              });
            }}
          >
            Buy Now
          </Button>
        ) : (
          // <Dialog>
          //   <DialogTrigger asChild>
          //     <Button
          //       variant={index === 1 ? "default" : "outline"}
          //       className="w-full rounded-full text-sm cursor-pointer"
          //       size="default"
          //       // disabled={isError}
          //     >
          //       Buy Now
          //     </Button>
          //   </DialogTrigger>
          //   <DialogContent className="rounded-xl sm:max-w-[425px]">
          //     <DialogHeader>
          //       <DialogTitle>Address Information</DialogTitle>
          //       <DialogDescription>
          //         Please provide your billing address details to proceed with
          //         checkout. We require this in order to verify the identities of
          //         each paying customer.
          //       </DialogDescription>
          //     </DialogHeader>
          //     <BillingAddressForm
          //       billing={billing}
          //       onChange={onBillingChange}
          //     />

          //     <DialogFooter>
          //       <Button
          //         type="submit"
          //         className="w-full cursor-pointer"
          //         onClick={() => {
          //           onCheckout("product_id", "");
          //         }}
          //       >
          //         Proceed to Checkout
          //       </Button>
          //     </DialogFooter>
          //   </DialogContent>
          // </Dialog>
          <Button
            variant={index === 1 ? "default" : "outline"}
            className="w-full rounded-full text-sm cursor-pointer"
            size="default"
            // disabled={isError}
          >
            Buy Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
