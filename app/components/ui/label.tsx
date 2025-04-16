"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

const Label = (
  {
    ref,
    className,
    ...props
  }: React.LabelHTMLAttributes<HTMLLabelElement> & {
    ref: React.RefObject<HTMLLabelElement>;
  }
) => (<label
  ref={ref}
  className={cn(
    "text-sm font-medium leading-4 text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
    className,
  )}
  {...props}
/>);
Label.displayName = "Label";

export { Label };
