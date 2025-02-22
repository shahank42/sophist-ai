import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
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

interface ArticleProps {
  content: string;
}

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="absolute right-2 top-2 opacity-50 hover:opacity-100"
      onClick={handleCopy}
    >
      <Copy className={copied ? "text-green-500" : "text-gray-500"} size={16} />
    </Button>
  );
}

export function Article({ content }: ArticleProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: "neutral",
      securityLevel: "loose",
    });
  }, []);

  useEffect(() => {
    if (mermaidRef.current) {
      mermaid.contentLoaded();
    }
  }, [content]);

  return (
    <div className="prose prose-slate dark:prose-invert max-w-none [&_pre]:p-0 [&_pre]:my-4 [&_:not(pre)>code]:before:content-none [&_:not(pre)>code]:after:content-none font-atkinson-hyperlegible">
      <ReactMarkdown
        remarkPlugins={[remarkMath, remarkGfm]}
        rehypePlugins={[rehypeKatex]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const code = String(children).replace(/\n$/, "");

            if (match && match[1] === "mermaid") {
              return (
                <div ref={mermaidRef} className="mermaid my-4">
                  {code}
                </div>
              );
            }

            if (!inline && match) {
              return (
                <div className="relative group">
                  <SyntaxHighlighter
                    style={dark}
                    language={match[1]}
                    PreTag="div"
                    className="rounded-md !bg-slate-900 !p-4"
                    {...props}
                  >
                    {code}
                  </SyntaxHighlighter>
                  <CopyButton code={code} />
                </div>
              );
            }

            return (
              <code
                className="rounded bg-slate-200 px-1 py-0.5 font-mono text-sm dark:bg-slate-800"
                {...props}
              >
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <div className="my-4 w-full overflow-auto">
                <Table className="border border-slate-200 dark:border-slate-800">
                  {children}
                </Table>
              </div>
            );
          },
          thead({ children }) {
            return <TableHeader>{children}</TableHeader>;
          },
          tbody({ children }) {
            return <TableBody>{children}</TableBody>;
          },
          tr({ children }) {
            return <TableRow>{children}</TableRow>;
          },
          th({ children }) {
            return <TableHead>{children}</TableHead>;
          },
          td({ children }) {
            return <TableCell>{children}</TableCell>;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
