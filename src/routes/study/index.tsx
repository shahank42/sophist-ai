import { HomeSidebar } from "@/components/layout/home-sidebar";
import { MainSection } from "@/components/layout/main-section";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { queryUserSubjectsOptions } from "@/lib/server/rpc/subjects";
import { createFileRoute, getRouteApi, redirect } from "@tanstack/react-router";

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
          <div className="py-3 px-3 flex w-full justify-between z-100">
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

        <div
          aria-hidden
          className="absolute inset-0 isolate opacity-65 contain-strict block rounded-xl"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
      </SidebarInset>
    </>
  );
}
