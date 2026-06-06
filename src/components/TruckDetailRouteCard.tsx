import { MapPin, Zap, BatteryLow } from "lucide-react";
import { ROUTE_STOPS } from "@/lib/routeConstants";

interface TruckDetailRouteCardProps {
  routeId: string | null;
}

function getActionIcon(action: string) {
  if (action.toLowerCase().startsWith("discharge")) {
    return <BatteryLow size={9} className="text-blue-400" />;
  }
  return <Zap size={9} className="text-yellow-400" />;
}

function getActionColor(action: string) {
  return action.toLowerCase().startsWith("discharge") ? "text-blue-400" : "text-yellow-400";
}

export function TruckDetailRouteCard({ routeId }: TruckDetailRouteCardProps) {
  if (!routeId) return null;

  const stops = ROUTE_STOPS[routeId];
  if (!stops) return null;

  return (
    <div className="absolute top-6 right-6 z-50 w-72 animate-in slide-in-from-right-4 fade-in duration-300">
      <div className="rounded-2xl border border-white/10 bg-gray-950/80 backdrop-blur-xl overflow-hidden">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-1.5 mb-0.5">
            <MapPin size={10} className="text-blue-400 shrink-0" />
            <span className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase">
              Route
            </span>
          </div>
          <h2 className="text-sm font-bold text-white leading-tight">Journey Plan</h2>
        </div>

        <div className="h-px bg-white/8 mx-4" />

        <div className="px-4 py-3">
          {stops.map((stop, idx) => {
            const isLast = idx === stops.length - 1;
            const isOrigin = stop.type === "origin";
            const isDestination = stop.type === "destination";

            return (
              <div key={idx} className="flex gap-3">
                {/* Timeline spine */}
                <div className="flex flex-col items-center shrink-0" style={{ width: 16 }}>
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${
                      isOrigin || isDestination
                        ? "border-blue-400 bg-blue-400/20"
                        : "border-white/30 bg-white/5"
                    }`}
                  />
                  {!isLast && (
                    <div className="w-px flex-1 bg-white/10 my-1" style={{ minHeight: 24 }} />
                  )}
                </div>

                {/* Content */}
                <div className={`flex flex-col gap-0.5 ${isLast ? "" : "pb-3"}`}>
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-widest ${
                      isOrigin || isDestination ? "text-blue-400" : "text-white/40"
                    }`}
                  >
                    {stop.label}
                  </span>
                  <span className="text-[11px] font-medium text-white/80">{stop.address}</span>
                  {stop.action && (
                    <div className="flex items-center gap-1 mt-0.5">
                      {getActionIcon(stop.action)}
                      <span className={`text-[10px] font-medium ${getActionColor(stop.action)}`}>
                        {stop.action}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
