import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  Folder,
  Frame,
  LifeBuoy,
  Map,
  MoreHorizontal,
  PieChart,
  RefreshCcw,
  Send,
  Settings2,
  Share,
  SquareTerminal,
  Trash2,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { getRouteApi, Link, useRouter } from "@tanstack/react-router";
import { UserDetailsSelect } from "../user-details-select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  deleteSubjectFn,
  queryUserSubjectsOptions,
} from "@/lib/server/rpc/subjects";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Session } from "@/lib/utils/auth-client";

export function HomeSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: Session["user"];
}) {
  const { isMobile } = useSidebar();
  const loaderData = getRouteApi("/").useLoaderData();
  const {
    data: userSubjects,
    isPending,
    isError,
  } = useQuery(queryUserSubjectsOptions(user.id));
  const router = useRouter();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="flex flex-row items-center justify-between h-16">
        <Link to="/" className="relative w-full z-20">
          <img src="/logo.svg" alt="SophistAI" className="h-8 w-auto mx-auto" />
        </Link>

        {/* <SidebarTrigger /> */}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden px-1">
          <SidebarGroupLabel>Recent Subjects</SidebarGroupLabel>
          <SidebarMenu>
            {isPending ? (
              Array.from({ length: 10 }).map((_, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuSkeleton className="" />
                </SidebarMenuItem>
              ))
            ) : isError ? (
              <>error loading user subjects</>
            ) : (
              userSubjects.map((subject) => (
                <SidebarMenuItem key={subject.name}>
                  <SidebarMenuButton asChild>
                    <Link
                      to="/app/$subjectId"
                      params={{ subjectId: subject.id }}
                    >
                      <span className="text-sm">{subject.name}</span>
                    </Link>
                  </SidebarMenuButton>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <SidebarMenuAction showOnHover>
                        <MoreHorizontal />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-48"
                      side={isMobile ? "bottom" : "right"}
                      align={isMobile ? "end" : "start"}
                    >
                      <DropdownMenuItem>
                        <RefreshCcw className="text-muted-foreground" />
                        <span>Regenerate Subject</span>
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem>
                      <Share className="text-muted-foreground" />
                      <span>Share Project</span>
                    </DropdownMenuItem> */}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={async () => {
                          await deleteSubjectFn({ data: { id: subject.id } });
                          router.invalidate();
                        }}
                      >
                        <Trash2 className="text-muted-foreground" />
                        <span>Delete Subject</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </SidebarMenuItem>
              ))
            )}
            {/* <SidebarMenuItem>
              <SidebarMenuButton>
                <MoreHorizontal />
                <span>More</span>
              </SidebarMenuButton>
            </SidebarMenuItem> */}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <UserDetailsSelect />
      </SidebarFooter>
    </Sidebar>
  );
}
