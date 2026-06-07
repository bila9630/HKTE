import { Zap, Leaf, Target } from "lucide-react";

const TARGET_MWH = 10;
const CURRENT_MWH = 6.2;
const CO2_OFFSET_T = 3.1;

const r = 45;
const circ = 2 * Math.PI * r;
const arcLen = circ * 0.75; // 270° arc, gap at bottom
const gapLen = circ - arcLen;
const progress = CURRENT_MWH / TARGET_MWH;
const progressLen = arcLen * progress;

const SESSIONS = [
  { truck: "YT-02", hub: "Sha Tau Kok V2G Hub", energy: "1.8 MWh", revenue: "HK$3,240", type: "discharge" as const },
  { truck: "NS-02", hub: "Shekou V2G Hub", energy: "0.9 MWh", revenue: "HK$1,620", type: "charge" as const },
  { truck: "SZ-02", hub: "Kwai Chung Grid Station", energy: "2.1 MWh", revenue: "HK$3,780", type: "discharge" as const },
  { truck: "YT-02", hub: "Kwun Tong Grid Station", energy: "1.4 MWh", revenue: "HK$2,520", type: "discharge" as const },
];

export function GridContributionCard() {
  return (
    <div className="absolute bottom-6 right-6 z-50 w-72 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="rounded-2xl border border-white/10 bg-gray-950/80 backdrop-blur-xl overflow-hidden">

        {/* Header */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Zap size={13} className="text-white/50" />
            <span className="text-sm font-bold text-white">Grid Contribution</span>
          </div>
          <span className="text-[9px] font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">
            On Track
          </span>
        </div>

        <div className="h-px bg-white/8 mx-4" />

        {/* Gauge + stats row */}
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Circular gauge */}
          <div className="relative shrink-0">
            <svg width="90" height="90" viewBox="0 0 120 120">
              {/* Track */}
              <circle
                cx="60" cy="60" r={r}
                fill="none"
                stroke="rgba(255,255,255,0.07)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${arcLen} ${gapLen}`}
                transform="rotate(135 60 60)"
              />
              {/* Progress */}
              <circle
                cx="60" cy="60" r={r}
                fill="none"
                stroke="#22c55e"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${progressLen} ${circ - progressLen}`}
                transform="rotate(135 60 60)"
                style={{ filter: "drop-shadow(0 0 5px rgba(34,197,94,0.5))" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[13px] font-bold text-white tabular-nums leading-none">{CURRENT_MWH}</span>
              <span className="text-[8px] text-white/35 mt-0.5">/ {TARGET_MWH} MWh</span>
            </div>
          </div>

          {/* Right stats */}
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1 mb-0.5">
                <Target size={9} className="text-white/30" />
                <span className="text-[9px] text-white/30 uppercase tracking-wider">Daily Target</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1 flex-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-green-400 font-semibold tabular-nums shrink-0">
                  {Math.round(progress * 100)}%
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-1 mb-0.5">
                <Leaf size={9} className="text-white/30" />
                <span className="text-[9px] text-white/30 uppercase tracking-wider">CO₂ Avoided</span>
              </div>
              <span className="text-[11px] text-white/70 font-semibold">{CO2_OFFSET_T} t today</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-white/8 mx-4" />

        {/* V2G Sessions list */}
        <div className="flex flex-col divide-y divide-white/5 max-h-44 overflow-y-auto">
          {SESSIONS.map((s, i) => (
            <div key={i} className="px-4 py-2.5 flex gap-2.5 items-start">
              <div className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                s.type === "discharge" ? "bg-green-400/10" : "bg-blue-400/10"
              }`}>
                <Zap size={10} className={s.type === "discharge" ? "text-green-400" : "text-blue-400"} />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <p className="text-[11px] text-white/80 leading-snug truncate">{s.hub}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-white/30">{s.truck}</span>
                  <span className="text-[9px] text-white/20">·</span>
                  <span className="text-[9px] text-white/30">{s.energy}</span>
                </div>
              </div>
              <span className="shrink-0 text-[9px] font-semibold text-green-400/70">{s.revenue}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
