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
import { Skeleton } from "@/components/ui/skeleton";
import { getCreditPlansQueryOptions } from "@/lib/server/rpc/credits";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getRouteApi } from "@tanstack/react-router";
import { CoinsIcon } from "lucide-react";
import {
  BillingAddress,
  BillingAddressForm,
} from "../forms/billing-address-form";

interface PricingCardProps {
  index: number;
  isPopular?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  className?: string;
  billing: BillingAddress;
  onBillingChange: (billing: BillingAddress) => void;
  onCheckout: (bundleId: string, discountCode: string) => void;
}

export function PricingCard({
  index,
  isPopular,
  isFirst,
  isLast,
  className,
  billing,
  onBillingChange,
  onCheckout,
}: PricingCardProps) {
  // const { countryCode, isLoading, isError, error } = useCountryCode();
  const { userCountryCode } = getRouteApi("/buy/").useLoaderData();
  console.log("user country code", userCountryCode);

  const {
    data: creditBundles,
    isPending,
    isError,
  } = useQuery(getCreditPlansQueryOptions);

  if (isPending) {
    return (
      <Card
        className={cn(
          "h-[316px] border w-[280px]",
          {
            "rounded-xl h-[332px]": isPopular,
            "rounded-l-xl rounded-r-none": !isPopular && isFirst,
            "rounded-r-xl rounded-l-none": !isPopular && isLast,
          },
          className
        )}
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
        className={cn(
          "h-[316px] border",
          {
            "rounded-xl h-[332px]": isPopular,
            "rounded-l-xl rounded-r-none": !isPopular && isFirst,
            "rounded-r-xl rounded-l-none": !isPopular && isLast,
          },
          className
        )}
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
            variant={isPopular ? "default" : "outline"}
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
          "rounded-xl h-[332px]": isPopular,
          "rounded-l-xl rounded-r-none": !isPopular && isFirst,
          "rounded-r-xl rounded-l-none": !isPopular && isLast,
        },
        {
          "border-primary shadow-lg bg-gradient-to-br from-primary/10 to-primary/5 dark:from-zinc-900 dark:to-zinc-800":
            isPopular,
          "border-r-0": !isPopular && isFirst,
          "border-l-0": !isPopular && isLast,
        },
        className
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground rounded-full text-sm">
            Most Popular
          </Badge>
        </div>
      )}
      <CardHeader
        className={cn("space-y-4 pt-3", {
          "dark:text-zinc-100": isPopular,
        })}
      >
        <h2 className="font-semibold text-lg text-center">
          {creditBundles[index].name}
        </h2>
        <div className="flex flex-col items-center mt-1">
          <span className="text-4xl font-bold">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(creditBundles[index].price / 100)}
          </span>
          <span
            className={cn("ml-1 text-sm", {
              "dark:text-zinc-400": isPopular,
              "text-muted-foreground": !isPopular,
            })}
          >
            one-time purchase
          </span>
        </div>
      </CardHeader>
      <CardContent
        className={cn("flex justify-center", {
          "dark:text-zinc-100": isPopular,
        })}
      >
        <span className="flex gap-1 text-lg items-center">
          <CoinsIcon className="h-4 w-4" />
          <span className="text-primary font-bold">
            {creditBundles[index].credits}
          </span>
          Credits
        </span>
      </CardContent>
      <CardFooter className="">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant={isPopular ? "default" : "outline"}
              className="w-full rounded-full text-sm cursor-pointer"
              size="default"
              disabled={isError}
            >
              Buy Now
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-xl sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Address Information</DialogTitle>
              <DialogDescription>
                Please provide your billing address details to proceed with
                checkout. We require this in order to verify the identities of
                each paying customer.
              </DialogDescription>
            </DialogHeader>
            <BillingAddressForm billing={billing} onChange={onBillingChange} />
            {userCountryCode === "IN" && (
              <div className="flex items-center p-3 mt-2 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex-1 gap-1">
                  <p className="text-sm font-medium">
                    Regional Discount Applied!
                  </p>
                  <p className="text-xs text-muted-foreground">
                    A local pricing discount for India has been automatically
                    applied to your purchase.
                  </p>
                </div>
                {/* <Badge variant="outline" className="bg-primary/10 text-primary">
                  India
                </Badge> */}
              </div>
            )}
            <DialogFooter>
              <Button
                type="submit"
                className="w-full cursor-pointer"
                onClick={() => {
                  onCheckout(
                    creditBundles[index].id,
                    userCountryCode === "IN" ? "INDIA4LIFE" : "NODISC"
                  );
                }}
              >
                Proceed to Checkout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
