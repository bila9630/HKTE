import { Truck } from "lucide-react";
import { TRUCK_DATA } from "@/lib/routeConstants";

const allTrucks = Object.entries(TRUCK_DATA).flatMap(([routeId, trucks]) =>
  trucks.map((truck, truckIdx) => ({ ...truck, routeId, truckIdx }))
);
const active = allTrucks.filter((t) => t.status === "delivering").length;
const charging = allTrucks.filter((t) => t.status === "charging").length;

const STATUS_CONFIG = {
  delivering: { label: "Driving", dot: "bg-green-400", badge: "text-green-400 bg-green-400/10" },
  charging: { label: "Charging", dot: "bg-blue-400", badge: "text-blue-400 bg-blue-400/10" },
};

function batteryColor(pct: number) {
  if (pct > 60) return "bg-green-500";
  if (pct > 30) return "bg-yellow-500";
  return "bg-red-500";
}

interface FleetOverviewCardProps {
  onTruckClick?: (routeId: string, truckIdx: number) => void;
}

export function FleetOverviewCard({ onTruckClick }: FleetOverviewCardProps) {
  return (
    <div className="absolute bottom-6 left-6 z-50 w-80 animate-in fade-in slide-in-from-left-4 duration-300">
      <div className="rounded-2xl border border-white/10 bg-gray-950/80 backdrop-blur-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Truck size={13} className="text-white/50" />
            <span className="text-sm font-bold text-white">Fleet</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-white/30 tabular-nums">
            <span className="text-green-400">{active} active</span>
            <span>·</span>
            <span className="text-blue-400">{charging} charging</span>
          </div>
        </div>

        <div className="h-px bg-white/8 mx-4" />

        {/* Vehicle list */}
        <div className="flex flex-col divide-y divide-white/5 max-h-64 overflow-y-auto">
          {allTrucks.map((truck) => {
            const { label, dot, badge } = STATUS_CONFIG[truck.status];
            return (
              <div
                key={truck.id}
                className="px-4 py-2 flex items-center gap-2.5 cursor-pointer hover:bg-white/5 transition-colors"
                onClick={() => onTruckClick?.(truck.routeId, truck.truckIdx)}
              >
                <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${dot}`} />

                <div className="flex flex-col min-w-0 w-16 shrink-0">
                  <span className="text-[11px] font-semibold text-white/80 whitespace-nowrap">{truck.id}</span>
                  <span className="text-[9px] text-white/30 truncate">{truck.plate}</span>
                </div>

                <div className="flex items-center gap-1.5 flex-1 min-w-0">
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${batteryColor(truck.battery)}`}
                      style={{ width: `${truck.battery}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-white/50 tabular-nums w-6 text-right shrink-0">
                    {truck.battery}%
                  </span>
                </div>

                <span className={`shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${badge}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
