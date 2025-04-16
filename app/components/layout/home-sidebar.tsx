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
import { useQuery, useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { Session } from "@/lib/utils/auth-client";
import { useTheme } from "../providers/theme-provider";
import { MatchRoute } from "@tanstack/react-router";
import { Route as appRoute } from "@/routes/study/$subjectId";
import { toast } from "sonner";

function Spinner({ show, wait }: { show?: boolean; wait?: `delay-${number}` }) {
  return (
    <div
      className={`animate-spin px-3 transition ${
        (show ?? true)
          ? `opacity-1 duration-500 ${wait ?? "delay-300"}`
          : "duration-500 opacity-0 delay-0"
      }`}
    >
      ⍥
    </div>
  );
}

export function HomeSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  user: Session["user"];
}) {
  const { isMobile } = useSidebar();
  // const loaderData = getRouteApi("/study").useLoaderData();
  const {
    data: userSubjects,
    isPending,
    isError,
    refetch,
  } = useSuspenseQuery(queryUserSubjectsOptions(user.id));
  // const router = useRouter();
  const { setOpenMobile } = useSidebar();

  // Add mutation for deleting subject
  const {
    mutate: deleteSubject,
    status: deleteStatus,
    variables: deletingVars,
  } = useMutation({
    mutationFn: ({ id }: { id: string }) => deleteSubjectFn({ data: { id } }),
    onSuccess: () => {
      toast.error("Subject deleted!");
      refetch();
    },
  });

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="flex flex-row items-center justify-between h-16">
        <Link
          to="/"
          onClick={() => setOpenMobile(false)}
          className="relative w-full z-20"
        >
          <img
            src="/logo-lightmode.svg"
            alt="SophistAI"
            className="dark:hidden h-8 w-auto mx-auto"
          />
          <img
            src="/logo-darkmode.svg"
            alt="SophistAI"
            className="hidden dark:block h-8 w-auto mx-auto"
          />
          {/* <MatchRoute to={"/"} pending>
            {(match) => {
              return <Spinner show={!!match} wait="delay-0" />;
            }}
          </MatchRoute> */}
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
                      to="/study/$subjectId"
                      onClick={() => setOpenMobile(false)}
                      params={{ subjectId: subject.id }}
                    >
                      <span className="text-sm">{subject.name}</span>
                      {/* <MatchRoute to={appRoute.to} pending>
                        {(match) => {
                          return <Spinner show={!!match} wait="delay-0" />;
                        }}
                      </MatchRoute> */}
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
                        onClick={() => deleteSubject({ id: subject.id })}
                        disabled={
                          deleteStatus === "pending" &&
                          deletingVars?.id === subject.id
                        }
                      >
                        {deleteStatus === "pending" &&
                        deletingVars?.id === subject.id ? (
                          <Spinner show />
                        ) : (
                          <Trash2 className="text-muted-foreground" />
                        )}
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
