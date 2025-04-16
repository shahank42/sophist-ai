import { cn } from "@/lib/utils";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar({ sticky = false }: { sticky?: boolean }) {
  return (
    <nav
      className={cn(
        "z-100 h-14 w-full bg-background/80 text-foreground transition-all",
        {
          "sticky top-0": sticky,
        }
      )}
    >
      <MaxWidthWrapper>
        <div className="flex w-full items-center justify-end h-14 ">
          {/* <SidebarTrigger /> */}

          <ThemeToggle />
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}
