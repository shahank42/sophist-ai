import { LandingSection } from "@/components/layout/landing/landing-section";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <>
      <LandingSection />
    </>
  );
}
