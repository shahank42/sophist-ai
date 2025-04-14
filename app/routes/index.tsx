import { HomeSidebar } from "@/components/layout/home-sidebar";
import { LandingSection } from "@/components/layout/landing-section";
import { MainSection } from "@/components/layout/main-section";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  queryUserSubjectsFn,
  queryUserSubjectsOptions,
} from "@/lib/server/rpc/subjects";
import { createFileRoute, getRouteApi } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  staleTime: 1000 * 60 * 5,

  loader: async ({ context }) => {
    if (context.user) {
      // const userSubjects = await queryUserSubjectsFn({
      //   data: { userId: context.user.id },
      // });
      const userSubjects = await context.queryClient.prefetchQuery(
        queryUserSubjectsOptions(context.user.id)
      );

      return { userSubjects };
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = getRouteApi("__root__").useRouteContext();
  // const { user } = Route.useLoaderData();

  return (
    <>
      {user ? <HomeSidebar user={user} /> : <></>}
      <SidebarInset>
        {user ? (
          <div className="py-3 px-3 flex w-full justify-between">
            <SidebarTrigger className="" />
            <ThemeToggle />
          </div>
        ) : (
          <></>
        )}

        <div className="w-full py-3">
          {user ? <MainSection /> : <LandingSection />}
        </div>
      </SidebarInset>
    </>
  );
}
