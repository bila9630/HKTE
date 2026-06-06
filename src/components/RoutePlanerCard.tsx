import { MapPin, Navigation, ChevronDownIcon, Search } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function RoutePlanerCard() {
  const [start, setStart] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-10 w-80 animate-in slide-in-from-left-4 fade-in duration-200">
      <div className="rounded-2xl border border-white/10 bg-gray-950/80 backdrop-blur-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Navigation size={12} className="text-blue-400 shrink-0" />
            <span className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase">
              Route Planner
            </span>
          </div>
          <h2 className="text-base font-bold text-white leading-tight">Plan your route</h2>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/8 mx-4" />

        {/* Fields */}
        <div className="px-4 py-3 flex flex-col gap-3">
          {/* Start */}
          <div className="flex flex-col gap-1.5">
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
              className="h-8 bg-white/5 border-white/10 text-white placeholder:text-white/25 text-[12px] focus-visible:ring-blue-500/50"
            />
          </div>

          {/* Destination */}
          <div className="flex flex-col gap-1.5">
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
              className="h-8 bg-white/5 border-white/10 text-white placeholder:text-white/25 text-[12px] focus-visible:ring-blue-500/50"
            />
          </div>

          {/* Date & Time */}
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

          {/* Search button */}
          <button className="mt-1 flex items-center justify-center gap-2 w-full h-8 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors text-white text-[12px] font-semibold">
            <Search size={13} />
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
