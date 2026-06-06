import { ROUTE_CONFIGS } from "@/lib/truckRoutes";
import { X, Route as RouteIcon, Truck } from "lucide-react";

interface RoutesPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRouteClick?: (routeId: string) => void;
}

const ROUTE_NAMES: Record<string, string> = {
  sz: "Shenzhen → Central",
  yantian: "Yantian → Wan Chai",
  nanshan: "Nanshan → Tsim Sha Tsui",
};

export function RoutesPanel({ open, onOpenChange, onRouteClick }: RoutesPanelProps) {
  if (!open) return null;

  return (
    <div className="absolute top-6 right-6 z-50 w-96 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="rounded-xl border border-white/10 bg-gray-900/70 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <p className="text-sm font-semibold text-white flex items-center gap-2">
            <RouteIcon className="h-4 w-4 text-blue-400" /> Routes
          </p>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md p-1 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-4 pb-4 space-y-2">
          {ROUTE_CONFIGS.map((route) => (
            <div
              key={route.id}
              onClick={() => {
                onRouteClick?.(route.id);
                onOpenChange(false);
              }}
              className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-3 cursor-pointer hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: route.lineColor }} />
                <div>
                  <p className="text-sm font-medium text-white capitalize">{ROUTE_NAMES[route.id] ?? route.id}</p>
                  <p className="text-[10px] text-gray-400">
                    {route.from[1].toFixed(4)}°N → {route.to[1].toFixed(4)}°N
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <Truck className="h-3.5 w-3.5" />
                <span>{route.numTrucks}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
