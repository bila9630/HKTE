import { X, Truck, MapPin, Route as RouteIcon, Battery, Clock, Gauge } from "lucide-react";
import { ROUTE_CONFIGS } from "@/lib/truckRoutes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Mock truck data per route
const TRUCK_DATA: Record<
  string,
  {
    id: string;
    plate: string;
    battery: number;
    status: "delivering" | "returning" | "charging";
    speed: number;
    trips: number;
  }[]
> = {
  sz: [
    { id: "SZ-01", plate: "粤B·T2841", battery: 78, status: "delivering", speed: 45, trips: 3 },
    { id: "SZ-02", plate: "粤B·K9012", battery: 45, status: "returning", speed: 52, trips: 2 },
    { id: "SZ-03", plate: "粤B·M3356", battery: 92, status: "delivering", speed: 38, trips: 4 },
    { id: "SZ-04", plate: "粤B·R7721", battery: 15, status: "charging", speed: 0, trips: 1 },
    { id: "SZ-05", plate: "粤B·A5509", battery: 63, status: "delivering", speed: 47, trips: 3 },
  ],
  yantian: [
    { id: "YT-01", plate: "粤B·D4418", battery: 88, status: "delivering", speed: 41, trips: 4 },
    { id: "YT-02", plate: "粤B·F6623", battery: 34, status: "returning", speed: 58, trips: 2 },
    { id: "YT-03", plate: "粤B·H1190", battery: 71, status: "delivering", speed: 43, trips: 3 },
  ],
  nanshan: [
    { id: "NS-01", plate: "粤B·J8845", battery: 56, status: "delivering", speed: 39, trips: 2 },
    { id: "NS-02", plate: "粤B·L2278", battery: 22, status: "charging", speed: 0, trips: 1 },
    { id: "NS-03", plate: "粤B·N9934", battery: 81, status: "returning", speed: 51, trips: 3 },
  ],
};

interface RouteInfoOverlayProps {
  routeId: string | null;
  onClose: () => void;
  onRouteChange?: (routeId: string) => void;
}

const ROUTE_NAMES: Record<string, string> = {
  sz: "Shenzhen → Central",
  yantian: "Yantian → Wan Chai",
  nanshan: "Nanshan → Tsim Sha Tsui",
};

export function RouteInfoOverlay({ routeId, onClose, onRouteChange }: RouteInfoOverlayProps) {
  if (!routeId) return null;

  const route = ROUTE_CONFIGS.find((r) => r.id === routeId);
  if (!route) return null;

  // Approximate distance in km (haversine-ish for short distances)
  const dLat = route.to[1] - route.from[1];
  const dLng = route.to[0] - route.from[0];
  const distKm = Math.sqrt(dLat * dLat + dLng * dLng) * 111;

  return (
    <div>
      <div className="rounded-2xl border border-white/10 bg-gray-950/80 backdrop-blur-xl overflow-hidden">
        {/* Header with route dropdown */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span
                className="inline-block h-2 w-2 rounded-full shrink-0"
                style={{ backgroundColor: route.lineColor }}
              />
              <span className="text-[10px] font-semibold tracking-widest uppercase shrink-0" style={{ color: route.lineColor }}>Route</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-white/40 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-0.5">
            <Select value={routeId} onValueChange={(val) => onRouteChange?.(val)}>
              <SelectTrigger className="h-auto border-none bg-transparent p-0 text-base font-bold text-white shadow-none ring-0 focus:ring-0 hover:text-blue-300 transition-colors [&>svg]:text-white/40 [&>svg]:h-3 [&>svg]:w-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-950 border-white/10 backdrop-blur-xl">
                {ROUTE_CONFIGS.map((r) => (
                  <SelectItem
                    key={r.id}
                    value={r.id}
                    className="text-white focus:bg-white/10 focus:text-white cursor-pointer"
                  >
                    {ROUTE_NAMES[r.id] ?? r.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/8 mx-4" />

        {/* Content */}
        <div className="px-4 py-3 flex flex-col gap-2.5">
          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <Truck className="h-3 w-3 text-white/40" />
                <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Trucks</span>
              </div>
              <p className="text-xl font-bold text-white">{route.numTrucks}</p>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <RouteIcon className="h-3 w-3 text-white/40" />
                <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Distance</span>
              </div>
              <p className="text-xl font-bold text-white">{distKm.toFixed(1)} km</p>
            </div>
          </div>

          {/* From / To */}
          <div className="h-px bg-white/8" />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-green-400 shrink-0" />
                <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Origin</span>
              </div>
              <span className="text-[11px] text-white/70 font-medium">
                {route.from[1].toFixed(4)}°N, {route.from[0].toFixed(4)}°E
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-red-400 shrink-0" />
                <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Destination</span>
              </div>
              <span className="text-[11px] text-white/70 font-medium">
                {route.to[1].toFixed(4)}°N, {route.to[0].toFixed(4)}°E
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="h-px bg-white/8" />
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-[11px] text-green-400 font-medium">Active — All trucks in transit</span>
          </div>
        </div>
      </div>
    </div>
  );
}

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
        <div className="px-4 py-3 flex flex-col gap-1.5 max-h-52 overflow-y-auto">
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

export function TruckDetailOverlay({ routeId, truckIdx, onClose }: { routeId: string | null; truckIdx: number | null; onClose: () => void }) {
  if (!routeId || truckIdx === null) return null;

  const trucks = TRUCK_DATA[routeId];
  if (!trucks || !trucks[truckIdx]) return null;

  const truck = trucks[truckIdx];

  return (
    <div className="absolute top-6 right-6 z-50 w-80 animate-in slide-in-from-right-4 fade-in duration-300 flex flex-col gap-3">
      {/* Truck Info Card */}
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
          {/* Plate & Status */}
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

          {/* Stats */}
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

          {/* Battery bar */}
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">Battery Level</span>
              <span className="text-[11px] text-white/70 font-medium">{truck.battery}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10">
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${truck.battery}%`,
                  backgroundColor: truck.battery > 50 ? "#4ade80" : truck.battery > 20 ? "#facc15" : "#f87171",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
