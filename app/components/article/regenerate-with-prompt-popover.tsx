import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquarePlus, Sparkles } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RegenerateWithPromptPopoverProps {
  sectionIndex: number;
  onRegenerateWithPrompt?: (sectionIndex: number, prompt: string) => void;
  isRegenerating: boolean;
  onPopoverOpenChange?: (isOpen: boolean) => void;
}

export const RegenerateWithPromptPopover = ({
  sectionIndex,
  onRegenerateWithPrompt,
  isRegenerating,
  onPopoverOpenChange,
}: RegenerateWithPromptPopoverProps) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [promptText, setPromptText] = useState("");

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promptText.trim() && onRegenerateWithPrompt) {
      onRegenerateWithPrompt(sectionIndex, promptText);
      setPromptText("");
      setPopoverOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setPopoverOpen(open);
    onPopoverOpenChange?.(open);
  };

  return (
    <div className="relative">
      <Popover open={popoverOpen} onOpenChange={handleOpenChange}>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isRegenerating}
              >
                <MessageSquarePlus className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent
            className="z-[60]" // Higher z-index than default popover (which is usually 50)
            sideOffset={5}
          >
            <p>Regenerate with prompt</p>
          </TooltipContent>
        </Tooltip>
        <PopoverContent
          className="w-[30rem] p-0 overflow-hidden border border-border shadow-md z-[50] rounded-lg"
          sideOffset={5}
          align="end"
          side="top"
        >
          <div className="flex flex-col">
            <div className="bg-muted/50 px-4 py-2 border-b border-border">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <MessageSquarePlus className="h-3.5 w-3.5" />
                Regenerate with prompt
              </h4>
            </div>

            <form onSubmit={handlePromptSubmit} className="p-4 space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="prompt"
                  className="text-xs text-muted-foreground"
                >
                  How would you like to improve this section?
                </Label>
                <Textarea
                  id="prompt"
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Enter instructions for regenerating this section..."
                  className="min-h-32 resize-none border border-input bg-background transition-all focus-visible:ring-1 text-sm"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-between pt-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!promptText.trim()}
                  className="flex gap-1.5 items-center transition-all"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Generate</span>
                </Button>
                <p className="text-xs text-muted-foreground">
                  {promptText.length > 0
                    ? `${promptText.length} characters`
                    : "Be specific for better results"}
                </p>
              </div>
            </form>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
