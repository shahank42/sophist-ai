import { GoogleIcon } from "@/components/icons/google";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/utils/auth-client";
import { getRouteApi, Link } from "@tanstack/react-router";

export const CTAButtons = () => {
  const { user } = getRouteApi("__root__").useRouteContext();

  return (
    <div className="flex flex-col flex-wrap items-center justify-center gap-2 md:flex-row">
      {!user ? (
        <div
          key={1}
          className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5"
        >
          <a
            // asChild
            // size="lg"
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "rounded-xl px-5 text-base cursor-pointer select-none"
            )}
            onClick={async () => {
              await authClient.signIn.social({
                provider: "google",
                callbackURL: "/study",
              });
            }}
          >
            {/* <Link to="/study"> */}
            <span className="flex items-center gap-2">
              <GoogleIcon className="size-6" /> Sign In
            </span>
            {/* </Link> */}
          </a>
        </div>
      ) : (
        <div
          key={1}
          className="bg-foreground/10 rounded-[calc(var(--radius-xl)+0.125rem)] border p-0.5"
        >
          <Button asChild size="lg" className={"rounded-xl px-5 text-base"}>
            <Link to="/study">
              <span className="text-nowrap">Get Started</span>
            </Link>
          </Button>
        </div>
      )}
      <Button
        key={2}
        asChild
        size="lg"
        variant="ghost"
        className="h-10.5 rounded-xl px-5"
      >
        <Link to="/buy">
          <span className="text-nowrap">View Pricing</span>
        </Link>
      </Button>
    </div>
  );
};
