import { DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, LabelList, ResponsiveContainer, Cell } from "recharts";

const REVENUE_DATA = [
  { name: "Mon",   value: 18500, isEstimate: false },
  { name: "Tue",   value: 22300, isEstimate: false },
  { name: "Wed",   value: 19800, isEstimate: false },
  { name: "Thu",   value: 25100, isEstimate: false },
  { name: "Today", value: 21000, isEstimate: true  },
];

const totalActual = REVENUE_DATA.filter((d) => !d.isEstimate).reduce((s, d) => s + d.value, 0);

export function RevenueCard() {
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
          <h2 className="text-sm font-bold text-white leading-tight">This Week's Revenue</h2>
          <p className="text-[10px] text-white/40 mt-0.5">Daily V2G revenue (HKD)</p>
        </div>

        <div className="px-2 pb-3" style={{ height: 170 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REVENUE_DATA} barCategoryGap="20%" margin={{ top: 18 }}>
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
                width={34}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
              />
              <Bar dataKey="value" radius={[3, 3, 0, 0]} name="Revenue">
                {REVENUE_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.isEstimate ? "#3b82f6" : "#22c55e"} />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  formatter={(v: number) => `${(v / 1000).toFixed(1)}k`}
                  style={{ fill: "rgba(255,255,255,0.5)", fontSize: 9 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="h-px bg-white/8 mx-4" />

        <div className="px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] text-white/50">Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-[10px] text-white/50">Estimated</span>
            </div>
          </div>
          <span className="text-[10px] text-white/30">
            Total: HKD {totalActual.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
