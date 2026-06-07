import { DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const ENERGY_DATA = [
  { name: "6am", estimated: 1200, actual: 1100 },
  { name: "8am", estimated: 2800, actual: 2600 },
  { name: "10am", estimated: 3500, actual: 3800 },
  { name: "12pm", estimated: 4000, actual: 4200 },
  { name: "2pm", estimated: 3800, actual: 3500 },
  { name: "4pm", estimated: 3200, actual: 3100 },
  { name: "6pm", estimated: 2500, actual: 2300 },
  { name: "8pm", estimated: 1500, actual: 1400 },
];

export function EnergyChartOverlay() {
  return (
    <div className="absolute top-6 right-6 z-50 w-80 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="rounded-2xl border border-white/10 bg-gray-950/80 backdrop-blur-xl overflow-hidden">
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-1.5 mb-0.5">
            <DollarSign size={10} className="text-green-400 shrink-0" />
            <span className="text-[10px] text-green-400 font-semibold tracking-widest uppercase">
              Revenue
            </span>
          </div>
          <h2 className="text-sm font-bold text-white leading-tight">Today's Revenue</h2>
          <p className="text-[10px] text-white/40 mt-0.5">Estimated vs actual (HKD)</p>
        </div>

        <div className="px-2 pb-3" style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ENERGY_DATA} barGap={2} barCategoryGap="20%">
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 9 }}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15,15,30,0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 8,
                  fontSize: 11,
                  color: "#fff",
                }}
                labelStyle={{ color: "rgba(255,255,255,0.6)" }}
              />
              <Bar dataKey="estimated" radius={[3, 3, 0, 0]} fill="#3b82f6" name="Estimated" />
              <Bar dataKey="actual" radius={[3, 3, 0, 0]} fill="#22c55e" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-px bg-white/8 mx-4" />

        <div className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[10px] text-white/50">Estimated</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] text-white/50">Actual</span>
            </div>
          </div>
          <span className="text-[10px] text-white/30">Today</span>
        </div>
      </div>
    </div>
  );
}
