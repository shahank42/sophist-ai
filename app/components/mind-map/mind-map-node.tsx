import { memo, useEffect, useState } from "react";
import { Handle, Position, useEdges } from "@xyflow/react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { ChevronRight, ChevronDown, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { setNodeCompletedFn } from "@/lib/server/rpc/nodes";

interface MindmapNodeProps {
  data: {
    label: string;
    expandable: boolean;
    expanded: boolean;
    selected?: boolean;
    completed: boolean;
  };
  id: string;
}

const MindmapNode = memo<MindmapNodeProps>(({ data, id }) => {
  const [completed, setCompleted] = useState<boolean>(data.completed);

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

  useEffect(() => {
    console.log(`node ${id} completed: ${completed}`);
  }, [completed]);

  return (
    <div className={cn("flex h-full w-52 items-center justify-center")}>
      <Handle
        type="target"
        position={Position.Left}
        className="opacity-0 w-2 h-2"
      />
      <Card
        className={cn(
          "size-[100%] overflow-hidden rounded-xl transition-all duration-300 ease-in-out hover:shadow-md hover:ring-4 dark:ring-zinc-500",
          {
            "ring-4 dark:ring-zinc-400": data.selected,
          }
        )}
        onClick={handleNodeClick}
      >
        <CardHeader
          className={cn(
            "flex flex-row items-center justify-between border-b border-zinc-200 bg-zinc-100 px-3 py-0.5 dark:border-zinc-700 dark:bg-zinc-800",
            {
              "dark:bg-green-700 dark:border-green-800": completed,
            }
          )}
        >
          <span
            onClick={async (e) => {
              e.stopPropagation();
              if (data.selected) {
                console.log("setting node", !completed);
                setCompleted(!completed);
                await setNodeCompletedFn({
                  data: { nodeId: id, completed: !completed },
                });
              }
            }}
            className={cn(
              "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-200",
              {
                "cursor-pointer hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950/50 dark:hover:border-green-700":
                  data.selected,
                "cursor-not-allowed opacity-50": !data.selected,
                "border-green-700 bg-green-700 text-white hover:bg-green-800 hover:border-green-800":
                  completed,
                "border-zinc-300 dark:border-zinc-600": !completed,
              }
            )}
          >
            {completed && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
          </span>

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
          )}
        </CardHeader>
        <CardContent
          className={cn(
            "flex h-full items-center justify-center bg-white px-2 py-3 dark:bg-zinc-900",
            {
              "dark:bg-green-900": completed,
              "": data.selected,
            }
          )}
        >
          <h2
            className={cn(
              "line-clamp-2 text-center text-sm text-zinc-800 dark:text-zinc-200",
              {
                "dark:text-white ": data.selected,
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
