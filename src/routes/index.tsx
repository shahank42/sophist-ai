import { LandingSection } from "@/components/layout/landing/landing-section";
import {
  queryUserSubjectsOptions,
} from "@/lib/server/rpc/subjects";
import { createFileRoute } from "@tanstack/react-router";

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
  return (
    <>
      <LandingSection />
    </>
  );
}
