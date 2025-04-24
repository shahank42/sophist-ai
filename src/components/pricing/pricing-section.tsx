import { AtSign, CreditCard, QrCode } from "lucide-react";
import { BillingAddress } from "../forms/billing-address-form";
import { Badge } from "../ui/badge";
import { PricingCard } from "./pricing-card";

interface PricingSectionProps {
  billing: BillingAddress;
  onBillingChange: (billing: BillingAddress) => void;
  onCheckout: (bundleId: string, discountCode: string) => void;
}

export function PricingSection({
  billing,
  onBillingChange,
  onCheckout,
}: PricingSectionProps) {
  return (
    <section className="py-16 md:py-32 pt-32 w-full bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-center text-4xl font-bold lg:text-5xl">
            Buy Credit Bundles
          </h1>
          <p className="text-lg">
            Pay only for what you need with our flexible credit system. Stock up
            when you have the money and use them up during exam season.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Badge
              variant="secondary"
              className="flex items-center gap-1 rounded-full"
            >
              <CreditCard className="h-4 w-4" /> Card
            </Badge>
            <Badge
              variant="secondary"
              className="flex items-center gap-1 rounded-full"
            >
              <QrCode className="h-4 w-4" /> UPI QR
            </Badge>
            <Badge
              variant="secondary"
              className="flex items-center gap-1 rounded-full"
            >
              <AtSign className="h-4 w-4" /> UPI ID
            </Badge>
          </div>
        </div>

        <div className="mt-8 md:mt-16 relative">
          {/* Mobile view */}
          <div className="flex flex-col items-center gap-8 md:hidden">
            {[0, 1, 2].map((num) => (
              <div key={num} className="relative w-[280px]">
                <PricingCard
                  index={num}
                  isPopular={num === 1}
                  billing={billing}
                  onBillingChange={onBillingChange}
                  onCheckout={onCheckout}
                />
              </div>
            ))}
          </div>

          {/* Desktop view */}
          <div className="hidden md:flex md:items-stretch md:justify-center gap-0">
            {[0, 1, 2].map((num) => (
              <div
                key={num}
                className={`relative ${
                  num === 1 ? "z-10 scale-[1.02] my-0" : "z-0"
                }`}
                style={{ margin: num === 1 ? "-8px 0" : "0" }}
              >
                <PricingCard
                  index={num}
                  isFirst={num === 0}
                  isPopular={num === 1}
                  isLast={num === 2}
                  billing={billing}
                  onBillingChange={onBillingChange}
                  onCheckout={onCheckout}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center max-w-xl mx-auto">
          <p className="text-sm text-muted-foreground mb-4">
            Credits never expire. Use them at your own pace.
          </p>
          <div className="bg-muted p-4 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1">
            <span className="text-sm">
              Need more credits? Contact us for custom bundles at
            </span>
            <a href="mailto:team.sophistai@gmail.com" className="font-medium">
              team.sophistai@gmail.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
