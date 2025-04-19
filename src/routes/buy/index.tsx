import { HeroHeader } from "@/components/layout/landing/hero6-header";
import { Button } from "@/components/ui/button";
import { checkoutMonthFn } from "@/lib/server/rpc/payments";
import {
  createFileRoute,
  getRouteApi,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check } from "lucide-react";

export const Route = createFileRoute("/buy/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = getRouteApi("__root__").useRouteContext();
  const navigate = useNavigate();
  const checkoutMonth = useServerFn(checkoutMonthFn);

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
        billing: {
          city: "Delhi",
          country: "IN",
          state: "Delhi",
          street: "Connaught Place",
          zipcode: "110001",
        },
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
                  <h2 className="font-medium">Buy For a Week</h2>
                  <span className="my-3 block text-2xl font-semibold">
                    ₹200
                  </span>
                  <p className="text-muted-foreground text-sm">Per editor</p>
                </div>

                <Button asChild variant="outline" className="w-full">
                  <Link to="/">Get Started</Link>
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

                  <Button
                    onClick={() => checkoutMonthHandler()}
                    className="w-full"
                  >
                    Get Started
                  </Button>
                  {/* <Button asChild className="w-full">
                    <a
                      href={`https://test.checkout.dodopayments.com/buy/${"pdt_dIAbS43JcxN2JH8VG730t"}?quantity=1&redirect_url=${"localhost:3000"}%2Fstudy`}
                    >
                      Get Started
                    </a>
                  </Button> */}
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
