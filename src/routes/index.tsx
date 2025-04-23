import { LandingSection } from "@/components/layout/landing/landing-section";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  // staleTime: 1000 * 60 * 5,

  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <LandingSection />
    </>
  );
}
