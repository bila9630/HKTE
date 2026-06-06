import { ChevronLeft, ChevronRight, Truck } from "lucide-react";
import { TRUCK_DATA } from "@/lib/routeConstants";

interface SwitchTruckProps {
  routeId: string;
  truckIdx: number;
  onSwitch: (truckIdx: number) => void;
}

export function SwitchTruck({ routeId, truckIdx, onSwitch }: SwitchTruckProps) {
  const trucks = TRUCK_DATA[routeId];
  if (!trucks) return null;

  const total = trucks.length;
  const truck = trucks[truckIdx];
  if (!truck) return null;

  const prev = () => onSwitch((truckIdx - 1 + total) % total);
  const next = () => onSwitch((truckIdx + 1) % total);

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-200">
      <div className="flex items-center gap-0 rounded-full bg-gray-950/70 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] px-1.5 py-1.5">

        <button
          onClick={prev}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-blue-500/20 transition-colors group"
          aria-label="Previous truck"
        >
          <ChevronLeft size={16} className="text-white/50 group-hover:text-blue-400 transition-colors" />
        </button>

        <div className="w-px h-5 bg-white/10 mx-1" />

        <div className="flex flex-col items-center px-4 min-w-[140px]">
          <div className="flex items-center gap-1 mb-0.5">
            <Truck size={9} className="text-blue-400" />
            <span className="text-[9px] font-bold text-blue-400 tracking-widest uppercase">
              {truck.id}
            </span>
            <span className="text-[9px] text-white/20 ml-1">{truckIdx + 1}/{total}</span>
          </div>
          <span className="text-sm font-semibold text-white/85 whitespace-nowrap leading-tight">
            {truck.plate}
          </span>
        </div>

        <div className="w-px h-5 bg-white/10 mx-1" />

        <button
          onClick={next}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-blue-500/20 transition-colors group"
          aria-label="Next truck"
        >
          <ChevronRight size={16} className="text-white/50 group-hover:text-blue-400 transition-colors" />
        </button>

      </div>
    </div>
  );
}
