import { X, Truck, Battery, Clock, Gauge } from "lucide-react";
import { TRUCK_DATA } from "@/lib/routeConstants";

interface TruckDetailOverlayProps {
  routeId: string | null;
  truckIdx: number | null;
  onClose: () => void;
}

export function TruckDetailOverlay({ routeId, truckIdx, onClose }: TruckDetailOverlayProps) {
  if (!routeId || truckIdx === null) return null;

  const trucks = TRUCK_DATA[routeId];
  if (!trucks || !trucks[truckIdx]) return null;

  const truck = trucks[truckIdx];

  return (
    <div className="absolute top-6 right-6 z-50 w-80 animate-in slide-in-from-right-4 fade-in duration-300 flex flex-col gap-3">
      <div className="rounded-2xl border border-white/10 bg-gray-950/80 backdrop-blur-xl overflow-hidden">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Truck className="h-3 w-3 text-blue-400 shrink-0" />
              <span className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase">Truck</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <h2 className="text-base font-bold text-white leading-tight mt-0.5">{truck.id}</h2>
        </div>
        <div className="h-px bg-white/8 mx-4" />
        <div className="px-4 py-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-white/40 font-medium">{truck.plate}</span>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
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
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-xl bg-white/5 p-2 text-center">
              <Battery className="h-3 w-3 text-green-400 mx-auto mb-1" />
              <p className="text-base font-bold text-white">{truck.battery}%</p>
              <p className="text-[9px] text-white/40 uppercase tracking-widest">Battery</p>
            </div>
            <div className="rounded-xl bg-white/5 p-2 text-center">
              <Gauge className="h-3 w-3 text-blue-400 mx-auto mb-1" />
              <p className="text-base font-bold text-white">{truck.speed}</p>
              <p className="text-[9px] text-white/40 uppercase tracking-widest">km/h</p>
            </div>
            <div className="rounded-xl bg-white/5 p-2 text-center">
              <Clock className="h-3 w-3 text-purple-400 mx-auto mb-1" />
              <p className="text-base font-bold text-white">{truck.trips}</p>
              <p className="text-[9px] text-white/40 uppercase tracking-widest">Trips</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
