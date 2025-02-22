import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "./ui/skeleton";
import { useArticleContent } from "@/hooks/use-article-content";
import { Node } from "@xyflow/react";
import { Article } from "./article";
import { Button } from "./ui/button";
import { AlertCircle } from "lucide-react";

function ErrorContent({ retry }: { retry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
      <AlertCircle className="h-12 w-12 text-destructive" />
      <div className="space-y-2">
        <h3 className="text-xl font-semibold">Failed to load content</h3>
        <p className="text-muted-foreground">
          There was an error loading the article content. Please try again.
        </p>
      </div>
      <Button onClick={retry} variant="outline">
        Try again
      </Button>
    </div>
  );
}

function SkeletonContent() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-10 w-[85%]" /> {/* Title */}
        <Skeleton className="h-4 w-[40%]" /> {/* Metadata */}
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[92%]" />
        <Skeleton className="h-4 w-[96%]" />
      </div>
      <Skeleton className="h-[200px] w-full" /> {/* Image or large block */}
      <div className="space-y-2">
        <Skeleton className="h-6 w-[70%]" /> {/* Subheading */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[94%]" />
          <Skeleton className="h-4 w-[98%]" />
        </div>
      </div>
      <Skeleton className="h-[120px] w-full" /> {/* Code block */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[95%]" />
      </div>
    </div>
  );
}

export default function ContentPanel({
  selectedNode,
}: {
  selectedNode: Node | null;
}) {
  const {
    data: article,
    isPending,
    isError,
    refetch,
  } = useArticleContent(selectedNode);

  return (
    <ScrollArea className="flex h-[calc(100dvh-48px-24px)] w-full justify-center bg-secondary/20 px-6 text-secondary-foreground/80">
      <div className="mx-auto max-w-2xl py-6 prose dark:prose-invert">
        {isPending ? (
          <SkeletonContent />
        ) : isError ? (
          <ErrorContent retry={refetch} />
        ) : (
          <Article content={article} />
        )}
      </div>
    </ScrollArea>
  );
}
