"use client";

import { ChevronsUpDown, LogOut, NotebookPen } from "lucide-react";

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
import { authClient } from "@/lib/utils/auth-client";
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, useRouter } from "@tanstack/react-router";
import { User } from "better-auth";
import { getUserQueryOptions } from "@/routes/__root";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import FeedbackForm from "./forms/feedback-form";
import { useState } from "react";

function UserAvatar({ user }: { user: User }) {
  return (
    <Avatar className="rounded-full h-8 w-8">
      {user.image ? (
        <AvatarImage src={user.image} alt={user.name} />
      ) : (
        <AvatarImage
          src={`https://api.dicebear.com/9.x/identicon/svg?seed=${user.name}`}
          alt={user.name}
        />
      )}
      <AvatarFallback className="rounded-lg">CN</AvatarFallback>
    </Avatar>
  );
}

export function UserDetailsSelect() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  // const { user } = getRouteApi("__root__").useRouteContext();
  const { data: user } = useSuspenseQuery(getUserQueryOptions);
  const queryClient = useQueryClient();

  const [openFeedbackDialog, setOpenFeedbackDialog] = useState(false);


  // const { data: userCredits } = useQuery(getUserCreditsQueryOptions(user!.id));

  if (!user) {
    return null;
  }

  return (
    <SidebarMenu>
      <Dialog open={openFeedbackDialog} onOpenChange={setOpenFeedbackDialog}>

        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
              >
                <UserAvatar user={user} />
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
                  <UserAvatar user={user} />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {/* {userSubscription.isPro ? ( */}
                {/* <DropdownMenuLabel className="flex items-center gap-2">
                <Premium className="text-blue-500 size-4" />
                <span>Credits: {user.credits}</span>
              </DropdownMenuLabel> */}
                {/* ) : ( */}


                <DialogTrigger asChild>
                  <DropdownMenuItem>
                    <NotebookPen /> Feedback
                  </DropdownMenuItem>
                </DialogTrigger>


              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={async () => {
                  await authClient.signOut();
                  await queryClient.invalidateQueries({ queryKey: ["user"] });
                  await router.navigate({ to: "/" });
                }}
              // onClick={async () => await signOutFn()}
              >
                <LogOut />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>

        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Share Your Feedback</DialogTitle>
            <DialogDescription className="text-sm">
              Your feedback helps us build a better study experience for everyone. Spotted a bug? Have a great idea? Tell us everything here!
            </DialogDescription>
          </DialogHeader>
          <FeedbackForm setOpenFeedbackDialog={setOpenFeedbackDialog} />
        </DialogContent>
      </Dialog>
    </SidebarMenu>
  );
}
