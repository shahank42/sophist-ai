import { HeroHeader } from "@/components/layout/landing/hero6-header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { checkoutMonthFn } from "@/lib/server/rpc/payments";
import {
  createFileRoute,
  getRouteApi,
  Link,
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
  const checkoutMonth = useServerFn(checkoutMonthFn);

  const [billing, setBilling] = React.useState({
    city: "",
    country: "",
    state: "",
    street: "",
    zipcode: "",
  });

  const checkoutMonthHandler = async () => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    const payment = await checkoutMonth({
      data: {
        userId: user.id,
        name: user.name,
        email: user.email,
        billing,
      },
    });

    console.log("payment created", payment);

    navigate({ href: payment.payment_link ?? "/", reloadDocument: true });
  };

  return (
    <>
      <HeroHeader />

      <section className="py-16 md:py-32 w-full">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <h1 className="text-center text-4xl font-semibold lg:text-5xl">
              Prices as Per Your Needs
            </h1>
            <p>
              Screw subscriptions, only pay when you need it. Buy and use
              SophistAI during exam season. Made for students, by students.
            </p>
          </div>

          <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-5 md:gap-0">
            <div className="rounded-(--radius) flex flex-col justify-between space-y-8 border p-6 md:col-span-2 md:my-2 md:rounded-r-none md:border-r-0 lg:p-10">
              <div className="space-y-4">
                <div>
                  <h2 className="font-medium">SophistAI Basic</h2>
                  <span className="my-3 block text-2xl font-semibold">₹0</span>
                  <p className="text-muted-foreground text-sm">Per editor</p>
                </div>

                <Button asChild variant="outline" className="w-full">
                  <Link to="/study">Get Started</Link>
                </Button>

                <hr className="border-dashed" />

                <ul className="list-outside space-y-3 text-sm">
                  {[
                    "Basic Analytics Dashboard",
                    "5GB Cloud Storage",
                    "Email and Chat Support",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="size-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="dark:bg-muted rounded-(--radius) border p-6 shadow-lg shadow-gray-950/5 md:col-span-3 lg:p-10 dark:[--color-muted:var(--color-zinc-900)]">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h2 className="font-medium">Buy for a Month</h2>
                    <span className="my-3 block text-2xl font-semibold">
                      ₹500
                    </span>
                    <p className="text-muted-foreground text-sm">Per editor</p>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full">Buy Now!</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Billing Information</DialogTitle>
                        <DialogDescription>
                          Please provide your billing address details to proceed
                          with checkout.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-4">
                          <Input
                            id="street"
                            value={billing.street}
                            onChange={(e) =>
                              setBilling((prev) => ({
                                ...prev,
                                street: e.target.value,
                              }))
                            }
                            placeholder="Street Address"
                          />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Input
                            id="city"
                            value={billing.city}
                            onChange={(e) =>
                              setBilling((prev) => ({
                                ...prev,
                                city: e.target.value,
                              }))
                            }
                            placeholder="City"
                          />
                          <Input
                            id="zipcode"
                            value={billing.zipcode}
                            onChange={(e) =>
                              setBilling((prev) => ({
                                ...prev,
                                zipcode: e.target.value,
                              }))
                            }
                            placeholder="Postal Code"
                          />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <Input
                            id="state"
                            value={billing.state}
                            onChange={(e) =>
                              setBilling((prev) => ({
                                ...prev,
                                state: e.target.value,
                              }))
                            }
                            placeholder="State"
                          />
                          <Input
                            id="country"
                            value={billing.country}
                            onChange={(e) =>
                              setBilling((prev) => ({
                                ...prev,
                                country: e.target.value,
                              }))
                            }
                            placeholder="Country"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={checkoutMonthHandler} type="submit">
                          Proceed to Checkout
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>

                <div>
                  <div className="text-sm font-medium">
                    Everything in free plus :
                  </div>

                  <ul className="mt-4 list-outside space-y-3 text-sm">
                    {[
                      "Everything in Free Plan",
                      "5GB Cloud Storage",
                      "Email and Chat Support",
                      "Access to Community Forum",
                      "Single User Access",
                      "Access to Basic Templates",
                      "Mobile App Access",
                      "1 Custom Report Per Month",
                      "Monthly Product Updates",
                      "Standard Security Features",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="size-3" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
