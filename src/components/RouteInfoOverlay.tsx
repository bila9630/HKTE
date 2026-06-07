import { Truck } from "lucide-react";
import { TRUCK_DATA } from "@/lib/routeConstants";

export function TrucksOverlay({
  routeId,
  onTruckClick,
  selectedTruckIdx,
}: {
  routeId: string | null;
  onTruckClick?: (routeId: string, truckIdx: number) => void;
  selectedTruckIdx?: number | null;
}) {
  if (!routeId) return null;

  const trucks = TRUCK_DATA[routeId];
  if (!trucks) return null;

  return (
    <div>
      <div className="rounded-2xl border border-white/10 bg-gray-950/80 backdrop-blur-xl overflow-hidden">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Truck className="h-3 w-3 text-blue-400 shrink-0" />
            <span className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase">Fleet</span>
          </div>
          <h2 className="text-base font-bold text-white leading-tight">Fleet Status</h2>
        </div>
        <div className="h-px bg-white/8 mx-4" />
        <div className="px-4 py-3 flex flex-col gap-2 max-h-60 overflow-y-auto">
          {trucks.map((truck, idx) => (
            <div
              key={truck.id}
              onClick={() => onTruckClick?.(routeId, idx)}
              className={`flex items-center justify-between rounded-xl px-3 py-2 cursor-pointer transition-colors ${
                selectedTruckIdx === idx
                  ? "bg-blue-500/20 border border-blue-500/40"
                  : "bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-2">
                <Truck className="h-3 w-3 text-white/40" />
                <div>
                  <p className="text-[11px] font-medium text-white">{truck.id}</p>
                  <p className="text-[10px] text-white/40">{truck.plate}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-12">
                  <div className="h-1.5 rounded-full bg-white/10">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${truck.battery}%`,
                        backgroundColor: truck.battery > 50 ? "#4ade80" : truck.battery > 20 ? "#facc15" : "#f87171",
                      }}
                    />
                  </div>
                  <p className="text-[9px] text-white/40 mt-0.5 text-right">{truck.battery}%</p>
                </div>
                <span
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                    truck.status === "delivering"
                      ? "bg-green-500/10 text-green-400"
                      : truck.status === "returning"
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-yellow-500/10 text-yellow-400"
                  }`}
                >
                  {truck.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
