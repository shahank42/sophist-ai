import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRef, useEffect, useState } from "react";
import mermaid from "mermaid";
import { useTheme } from "../providers/theme-provider";
import { cn } from "@/lib/utils";
import { CodeHighlight } from "../code-highlight";

interface ArticleProps {
  content: string;
}

// Initialize mermaid
mermaid.initialize({
  startOnLoad: true,
  theme: "neutral",
  securityLevel: "loose",
  fontFamily: "Inter, sans-serif",
});

function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const [svg, setSvg] = useState<string>("");

  useEffect(() => {
    const renderChart = async () => {
      if (ref.current) {
        // Clear previous renders
        ref.current.innerHTML = "";

        try {
          // Set mermaid theme based on current theme
          mermaid.initialize({
            theme: theme === "dark" ? "dark" : "neutral",
          });

          // Render the chart
          const { svg } = await mermaid.render(
            `mermaid-${Math.random()}`,
            chart
          );
          setSvg(svg);
        } catch (error) {
          console.error("Failed to render mermaid diagram:", error);
          ref.current.innerHTML = `<div class="text-red-500">Failed to render diagram</div>`;
        }
      }
    };

    renderChart();
  }, [chart, theme]);

  return (
    <Card className="my-6">
      <CardContent className="p-4 flex justify-center overflow-auto">
        <div
          ref={ref}
          className="mermaid-diagram"
          dangerouslySetInnerHTML={{ __html: svg }}
        ></div>
      </CardContent>
    </Card>
  );
}

export function SectionContent({ content }: ArticleProps) {
  const { theme } = useTheme();

  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code: CodeHighlight,
        table({ node, ...props }) {
          return (
            <div className="my-6 w-full overflow-y-auto">
              <Table>{props.children}</Table>
            </div>
          );
        },
        thead({ node, ...props }) {
          return <TableHeader>{props.children}</TableHeader>;
        },
        tbody({ node, ...props }) {
          return <TableBody>{props.children}</TableBody>;
        },
        tr({ node, ...props }) {
          return <TableRow>{props.children}</TableRow>;
        },
        th({ node, ...props }) {
          return (
            <TableHead className="text-left font-medium">
              {props.children}
            </TableHead>
          );
        },
        td({ node, ...props }) {
          return <TableCell className="p-2">{props.children}</TableCell>;
        },
        blockquote({ node, ...props }) {
          return (
            <blockquote className="mt-6 border-l-4 border-primary pl-4 italic text-muted-foreground">
              {props.children}
            </blockquote>
          );
        },
        a({ node, ...props }) {
          return (
            <a
              className="font-medium text-primary underline underline-offset-4 hover:no-underline"
              {...props}
            >
              {props.children}
            </a>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
