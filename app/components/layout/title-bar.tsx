import MaxWidthWrapper from "@/components/max-width-wrapper";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarTrigger } from "../ui/sidebar";

export default function TitleBar() {
  return (
    <nav className="z-[100] h-14 w-full bg-background/80 text-foreground transition-all">
      <MaxWidthWrapper>
        <div className="flex h-14 items-center justify-between">
          <div className="flex gap-4 items-center justify-between">
            <SidebarTrigger />
            The title goes here
          </div>
          <ThemeToggle />
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}
