import { HomeSidebar } from "@/components/layout/home-sidebar";
import { MainSection } from "@/components/layout/main-section";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { queryUserSubjectsOptions } from "@/lib/server/rpc/subjects";
import { getUser } from "@/lib/server/rpc/users";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

const studySearchSchema = z.object({
  payment_id: z.string().optional().catch(""),
  status: z.string().optional().catch(""),
});

type StudySearch = z.infer<typeof studySearchSchema>;

export const Route = createFileRoute("/study/")({
  staleTime: 1000 * 60 * 5,

  validateSearch: (search) => studySearchSchema.parse(search),
  // loaderDeps: ({ search: { payment_id, status } }) => ({ payment_id, status }),
  // loaderDeps: () => ({
  //   // This value will be different every time the page loads
  //   refreshKey: window.performance.now(),
  // }),

  beforeLoad: async ({ context: { user } }) => {
    if (!user) {
      throw redirect({
        to: "/",
      });
    }
  },

  loader: async ({ context }) => {
    // if (context.user) {
    // const userSubjects = await queryUserSubjectsFn({
    //   data: { userId: context.user.id },
    // });
    const user = await getUser();
    if (!user) {
      throw redirect({
        to: "/",
      });
    }
    const userSubjects = await context.queryClient.prefetchQuery(
      queryUserSubjectsOptions(user.id)
    );

    console.log("user server", user);

    return { user, userSubjects };
    // }
  },
  component: RouteComponent,
});

function RouteComponent() {
  // const { user } = getRouteApi("__root__").useRouteContext();
  const data = Route.useLoaderData();
  const user = data?.user;
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
