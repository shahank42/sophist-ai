"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";

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
import { getRouteApi, useRouter } from "@tanstack/react-router";
import { authClient } from "@/lib/utils/auth-client";
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { useServerFn } from "@tanstack/start";
import {
  createOrderFn,
  createSubscriptionFn,
  verifyOrderFn,
} from "@/lib/server/rpc/payments";
import { toast } from "sonner";
import { useCallback } from "react";

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

  if (!user) {
    return null;
  }

  const getRazorpayOrder = useServerFn(createOrderFn);
  const getRazorpaySubscription = useServerFn(createSubscriptionFn);
  const verifyRazorpayOrder = useServerFn(verifyOrderFn);

  const paymentSuccess = () => {
    toast("Payment Successful! Thanks for buying ^_^");
  };

  const paymentFailure = () => {
    toast("Payment Failed! Please try again.");
  };

  const { error, Razorpay } = useRazorpay();

  const handlePayment = useCallback(async () => {
    const { razorpaySubscription: subscriptionOrder, dbSubscription } =
      await getRazorpaySubscription({ data: { userId: user.id } });
    console.log(subscriptionOrder);

    const options = {
      key: process.env.RAZORPAY_API_KEY_ID as string,
      subscription_id: subscriptionOrder.id,
      plan_id: subscriptionOrder.plan_id,
      name: "SophistAI",
      description: "SophistAI Pro Subscription",
      // image: "/",
      prefill: {
        name: user.name,
        email: user.email,
      },
      handler: async function (response: any) {
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
      },
    };

    //@ts-ignore
    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();

    razorpayInstance.on("payment.failed", function (response) {
      paymentFailure();
    });
  }, [Razorpay]);

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
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
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
              <DropdownMenuItem onClick={handlePayment}>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/* <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem> */}
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
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
