import { Link, useRouterState } from "@tanstack/react-router";
import { MapIcon, LayoutDashboardIcon, SunIcon, MoonIcon, LocateIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  isDark?: boolean;
  toggle?: () => void;
  onRoutesClick?: () => void;
}

export function AppSidebar({ isDark, toggle, onRoutesClick }: AppSidebarProps) {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const navItems = [
    { icon: LayoutDashboardIcon, label: "Dashboard", to: "/dashboard" },
    { icon: MapIcon, label: "Map", to: "/" },
  ];

  return (
    <div className="flex h-full w-16 flex-col items-center justify-between border-r border-white/10 bg-gray-900/80 backdrop-blur-xl py-4">
      <div className="flex flex-col items-center gap-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg transition-colors",
              currentPath === item.to
                ? "bg-blue-500/20 text-blue-400"
                : "text-gray-400 hover:bg-white/10 hover:text-white"
            )}
            title={item.label}
          >
            <item.icon className="h-5 w-5" />
          </Link>
        ))}
        <button
          onClick={onRoutesClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          title="Routes"
        >
          <LocateIcon className="h-5 w-5" />
        </button>
      </div>

      <button
        onClick={toggle}
        className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
        title={isDark ? "Light Mode" : "Dark Mode"}
      >
        {isDark ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
      </button>
    </div>
  );
}
