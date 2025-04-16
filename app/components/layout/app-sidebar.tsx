import * as React from "react";
import { ChevronRight } from "lucide-react";
import { HeadingNode } from "../mind-map/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "../theme-toggle";
import { cn } from "@/lib/utils";
import { UserDetailsSelect } from "../user-details-select";
import { useTheme } from "../providers/theme-provider";

type TreeProps = {
  node: HeadingNode;
  selectedNodeId: string | null;
  depth?: number;
};

function Tree({ node, selectedNodeId, depth = 0 }: TreeProps) {
  const hasChildren = (node.children ?? []).length > 0;
  const { isMobile } = useSidebar();

  const onNodeClick = () => {
    document.dispatchEvent(
      new CustomEvent("treenodeselect", {
        detail: { id: node.id },
        bubbles: true,
      })
    );

    // document.dispatchEvent(
    //   new CustomEvent("nodeexpandtoggle", {
    //     detail: { id: node.id },
    //     bubbles: true,
    //   })
    // );
  };

  const indentStyle = {
    "--index": `${depth * 0.8 + 0.3}rem`,
  } as React.CSSProperties;

  if (!hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={node.id === selectedNodeId}
          className={cn(
            "whitespace-nowrap overflow-hidden h-7 text-ellipsis pl-(--index) pr-2 transition-colors hover:bg-zinc-700/50 hover:text-white focus:bg-zinc-700/50 focus:text-white data-[active=true]:bg-zinc-700/50",
            {
              "w-[250px]": isMobile,
              "w-[200px]": !isMobile,
            }
          )}
          onClick={onNodeClick}
          style={indentStyle}
        >
          <ChevronRight className="invisible h-4 w-4 shrink-0" />
          <span className="overflow-hidden text-ellipsis text-xs min-w-0">
            {node.title}
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible
      className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
      defaultOpen
    >
      <CollapsibleTrigger asChild>
        <SidebarMenuButton
          onClick={onNodeClick}
          className={cn(
            "whitespace-nowrap overflow-hidden text-ellipsis pl-(--index) pr-2 transition-colors hover:bg-zinc-700/50 hover:text-white focus:bg-zinc-700/50 focus:text-white data-[active=true]:bg-zinc-700/50",
            {
              "w-[250px]": isMobile,
              "w-[200px]": !isMobile,
            }
          )}
          style={indentStyle}
        >
          <ChevronRight className="h-4 w-4 transition-transform shrink-0" />
          <span className="overflow-hidden text-ellipsis text-xs min-w-0">
            {node.title}
          </span>
        </SidebarMenuButton>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <SidebarMenuItem>
          <SidebarMenuSub className="m-0 w-full border-none p-0">
            {node.children?.map((child) => (
              <Tree
                key={child.id}
                node={child}
                selectedNodeId={selectedNodeId}
                depth={depth + 1}
              />
            ))}
          </SidebarMenuSub>
        </SidebarMenuItem>
      </CollapsibleContent>
    </Collapsible>
  );
}

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  data: HeadingNode;
  selectedNodeId: string | null;
};

export function AppSidebar({
  data,
  selectedNodeId,
  ...props
}: AppSidebarProps) {
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader className="flex flex-row items-center justify-between h-16">
        <Link
          to="/study"
          onClick={() => setOpenMobile(false)}
          className="relative w-full z-20 bg-linear-to-b from-zinc-600 to-zinc-900 bg-clip-text text-xl text-center font-extrabold text-transparent dark:from-zinc-100 dark:to-zinc-500"
        >
          <img
            src="/logo-lightmode.svg"
            alt="SophistAI"
            className="dark:hidden h-8 w-auto mx-auto"
          />
          <img
            src="/logo-darkmode.svg"
            alt="SophistAI"
            className="hidden dark:block h-8 w-auto mx-auto"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <ScrollArea className="h-[calc(100vh-4rem)] w-full">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <Tree node={data} selectedNodeId={selectedNodeId} />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="pt-4">
        <UserDetailsSelect />
      </SidebarFooter>
    </Sidebar>
  );
}
