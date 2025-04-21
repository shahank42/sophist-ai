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
import { getUserProStatusFn } from "@/lib/server/rpc/users";
import { authClient } from "@/lib/utils/auth-client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
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
  const router = useRouter();
  const { user } = getRouteApi("__root__").useRouteContext();

  const getUserProStatus = useServerFn(getUserProStatusFn);
  const { data: userProStatus, isPending: userProStatusIsPending } =
    useSuspenseQuery({
      queryKey: ["userProStatus", user?.id],
      queryFn: () => getUserProStatus({ data: { userId: user?.id } }),
    });

  if (!user) {
    return null;
  }

  // Now perform the conditional return after all hooks
  if (!user) {
    return null;
  }

  console.log(user);

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
              {userProStatus.isPro ? (
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Premium className="text-blue-500 size-4" />
                  <span>SophistAI Pro</span>
                </DropdownMenuLabel>
              ) : (
                <DropdownMenuItem asChild>
                  <Link to="/buy">
                    <Sparkles className="size-4 mr-2" />
                    Upgrade to Pro
                  </Link>
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
