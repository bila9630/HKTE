import { Bell, CheckCircle, Zap, BatteryCharging, Clock, AlertTriangle, ArrowRight } from "lucide-react";

type ActivityType = "arrived" | "discharging" | "charging" | "break" | "alert" | "departed";

interface FleetActivity {
  id: string;
  type: ActivityType;
  message: string;
  time: string;
  unread: boolean;
}

const ACTIVITIES: FleetActivity[] = [
  { id: "a1", type: "arrived",     message: "YT-01 arrived at Wan Chai",                       time: "2 min ago",  unread: true  },
  { id: "a2", type: "discharging", message: "SZ-02 discharging at Kwai Chung Grid Station",    time: "11 min ago", unread: true  },
  { id: "a3", type: "charging",    message: "NS-02 charging at Shekou V2G Hub",                time: "18 min ago", unread: false },
  { id: "a4", type: "break",       message: "SZ-01 driver on scheduled break",                 time: "34 min ago", unread: false },
  { id: "a5", type: "alert",       message: "YT-02 battery low (34%) — approaching hub",       time: "52 min ago", unread: false },
  { id: "a6", type: "departed",    message: "NS-03 departed Stonecutters Grid Station",         time: "1 hr ago",   unread: false },
];

const TYPE_CONFIG: Record<ActivityType, { icon: React.ElementType; color: string; bg: string }> = {
  arrived:     { icon: CheckCircle,     color: "text-green-400",  bg: "bg-green-400/10"  },
  discharging: { icon: Zap,             color: "text-yellow-400", bg: "bg-yellow-400/10" },
  charging:    { icon: BatteryCharging, color: "text-blue-400",   bg: "bg-blue-400/10"   },
  break:       { icon: Clock,           color: "text-orange-400", bg: "bg-orange-400/10" },
  alert:       { icon: AlertTriangle,   color: "text-red-400",    bg: "bg-red-400/10"    },
  departed:    { icon: ArrowRight,      color: "text-white/40",   bg: "bg-white/5"       },
};

const unreadCount = ACTIVITIES.filter((a) => a.unread).length;

export function FleetActivityCard() {
  return (
    <div className="absolute bottom-6 right-6 z-50 w-72 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="rounded-2xl border border-white/10 bg-gray-950/80 backdrop-blur-xl overflow-hidden">

        {/* Header */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bell size={13} className="text-white/50" />
            <span className="text-sm font-bold text-white">Fleet Activity</span>
          </div>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-[10px] font-bold text-blue-400">
              {unreadCount} new
            </span>
          )}
        </div>

        <div className="h-px bg-white/8 mx-4" />

        {/* Activity list */}
        <div className="flex flex-col divide-y divide-white/5 max-h-72 overflow-y-auto">
          {ACTIVITIES.map((activity) => {
            const { icon: Icon, color, bg } = TYPE_CONFIG[activity.type];
            return (
              <div key={activity.id} className="px-4 py-3 flex gap-3 items-start">
                <div className={`shrink-0 w-7 h-7 rounded-full ${bg} flex items-center justify-center mt-0.5`}>
                  <Icon size={13} className={color} />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                  <p className="text-[11px] text-white/80 leading-snug">{activity.message}</p>
                  <span className="text-[10px] text-white/30">{activity.time}</span>
                </div>
                {activity.unread && (
                  <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
