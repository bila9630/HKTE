import { X, Truck, MapPin, Route as RouteIcon, Zap } from "lucide-react";
import { ROUTE_CONFIGS } from "@/lib/truckRoutes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const ENERGY_DATA = [
  { time: "6am", kwh: 12 },
  { time: "8am", kwh: 28 },
  { time: "10am", kwh: 45 },
  { time: "12pm", kwh: 67 },
  { time: "2pm", kwh: 89 },
  { time: "4pm", kwh: 124 },
  { time: "6pm", kwh: 156 },
];

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
    <div className="fixed top-6 left-6 z-50 w-72 animate-in slide-in-from-left-4 fade-in duration-300">
      <div className="rounded-xl border border-white/10 bg-gray-900/70 backdrop-blur-xl shadow-2xl">
        {/* Header with route dropdown */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span
              className="inline-block h-3 w-3 rounded-full shrink-0"
              style={{ backgroundColor: route.lineColor }}
            />
            <Select value={routeId} onValueChange={(val) => onRouteChange?.(val)}>
              <SelectTrigger className="h-auto border-none bg-transparent p-0 text-sm font-semibold text-white shadow-none ring-0 focus:ring-0 hover:text-blue-300 transition-colors [&>svg]:text-gray-400 [&>svg]:h-3.5 [&>svg]:w-3.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-white/10 backdrop-blur-xl">
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

export function EnergyOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="fixed top-6 right-6 z-50 w-80 animate-in slide-in-from-right-4 fade-in duration-300">
      <div className="rounded-xl border border-white/10 bg-gray-900/70 backdrop-blur-xl shadow-2xl">
        <div className="px-4 pt-4 pb-3">
          <p className="text-sm font-semibold text-white flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" /> Energy Delivered Today
          </p>
        </div>
        <div className="px-4 pb-4">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ENERGY_DATA} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
                <XAxis
                  dataKey="time"
                  stroke="#6b7280"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  unit=" kWh"
                  width={50}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(17, 24, 39, 0.9)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "0.5rem",
                    fontSize: "12px",
                    color: "#fff",
                  }}
                  labelStyle={{ color: "#9ca3af" }}
                  formatter={(value: number) => [`${value} kWh`, "Sold"]}
                />
                <Bar dataKey="kwh" fill="#facc15" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
