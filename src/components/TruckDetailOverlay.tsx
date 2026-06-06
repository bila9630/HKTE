import { X, Truck, Battery, Gauge, Activity } from "lucide-react";
import { TRUCK_DATA, ROUTE_NAMES } from "@/lib/routeConstants";

interface TruckDetailOverlayProps {
  routeId: string | null;
  truckIdx: number | null;
  onClose: () => void;
}

const STATUS_LABEL: Record<string, string> = {
  delivering: "Delivering",
  returning: "Returning",
  charging: "Charging",
};

const STATUS_DOT: Record<string, string> = {
  delivering: "bg-green-400",
  returning: "bg-blue-400",
  charging: "bg-yellow-400",
};

export function TruckDetailOverlay({ routeId, truckIdx, onClose }: TruckDetailOverlayProps) {
  if (!routeId || truckIdx === null) return null;

  const trucks = TRUCK_DATA[routeId];
  if (!trucks || !trucks[truckIdx]) return null;

  const truck = trucks[truckIdx];
  const routeName = ROUTE_NAMES[routeId];

  return (
    <div className="absolute bottom-6 left-6 z-50 w-80 animate-in slide-in-from-left-4 fade-in duration-300 flex flex-col gap-3">
      <div className="rounded-2xl border border-white/10 bg-gray-950/80 backdrop-blur-xl overflow-hidden">
        {/* Hero image */}
        <div className="w-full h-36 overflow-hidden relative">
          <img
            src="/e_truck.webp"
            alt="Electric truck"
            className="w-full h-full object-cover opacity-80"
          />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 rounded-full p-1.5 bg-gray-950/60 text-white/60 hover:bg-gray-950/80 hover:text-white transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Header */}
        <div className="px-4 pt-4 pb-3 flex items-start gap-2">
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-1.5">
              <Truck size={12} className="text-blue-400 shrink-0" />
              <span className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase">
                {truck.id}
              </span>
            </div>
            <h2 className="text-base font-bold text-white leading-tight">{truck.plate}</h2>
            {routeName && <p className="text-[11px] text-white/40 truncate">{routeName}</p>}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/8 mx-4" />

        {/* Stats */}
        <div className="px-4 py-3 flex flex-col gap-2.5">
          {/* Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Activity size={12} className="text-white/40" />
              <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                Status
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${STATUS_DOT[truck.status] ?? "bg-white/20"}`}
              />
              <span className="text-[11px] text-white/70 font-medium">
                {STATUS_LABEL[truck.status] ?? truck.status}
              </span>
            </div>
          </div>

          {/* Battery */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Battery size={12} className="text-white/40" />
              <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                Battery
              </span>
            </div>
            <span className="text-[11px] text-white/70 font-medium">{truck.battery}%</span>
          </div>

          {/* Speed */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Gauge size={12} className="text-white/40" />
              <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                Speed
              </span>
            </div>
            <span className="text-[11px] text-white/70 font-medium">{truck.speed} km/h</span>
          </div>
        </div>
      </div>
    </div>
  );
}
