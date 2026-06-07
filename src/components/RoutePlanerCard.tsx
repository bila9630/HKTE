import { MapPin, Navigation, ChevronDownIcon, Search, X, CheckCircle2, Route as RouteIcon, Clock, ArrowRight, Zap, BatteryLow } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMapActions } from "@/context/MapActionsContext";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibWFwYm94OTYzMCIsImEiOiJjbWh4Y2lpOXAwMHZiMmxzOWVtaW1weTZvIn0.1lj2lcLygace2d9gcLnVMA";

interface Suggestion {
  place_name: string;
  center: [number, number];
}

function useMapboxAutocomplete(query: string) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(() => {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&autocomplete=true&limit=4&proximity=114.1694,22.3193`;
      fetch(url)
        .then((r) => r.json())
        .then((data) => {
          setSuggestions(
            (data.features ?? []).map((f: any) => ({
              place_name: f.place_name,
              center: f.center,
            }))
          );
        })
        .catch(() => setSuggestions([]));
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  return suggestions;
}

interface RoutePlanerCardProps {
  onClose?: () => void;
}

export function RoutePlanerCard({ onClose }: RoutePlanerCardProps) {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [startCoords, setStartCoords] = useState<[number, number] | null>(null);
  const [destCoords, setDestCoords] = useState<[number, number] | null>(null);
  const [startFocused, setStartFocused] = useState(false);
  const [destFocused, setDestFocused] = useState(false);
  const [planned, setPlanned] = useState(false);
  const [success, setSuccess] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [open, setOpen] = useState(false);
  const { flyToLocation, showPlannedRoute, clearPlannedRoute, onOverviewClick } = useMapActions();

  const startSuggestions = useMapboxAutocomplete(startFocused ? start : "");
  const destSuggestions = useMapboxAutocomplete(destFocused ? destination : "");

  const handleSelectStart = (s: Suggestion) => {
    setStart(s.place_name);
    setStartFocused(false);
    setStartCoords(s.center);
    flyToLocation?.(s.center[0], s.center[1]);
  };

  const handleSelectDest = (s: Suggestion) => {
    setDestination(s.place_name);
    setDestFocused(false);
    setDestCoords(s.center);
    flyToLocation?.(s.center[0], s.center[1]);
  };

  const handlePlan = () => {
    if (startCoords && destCoords) {
      if (!planned) {
        showPlannedRoute?.(startCoords, destCoords);
        setPlanned(true);
      } else {
        setSuccess(true);
      }
    }
  };

  const handleClose = () => {
    clearPlannedRoute?.();
    onOverviewClick?.();
    onClose?.();
  };

  if (success) {
    return (
      <div className="absolute bottom-6 left-6 z-50 w-80 animate-in fade-in slide-in-from-left-4 duration-300">
        <div className="rounded-2xl border border-white/10 bg-gray-950/80 backdrop-blur-xl overflow-hidden">
          <div className="px-6 py-8 flex flex-col items-center text-center gap-3">
            <div className="rounded-full bg-green-500/10 p-3">
              <CheckCircle2 className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="text-base font-bold text-white">Route Planned!</h2>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Your route has been scheduled successfully. A truck will be assigned to this route.
            </p>
            <button
              onClick={handleClose}
              className="mt-2 flex items-center justify-center gap-2 w-full h-8 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors text-white text-[12px] font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Helper to get short name from place_name
  const shortName = (name: string) => {
    const parts = name.split(",");
    return parts[0]?.trim() || name;
  };

  return (
    <>
      {/* Journey Preview Card - top right */}
      {planned && (
        <div className="absolute top-6 right-6 z-50 w-72 animate-in fade-in slide-in-from-right-4 duration-300">
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
              {[
                { type: "origin" as const, label: "Origin", address: shortName(start) },
                { type: "stop" as const, label: "Stop 1", address: "V2G Charging Hub", action: "Charge to 80%" },
                { type: "stop" as const, label: "Stop 2", address: "Grid Discharge Station", action: "Discharge to 30%" },
                { type: "destination" as const, label: "Destination", address: shortName(destination) },
              ].map((stop, idx, arr) => {
                const isLast = idx === arr.length - 1;
                const isEndpoint = stop.type === "origin" || stop.type === "destination";

                return (
                  <div key={idx} className="flex gap-3">
                    {/* Timeline spine */}
                    <div className="flex flex-col items-center shrink-0" style={{ width: 16 }}>
                      <div
                        className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 ${
                          isEndpoint
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
                          isEndpoint ? "text-blue-400" : "text-white/40"
                        }`}
                      >
                        {stop.label}
                      </span>
                      <span className="text-[11px] font-medium text-white/80">{stop.address}</span>
                      {stop.action && (
                        <div className="flex items-center gap-1 mt-0.5">
                          {stop.action.toLowerCase().startsWith("discharge") ? (
                            <BatteryLow size={9} className="text-blue-400" />
                          ) : (
                            <Zap size={9} className="text-yellow-400" />
                          )}
                          <span className={`text-[10px] font-medium ${
                            stop.action.toLowerCase().startsWith("discharge") ? "text-blue-400" : "text-yellow-400"
                          }`}>
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
      )}

      {/* Main planner card - bottom left */}
      <div className="absolute bottom-6 left-6 z-50 w-80 animate-in slide-in-from-left-4 fade-in duration-200">
        <div className="rounded-2xl border border-white/10 bg-gray-950/80 backdrop-blur-xl">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <Navigation size={12} className="text-blue-400 shrink-0" />
              <span className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase">
                Route Planner
              </span>
            </div>
            <h2 className="text-base font-bold text-white leading-tight">Plan your route</h2>
          </div>
          {onClose && (
            <button
              onClick={handleClose}
              className="rounded-md p-1 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/8 mx-4" />

        {/* Fields */}
        <div className="px-4 py-3 flex flex-col gap-3">
          {/* Start */}
          <div className="relative flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <MapPin size={12} className="text-green-400 shrink-0" />
              <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                Start
              </span>
            </div>
            <Input
              type="text"
              placeholder="Enter start address"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              onFocus={() => setStartFocused(true)}
              onBlur={() => setTimeout(() => setStartFocused(false), 200)}
              className="h-8 bg-white/5 border-white/10 text-white placeholder:text-white/25 text-[12px] focus-visible:ring-blue-500/50"
            />
            {startFocused && startSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-white/10 bg-gray-950/95 backdrop-blur-xl overflow-hidden z-50">
                {startSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onMouseDown={() => handleSelectStart(s)}
                    className="w-full text-left px-3 py-2 text-[11px] text-white/80 hover:bg-white/10 transition-colors truncate"
                  >
                    {s.place_name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Destination */}
          <div className="relative flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <MapPin size={12} className="text-red-400 shrink-0" />
              <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                Destination
              </span>
            </div>
            <Input
              type="text"
              placeholder="Enter destination address"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              onFocus={() => setDestFocused(true)}
              onBlur={() => setTimeout(() => setDestFocused(false), 200)}
              className="h-8 bg-white/5 border-white/10 text-white placeholder:text-white/25 text-[12px] focus-visible:ring-blue-500/50"
            />
            {destFocused && destSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-white/10 bg-gray-950/95 backdrop-blur-xl overflow-hidden z-50">
                {destSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onMouseDown={() => handleSelectDest(s)}
                    className="w-full text-left px-3 py-2 text-[11px] text-white/80 hover:bg-white/10 transition-colors truncate"
                  >
                    {s.place_name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Date & Time - shown after planning */}
          {planned && (
          <div className="flex gap-2">
            {/* Date picker */}
            <div className="flex flex-col gap-1.5 flex-1">
              <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                Date
              </span>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-8 w-full justify-between bg-white/5 border-white/10 text-[12px] font-normal text-white/70 hover:bg-white/10 hover:text-white px-3"
                  >
                    {date ? format(date, "MMM d, yyyy") : "Select date"}
                    <ChevronDownIcon size={12} className="text-white/40" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    captionLayout="dropdown"
                    defaultMonth={date}
                    onSelect={(d) => {
                      setDate(d);
                      setOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time picker */}
            <div className="flex flex-col gap-1.5 w-24">
              <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                Time
              </span>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="h-8 bg-white/5 border-white/10 text-white/70 text-[12px] focus-visible:ring-blue-500/50 scheme-dark appearance-none [&::-webkit-calendar-picker-indicator]:hidden"
              />
            </div>
          </div>
          )}

          {/* Plan button */}
          <button
            onClick={handlePlan}
            disabled={!startCoords || !destCoords}
            className="mt-1 flex items-center justify-center gap-2 w-full h-8 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-white text-[12px] font-semibold"
          >
            <Navigation size={13} />
            {planned ? "Plan" : "Preview"}
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
