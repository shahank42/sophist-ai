import ContentPanel from "@/components/content-panel";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Logo } from "@/components/logo";
import MindmapWithProvider from "@/components/mind-map/mind-map";
import { HeadingNode } from "@/components/mind-map/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { loadSubjectTreeFn } from "@/lib/server/rpc/nodes";
import { loadSubjectTreeQueryOptions } from "@/lib/server/rpc/subjects";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { Background, Node, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import { useState } from "react";

export const Route = createFileRoute("/study/$subjectId")({
  // staleTime: 1000 * 60 * 5,
  beforeLoad: ({ context: { user } }) => {
    if (!user) {
      throw redirect({
        to: "/",
      });
    }
  },

  loader: ({ params: { subjectId }, context: { queryClient, user } }) => {
    // queryClient.prefetchQuery(loadSubjectTreeQueryOptions(subjectId));
    return { subjectId };
  },
  component: RouteComponent,
});

// Create a layout wrapper component using the custom hook
function LayoutWrapper({
  children,
  selectedNode,
  topic,
  syllabus
}: {
  children: React.ReactNode;
  selectedNode: Node | null;
  topic: string;
  syllabus: string;
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
              <ContentPanel selectedNode={selectedNode} topic={topic} syllabus={syllabus} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      )}
    </>
  );
}

function RouteComponent() {
  const { subjectId } = Route.useParams();
  const { data, isPending, isError } = useQuery(
    loadSubjectTreeQueryOptions(subjectId)
  );
  // const { data, isPending, isError } = useQuery(
  //   loadSubjectTreeQueryOptions(subjectId)
  // );

  if (isPending) {
    return <>
      <AppSidebar
        data={{} as HeadingNode}
        selectedNodeId={"abc"}
        isPending={isPending}
      />

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center justify-between w-full gap-2 px-4">
            <div className="flex gap-2 items-center text-sm">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              Loading title...
            </div>
            <ThemeToggle />
          </div>
        </header>


        <div className="w-full h-full flex flex-col gap-5 justify-center items-center">
          <img
            src="/icon-darkmode.svg"
            alt="SophistAI icon light"
            className="hidden dark:block animate-pulse size-20"
          />
          <img
            src="/icon-lightmode.svg"
            alt="SophistAI icon light"
            className="dark:hidden animate-pulse size-20"
          />
          <span className="text-xl animate-pulse">Loading your dynamic mindmap...</span>
        </div>

      </SidebarInset>
    </>
  }

  if (isError) {
    return <>Failed to load tree</>;
  }

  return <RoutePage subject={data.subject} tree={data.tree} isPending={isPending} />;

  // return (
  //   <>
  //     {isPending ? (
  //       <>
  //         <AppSidebar
  //           data={{} as HeadingNode}
  //           selectedNodeId={"a"}
  //           isPending={isPending}
  //         />

  //         <SidebarInset>
  //           <header className="flex h-14 shrink-0 items-center gap-2 border-b">
  //             <div className="flex items-center justify-between w-full gap-2 px-4">
  //               <div className="flex gap-2 items-center text-sm">
  //                 <SidebarTrigger className="-ml-1" />
  //                 <Separator orientation="vertical" className="mr-2 h-4" />
  //                 Loading title...
  //               </div>
  //               <ThemeToggle />
  //             </div>
  //           </header>

  //           <LayoutWrapper selectedNode={null}>
  //             {/* {nodeData && (
  //               <MindmapWithProvider
  //                 data={nodeData}
  //                 setData={setNodeData}
  //                 selectedNode={selectedNode}
  //                 setSelectedNode={setSelectedNode}
  //               />
  //             )} */}
  //             Loading mindmap
  //           </LayoutWrapper>
  //         </SidebarInset>
  //       </>
  //     ) : (
  //       <>
  //         <RoutePage tree={data.tree} />
  //       </>
  //     )}
  //   </>
  // );
}

function RoutePage({ tree, isPending, subject }: {
  subject: {
    id: string;
    name: string;
    rawSyllabus: string | null;
    createdAt: Date;
    createdBy: string;
  }, tree: HeadingNode, isPending: boolean
}) {
  const [nodeData, setNodeData] = useState<HeadingNode>(tree);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  return (
    <>
      {nodeData && (
        <AppSidebar
          data={nodeData}
          selectedNodeId={selectedNode?.id ?? null}
          isPending={isPending}
        />
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

        <LayoutWrapper selectedNode={selectedNode} topic={subject.name} syllabus={subject.rawSyllabus ?? ""}>
          {nodeData && (
            <MindmapWithProvider
              data={nodeData}
              setData={setNodeData}
              selectedNode={selectedNode}
              setSelectedNode={setSelectedNode}
              subject={subject}
              subjectTree={tree}
            />
          )}
        </LayoutWrapper>
      </SidebarInset>
    </>
  );
}
