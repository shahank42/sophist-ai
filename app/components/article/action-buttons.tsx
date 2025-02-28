import { Button } from "@/components/ui/button";
import { RefreshCw, MessageSquarePlus, ListPlus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { RegenerateWithPromptPopover } from "./regenerate-with-prompt-popover";

interface ActionButtonsProps {
  isHovered: boolean;
  sectionIndex: number;
  onRegenerate?: (sectionIndex: number) => void;
  onRegenerateWithPrompt?: (sectionIndex: number, prompt: string) => void;
  onElaborate?: () => void;
  isElaborating?: boolean;
  isRegenerating: boolean;
  onPopoverOpenChange?: (isOpen: boolean) => void;
}

export const ActionButtons = ({
  isHovered,
  sectionIndex,
  onRegenerate,
  onRegenerateWithPrompt,
  onElaborate,
  isElaborating,
  isRegenerating,
  onPopoverOpenChange,
}: ActionButtonsProps) => (
  <TooltipProvider delayDuration={300}>
    <div
      className={cn(
        "flex gap-1 transition-opacity duration-200",
        !isHovered && "opacity-0"
      )}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onRegenerate?.(sectionIndex)}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          className="z-[60]" // Higher z-index than default popover (which is usually 50)
          sideOffset={5}
        >
          <p>Regenerate</p>
        </TooltipContent>
      </Tooltip>

      <RegenerateWithPromptPopover
        sectionIndex={sectionIndex}
        onRegenerateWithPrompt={onRegenerateWithPrompt}
        isRegenerating={isRegenerating}
        onPopoverOpenChange={onPopoverOpenChange}
      />

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onElaborate?.()}
            disabled={isElaborating}
          >
            <ListPlus className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent
          className="z-[60]" // Higher z-index than default popover (which is usually 50)
          sideOffset={5}
        >
          <p>Elaborate</p>
        </TooltipContent>
      </Tooltip>
    </div>
  </TooltipProvider>
);
