import { X, Truck, MapPin, Route as RouteIcon } from "lucide-react";
import { ROUTE_CONFIGS } from "@/lib/truckRoutes";

interface RouteInfoOverlayProps {
  routeId: string | null;
  onClose: () => void;
}

const ROUTE_NAMES: Record<string, string> = {
  sz: "Shenzhen → Central",
  yantian: "Yantian → Wan Chai",
  nanshan: "Nanshan → Tsim Sha Tsui",
};

export function RouteInfoOverlay({ routeId, onClose }: RouteInfoOverlayProps) {
  if (!routeId) return null;

  const route = ROUTE_CONFIGS.find((r) => r.id === routeId);
  if (!route) return null;

  const name = ROUTE_NAMES[routeId] ?? routeId;

  // Approximate distance in km (haversine-ish for short distances)
  const dLat = route.to[1] - route.from[1];
  const dLng = route.to[0] - route.from[0];
  const distKm = Math.sqrt(dLat * dLat + dLng * dLng) * 111;

  return (
    <div className="fixed top-6 left-6 z-50 w-72 animate-in slide-in-from-left-4 fade-in duration-300">
      <div className="rounded-xl border border-white/10 bg-gray-900/70 backdrop-blur-xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: route.lineColor }}
            />
            <h3 className="text-sm font-semibold text-white">{name}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-4 pb-4 space-y-3">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Truck className="h-3 w-3" /> Trucks
              </p>
              <p className="text-2xl font-bold text-white">{route.numTrucks}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <RouteIcon className="h-3 w-3" /> Distance
              </p>
              <p className="text-2xl font-bold text-white">{distKm.toFixed(1)} km</p>
            </div>
          </div>

          {/* From / To */}
          <div className="space-y-2 rounded-lg bg-white/5 p-3">
            <div className="flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 mt-0.5 text-green-400" />
              <div>
                <p className="text-xs text-gray-400">Origin</p>
                <p className="text-sm text-white">
                  {route.from[1].toFixed(4)}°N, {route.from[0].toFixed(4)}°E
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="h-3.5 w-3.5 mt-0.5 text-red-400" />
              <div>
                <p className="text-xs text-gray-400">Destination</p>
                <p className="text-sm text-white">
                  {route.to[1].toFixed(4)}°N, {route.to[0].toFixed(4)}°E
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-xs text-green-400 font-medium">Active — All trucks in transit</span>
          </div>
        </div>
      </div>
    </div>
  );
}
