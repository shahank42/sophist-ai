"use client";

import { ChevronsUpDown, LogOut, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { createSubscriptionFn, verifyOrderFn } from "@/lib/server/rpc/payments";
import { authClient } from "@/lib/utils/auth-client";
import { getRouteApi, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback } from "react";
import { useRazorpay } from "react-razorpay";
import { toast } from "sonner";
import Premium from "./icons/premium";

function UserAvatar({ username }: { username: string }) {
  return (
    <Avatar className="rounded-none h-8 w-8">
      <AvatarImage
        src={`https://api.dicebear.com/9.x/identicon/svg?seed=${username}`}
        alt={username}
      />
      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
    </Avatar>
  );
}

export function UserDetailsSelect() {
  const { isMobile } = useSidebar();
  const { user } = getRouteApi("__root__").useRouteContext();
  const router = useRouter();

  const getRazorpaySubscription = useServerFn(createSubscriptionFn);
  const verifyRazorpayOrder = useServerFn(verifyOrderFn);
  const { error: _error, Razorpay } = useRazorpay();

  const paymentSuccess = useCallback(() => {
    toast("Payment Successful! Thanks for buying ^_^");
  }, []);

  const paymentFailure = useCallback(() => {
    toast("Payment Failed! Please try again.");
  }, []);

  const handlePayment = useCallback(async () => {
    // Safety check inside the callback
    if (!user) return;

    const { razorpaySubscription: subscriptionOrder } =
      await getRazorpaySubscription({ data: { userId: user.id } });
    console.log(subscriptionOrder);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_API_KEY_ID as string,
      subscription_id: subscriptionOrder.id,
      plan_id: subscriptionOrder.plan_id,
      name: "SophistAI",
      description: "SophistAI Pro Subscription",
      // image: "/",
      prefill: {
        name: user.name,
        email: user.email,
      },
      handler: async function (response: {
        razorpay_subscription_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
        [key: string]: unknown;
      }) {
        const data = await verifyRazorpayOrder({
          data: {
            subscriptionId: response.razorpay_subscription_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          },
        });

        if (data.isOk) {
          paymentSuccess();
        } else {
          paymentFailure();
        }

        router.invalidate();
      },
    };

    // @ts-expect-error options type won't match
    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();

    razorpayInstance.on("payment.failed", function (_response) {
      paymentFailure();
    });
  }, [
    Razorpay,
    getRazorpaySubscription,
    verifyRazorpayOrder,
    user,
    router,
    paymentSuccess,
    paymentFailure,
  ]);

  // Now perform the conditional return after all hooks
  if (!user) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <UserAvatar username={user.name} />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UserAvatar username={user.name} />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {user.isPro ? (
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Premium className="text-blue-500 size-4" />
                  <span>SophistAI Pro</span>
                </DropdownMenuLabel>
              ) : (
                <DropdownMenuItem onClick={handlePayment}>
                  <Sparkles className="size-4 mr-2" />
                  Upgrade to Pro
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={async () => {
                await authClient.signOut();
                router.invalidate();
              }}
              // onClick={async () => await signOutFn()}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
