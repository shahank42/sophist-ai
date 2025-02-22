import { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { ChevronRight, ChevronDown, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MindmapNodeProps {
  data: {
    label: string;
    expandable: boolean;
    expanded: boolean;
    selected?: boolean;
  };
  id: string;
}

const MindmapNode = memo<MindmapNodeProps>(({ data, id }) => {
  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    const event = new CustomEvent("nodeexpandtoggle", {
      detail: { id },
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  const handleGenerateChildren = (e: React.MouseEvent) => {
    e.stopPropagation();
    const event = new CustomEvent("nodegeneratechildren", {
      detail: { id },
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  const handleNodeClick = () => {
    const event = new CustomEvent("nodeselect", {
      detail: { id },
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <div className={cn("flex h-full w-52 items-center justify-center")}>
      <Handle
        type="target"
        position={Position.Left}
        className="opacity-0 w-2 h-2"
      />
      <Card
        className="size-[100%] overflow-hidden rounded-xl transition-all duration-300 ease-in-out hover:border-zinc-300 hover:shadow-md hover:ring-2 dark:ring-zinc-800 dark:hover:border-zinc-700"
        onClick={handleNodeClick}
      >
        <CardHeader
          className={cn(
            "flex flex-row items-center justify-between border-b border-zinc-200 bg-zinc-100 px-3 py-0.5 dark:border-zinc-700 dark:bg-zinc-800",
            {
              "bg-white/50 dark:bg-zinc-500 dark:border-zinc-500":
                data.selected,
            }
          )}
        >
          <div
            className={cn("size-3 rounded-full bg-zinc-300 dark:bg-zinc-600", {
              "dark:bg-zinc-300": data.selected,
            })}
          />
          {data.expandable ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-2"
              onClick={handleExpand}
            >
              {data.expanded ? (
                <ChevronDown className="size-5" />
              ) : (
                <ChevronRight className="size-5" />
              )}
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 ml-2"
              onClick={handleGenerateChildren}
            >
              <Plus className="size-4" />
            </Button>
            // <TooltipProvider delayDuration={0}>
            //   <Tooltip>
            //     <TooltipTrigger asChild>
            //       {/* <Button
            //         variant="outline"
            //         size="icon"
            //         aria-label="Add new item"
            //       >
            //         <Plus size={16} strokeWidth={2} aria-hidden="true" />
            //       </Button> */}
            //       <Button
            //         variant="ghost"
            //         size="icon"
            //         className="h-6 w-6 ml-2"
            //         onClick={handleGenerateChildren}
            //       >
            //         <Plus className="h-4 w-4" />
            //       </Button>
            //     </TooltipTrigger>
            //     <TooltipContent className="px-2 py-1 text-xs">
            //       Generate Sub-topics
            //     </TooltipContent>
            //   </Tooltip>
            // </TooltipProvider>
          )}
        </CardHeader>
        <CardContent
          className={cn(
            "flex h-full items-center justify-center bg-white px-2 py-3 dark:bg-zinc-900",
            {
              "bg-white/50 dark:bg-zinc-600": data.selected,
            }
          )}
        >
          <h2
            className={cn(
              "line-clamp-2 text-center text-sm text-zinc-800 dark:text-zinc-200",
              {
                "dark:text-white dark:font-semibold dark:tracking-wide":
                  data.selected,
              }
            )}
          >
            {data.label}
          </h2>
        </CardContent>
      </Card>
      <Handle
        type="source"
        position={Position.Right}
        style={{ width: 8, height: 8 }}
        className={cn(
          {
            "opacity-0": true,
          },
          "border-2 border-zinc-200"
        )}
      />
    </div>
  );
});

MindmapNode.displayName = "MindmapNode";

export default MindmapNode;
