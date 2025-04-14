import { AppSidebar } from "@/components/layout/app-sidebar";
import ContentPanel from "@/components/content-panel";
import TitleBar from "@/components/layout/title-bar";
import MindmapWithProvider from "@/components/mind-map/mind-map";
import { buildTree, HeadingNode } from "@/components/mind-map/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  createFileRoute,
  Navigate,
  redirect,
  Router,
} from "@tanstack/react-router";
import { use, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { querySubjectFn } from "@/lib/server/rpc/subjects";
import { getSubjectTreeFn } from "@/lib/server/rpc/nodes";
import { Node } from "@xyflow/react";
import { useIsMobile } from "@/hooks/use-mobile";

async function loadSubjectTreeFn(subjectId: string) {
  const subject = await querySubjectFn({ data: { id: subjectId } });
  const tree = await getSubjectTreeFn({
    data: { subjectId },
  });
  if (!tree) {
    // TODO: handle no tree found in db
    throw redirect({
      to: "/",
    });
  }
  return { subject, tree };
}

export const Route = createFileRoute("/(app)/app/$subjectId")({
  staleTime: 1000 * 60 * 5,
  beforeLoad: async ({ params: { subjectId }, context: { user } }) => {
    if (!user) {
      throw redirect({
        to: "/",
      });
    }
  },
  loader: async ({ params: { subjectId } }) => {
    return loadSubjectTreeFn(subjectId);
  },
  component: RouteComponent,
});

// Create a layout wrapper component using the custom hook
function LayoutWrapper({
  children,
  selectedNode,
}: {
  children: React.ReactNode;
  selectedNode: Node | null;
}) {
  const isMobile = useIsMobile();

  return (
    <>
      {/* Mobile layout - only render if we're in mobile view */}
      {isMobile && (
        <div className="flex h-[calc(100dvh-48px-24px)] flex-col">
          <div className="w-full">{children}</div>
        </div>
      )}

      {/* Desktop layout - only render if we're in desktop view */}
      {!isMobile && (
        <div className="flex h-[calc(100dvh-48px-24px)] flex-col">
          <ResizablePanelGroup direction="horizontal" className="w-full">
            <ResizablePanel defaultSize={50}>
              <div className="w-full">{children}</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={50}>
              <ContentPanel selectedNode={selectedNode} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </>
  );
}

function RouteComponent() {
  const { tree } = Route.useLoaderData();
  const [nodeData, setNodeData] = useState<HeadingNode>(tree);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  return (
    <>
      {nodeData && (
        <AppSidebar data={nodeData} selectedNodeId={selectedNode?.id ?? null} />
      )}
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center justify-between w-full gap-2 px-4">
            <div className="flex gap-2 items-center text-sm">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              {nodeData?.title}
            </div>
            <ThemeToggle />
          </div>
        </header>

        <LayoutWrapper selectedNode={selectedNode}>
          {nodeData && (
            <MindmapWithProvider
              data={nodeData}
              setData={setNodeData}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
            />
          )}
        </LayoutWrapper>
      </SidebarInset>
    </>
  );
}
