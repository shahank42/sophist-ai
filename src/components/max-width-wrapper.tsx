import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function MaxWidthWrapper({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto h-full w-full p-6 md:px-32", className)}>
      {children}
    </div>
  );
}
