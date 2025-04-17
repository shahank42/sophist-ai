import { HomeSidebar } from "@/components/layout/home-sidebar";
import { MainSection } from "@/components/layout/main-section";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { queryUserSubjectsOptions } from "@/lib/server/rpc/subjects";
import { getRouteApi, redirect } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/study/")({
  staleTime: 1000 * 60 * 5,

  beforeLoad: async ({ context: { user } }) => {
    if (!user) {
      throw redirect({
        to: "/",
      });
    }
  },

  loader: async ({ context }) => {
    if (context.user) {
      // const userSubjects = await queryUserSubjectsFn({
      //   data: { userId: context.user.id },
      // });
      const userSubjects = await context.queryClient.prefetchQuery(
        queryUserSubjectsOptions(context.user.id)
      );

      return { user: context.user, userSubjects };
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = getRouteApi("__root__").useRouteContext();
  // const data = Route.useLoaderData();
  // const user = data?.user!;

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

        {/* <div className="w-full py-3">
          {user ? <MainSection /> : <LandingSection />}
        </div> */}

        <MainSection />
      </SidebarInset>
    </>
  );
}
