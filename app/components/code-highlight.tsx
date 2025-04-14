import { cn } from "@/lib/utils";
import type { JSX, ReactNode } from "react";
import ShikiHighlighter, { Element, isInlineCode } from "react-shiki";

interface CodeHighlightProps {
  className?: string | undefined;
  children?: ReactNode | undefined;
  node?: Element | undefined;
}

export const CodeHighlight = ({
  className,
  children,
  node,
  ...props
}: CodeHighlightProps): JSX.Element => {
  const match = className?.match(/language-(\w+)/);
  const language = match ? match[1] : undefined;

  const isInline: boolean | undefined = node ? isInlineCode(node) : undefined;

  return !isInline ? (
    <div className="w-20">
      <ShikiHighlighter
        language={language}
        theme={"ayu-dark"}
        className="w-1/2"
        {...props}
      >
        {String(children)}
      </ShikiHighlighter>
    </div>
  ) : (
    // <ShikiHighlighter
    //   language={language}
    //   theme={"ayu-dark"}
    //   className="w-1/2"
    //   {...props}
    // >
    //   {String(children)}
    // </ShikiHighlighter>
    <code className={cn(className)} {...props}>
      {children}
    </code>
  );
};
