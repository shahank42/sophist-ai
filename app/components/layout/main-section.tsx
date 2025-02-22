import { getRouteApi, Link } from "@tanstack/react-router";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ExploreSyllabusForm from "../forms/explore-syllabus-form";
import MaxWidthWrapper from "../max-width-wrapper";
import { RetroGrid } from "../retro-grid";

export function MainSection({ userId }: { userId: string }) {
  return (
    <div className="w-full relative flex h-[calc(100dvh-48px-24px-52px)] flex-col items-center justify-center overflow-hidden sm:p-8 lg:p-16 bg-background">
      <div className="relative z-10 w-full max-w-4xl space-y-12">
        <MaxWidthWrapper className="space-y-8 text-center">
          <ExploreSyllabusForm userId={userId} />
        </MaxWidthWrapper>
      </div>

      {/* <RetroGrid /> */}
    </div>
  );
}
