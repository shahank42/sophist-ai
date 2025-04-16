import { memo } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { ChevronRight, ChevronDown, Plus, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { setNodeCompletedFn } from "@/lib/server/rpc/nodes";
import { getRouteApi } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import ContentPanel from "../content-panel";

interface MindmapNodeProps {
  data: {
    label: string;
    expandable: boolean;
    expanded: boolean;
    selected?: boolean;
    completed: boolean;
    isGenerating?: boolean;
  };
  id: string;
}

const NodeCard = ({
  data,
  id,
  handleNodeClick,
  handleCompletion,
  handleExpand,
  handleGenerateChildren,
}: {
  data: MindmapNodeProps["data"];
  id: string;
  handleNodeClick: () => void;
  handleCompletion: (e: React.MouseEvent) => void;
  handleExpand: (e: React.MouseEvent) => void;
  handleGenerateChildren: (e: React.MouseEvent) => void;
}) => (
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
          "bg-green-400 border-green-500 dark:bg-green-700 dark:border-green-800":
            data.completed,
        }
      )}
    >
      <span
        onClick={handleCompletion}
        className={cn(
          "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all duration-200 cursor-pointer",
          {
            "border-green-700 bg-green-700 text-white hover:bg-green-800 hover:border-green-800 dark:border-green-900 dark:bg-green-900 dark:hover:bg-green-950 dark:hover:border-green-950":
              data.completed,
            "border-zinc-300 dark:border-zinc-600 hover:bg-green-50 hover:border-green-300 dark:hover:bg-green-950/50 dark:hover:border-green-700":
              !data.completed,
          }
        )}
      >
        {data.completed && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
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
      ) : data.completed ? (
        <div className="h-6 w-6 ml-2" />
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 ml-2"
          onClick={handleGenerateChildren}
          disabled={data.isGenerating}
        >
          {data.isGenerating ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
        </Button>
      )}
    </CardHeader>
    <CardContent
      className={cn(
        "flex h-full items-center justify-center bg-white px-2 py-3 dark:bg-zinc-900",
        {
          "bg-green-200 dark:bg-green-900": data.completed,
          "": data.selected,
        }
      )}
    >
      <h2
        className={cn(
          "line-clamp-2 text-center text-sm text-zinc-800 dark:text-zinc-200",
          {
            "text-green-800 dark:text-white": data.completed && data.selected,
            "dark:text-white": data.selected,
          }
        )}
      >
        {data.label}
      </h2>
    </CardContent>
  </Card>
);

const MindmapNode = memo<MindmapNodeProps>(({ data, id }) => {
  const rootContext = getRouteApi("__root__").useRouteContext();
  const user = rootContext.user!;

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

  const handleCompletion = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!user.isPro) {
      toast.info("You need to be a Pro user to mark nodes as completed!");
      return;
    }

    const newCompleted = !data.completed;

    const event = new CustomEvent("nodecompletion", {
      detail: { id, completed: newCompleted },
      bubbles: true,
    });
    document.dispatchEvent(event);

    await setNodeCompletedFn({
      data: { nodeId: id, completed: newCompleted },
    });
  };

  const isMobile = useIsMobile();
  const { getNode } = useReactFlow();

  const nodeContent = (
    <div className={cn("flex h-full w-52 items-center justify-center")}>
      <Handle
        type="target"
        position={Position.Left}
        className="opacity-0 w-2 h-2"
      />
      <NodeCard
        data={data}
        id={id}
        handleNodeClick={handleNodeClick}
        handleCompletion={handleCompletion}
        handleExpand={handleExpand}
        handleGenerateChildren={handleGenerateChildren}
      />
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

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger>{nodeContent}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="h-1"></DrawerHeader>
          <ContentPanel selectedNode={getNode(id) ?? null} />
        </DrawerContent>
        {/* <ContentPanel selectedNode={getNode(id) ?? null} /> */}
      </Drawer>
    );
  }

  return nodeContent;
});

MindmapNode.displayName = "MindmapNode";

export default MindmapNode;
