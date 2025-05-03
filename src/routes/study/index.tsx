import { HomeSidebar } from "@/components/layout/home-sidebar";
import { MainSection } from "@/components/layout/main-section";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { getUserQueryOptions } from "../__root";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/study/")({
  beforeLoad: async ({ context: { user } }) => {
    if (!user) {
      throw redirect({
        to: "/",
      });
    }
  },

  // loader: ({ context }) => {
  //   if (!context.user) {
  //     throw redirect({
  //       to: "/",
  //     });
  //   }

  //   return { user: context.user };
  // },
  component: RouteComponent,
});

function RouteComponent() {
  // const { user } = getRouteApi("__root__").useRouteContext();
  // const { user } = Route.useLoaderData();
  const { data: user } = useSuspenseQuery(getUserQueryOptions)

  if (!user) {
    return <div>Error: User data is unavailable.</div>;
  }

  return (
    <>
      {user ? <HomeSidebar user={user} /> : <></>}
      <SidebarInset>
        {user ? (
          <div className="py-3 px-3 flex w-full justify-between">
            <SidebarTrigger className="z-20 cursor-pointer" />
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
          className="absolute inset-0 isolate opacity-65 contain-strict block md:rounded-xl"
        >
          <div className="w-140 h-320 -translate-y-87.5 absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
          <div className="h-320 absolute left-0 top-0 w-60 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
          <div className="h-320 -translate-y-87.5 absolute left-0 top-0 w-60 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
        </div>
      </SidebarInset>
    </>
  );
}
