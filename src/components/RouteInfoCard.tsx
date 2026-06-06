import { DollarSign } from "lucide-react";
import { ROUTE_ORIGINS, ROUTE_DESTINATIONS } from "@/lib/routeConstants";

interface RouteInfoCardProps {
  routeId: string | null;
}

const ROUTE_EARNINGS: Record<string, number> = {
  sz: 90,
  yantian: 90,
  nanshan: 90,
};

export function RouteInfoCard({ routeId }: RouteInfoCardProps) {
  if (!routeId) return null;

  const origin = ROUTE_ORIGINS[routeId];
  const destination = ROUTE_DESTINATIONS[routeId];
  const earning = ROUTE_EARNINGS[routeId];

  if (!origin || !destination) return null;

  return (
    <div className="absolute top-6 left-6 z-50 w-72 animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="rounded-2xl border border-white/10 bg-gray-950/80 backdrop-blur-xl px-4 py-3 flex flex-col gap-2.5">
        {/* Route headline */}
        <h2 className="text-sm font-bold text-white leading-snug">
          {origin} <span className="text-white/30">—</span> {destination}
        </h2>

        {/* Divider */}
        <div className="h-px bg-white/8" />

        {/* Expected Earning */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <DollarSign size={12} className="text-white/40" />
            <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
              Expected Earning
            </span>
          </div>
          <span className="text-[11px] text-green-400 font-semibold">HK${earning}</span>
        </div>
      </div>
    </div>
  );
}
