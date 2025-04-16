import React from "react";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HeadingNode } from "./utils";
import { cn } from "@/lib/utils";

interface TreeViewProps {
  data: HeadingNode;
  onNodeClick: (id: string) => void;
  selectedNodeId: string | null;
}

const TreeViewItem: React.FC<TreeViewProps> = ({
  data,
  onNodeClick,
  selectedNodeId,
}) => {
  const hasChildren = data.children && data.children.length > 0;
  const isSelected = selectedNodeId === data.id;

  return (
    <Collapsible defaultOpen>
      <Button
        variant={isSelected ? "default" : "ghost"}
        size="sm"
        className={cn(
          {
            "bg-secondary text-secondary-foreground": isSelected,
          },
          "flex w-full justify-start py-1 text-xs"
        )}
        onClick={() => onNodeClick(data.id)}
      >
        <span className="truncate">{data.title}</span>
      </Button>
      {hasChildren && (
        <CollapsibleContent>
          <div className="ml-2 pl-1">
            {data.children?.map((child) => (
              <TreeViewItem
                key={child.id}
                data={child}
                onNodeClick={onNodeClick}
                selectedNodeId={selectedNodeId}
              />
            ))}
          </div>
        </CollapsibleContent>
      )}
    </Collapsible>
  );
};

const TreeView: React.FC<TreeViewProps> = ({
  data,
  onNodeClick,
  selectedNodeId,
}) => {
  return (
    <ScrollArea className="h-full w-72 border p-2 bg-background/95">
      <TreeViewItem
        data={data}
        onNodeClick={onNodeClick}
        selectedNodeId={selectedNodeId}
      />
    </ScrollArea>
  );
};

export default TreeView;
