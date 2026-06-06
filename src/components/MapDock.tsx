import React from "react";
import { HomeIcon, ClockIcon, FileTextIcon, SunIcon, MoonIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dock, DockIcon } from "@/components/ui/dock";

interface MapDockProps {
  isDark?: boolean;
  toggle?: () => void;
}

const navItems = [
  { icon: HomeIcon, label: "Overview" },
  { icon: ClockIcon, label: "Timeplan" },
  { icon: FileTextIcon, label: "Document" },
];

export function MapDock({ isDark, toggle }: MapDockProps) {
  return (
    <TooltipProvider>
      <Dock direction="middle">
        {navItems.map((item) => (
          <DockIcon key={item.label}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  aria-label={item.label}
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "icon" }),
                    "size-12 rounded-full hover:bg-blue-500/20"
                  )}
                >
                  <item.icon className="size-4 text-blue-400" />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}
        <Separator orientation="vertical" className="h-full" />
        <DockIcon>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggle}
                aria-label={isDark ? "Light Mode" : "Dark Mode"}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "size-12 rounded-full hover:bg-blue-500/20"
                )}
              >
                {isDark ? (
                  <SunIcon className="size-4 text-blue-400" />
                ) : (
                  <MoonIcon className="size-4 text-blue-400" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isDark ? "Light Mode" : "Dark Mode"}</p>
            </TooltipContent>
          </Tooltip>
        </DockIcon>
      </Dock>
    </TooltipProvider>
  );
}
