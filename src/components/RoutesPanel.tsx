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
      <div className="rounded-2xl border border-white/10 bg-gray-950/80 backdrop-blur-xl overflow-hidden">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <RouteIcon className="h-3 w-3 text-blue-400 shrink-0" />
              <span className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase">Navigation</span>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="rounded-md p-1 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <h2 className="text-base font-bold text-white leading-tight mt-0.5">Routes</h2>
        </div>
        <div className="h-px bg-white/8 mx-4" />
        <div className="px-4 py-3 flex flex-col gap-1.5">
          {ROUTE_CONFIGS.map((route) => (
            <div
              key={route.id}
              onClick={() => {
                onRouteClick?.(route.id);
                onOpenChange(false);
              }}
              className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5 cursor-pointer hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="inline-block h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: route.lineColor }} />
                <div>
                  <p className="text-[11px] font-medium text-white/70">{ROUTE_NAMES[route.id] ?? route.id}</p>
                  <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                    {route.from[1].toFixed(4)}°N → {route.to[1].toFixed(4)}°N
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="h-3 w-3 text-white/40" />
                <span className="text-[11px] text-white/70 font-medium">{route.numTrucks}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
