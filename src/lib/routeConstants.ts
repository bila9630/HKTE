export const TRUCK_DATA: Record<
  string,
  {
    id: string;
    plate: string;
    battery: number;
    status: "delivering" | "returning" | "charging";
    speed: number;
    trips: number;
    color: string;
  }[]
> = {
  sz: [
    { id: "SZ-01", plate: "粤B·T2841", battery: 78, status: "delivering", speed: 45, trips: 3, color: "#f59e0b" },
    { id: "SZ-02", plate: "粤B·K9012", battery: 45, status: "returning", speed: 52, trips: 2, color: "#fb923c" },
    { id: "SZ-03", plate: "粤B·M3356", battery: 92, status: "delivering", speed: 38, trips: 4, color: "#ef4444" },
  ],
  yantian: [
    { id: "YT-01", plate: "粤B·D4418", battery: 88, status: "delivering", speed: 41, trips: 4, color: "#10b981" },
    { id: "YT-02", plate: "粤B·F6623", battery: 34, status: "returning", speed: 58, trips: 2, color: "#06b6d4" },
    { id: "YT-03", plate: "粤B·H1190", battery: 71, status: "delivering", speed: 43, trips: 3, color: "#3b82f6" },
  ],
  nanshan: [
    { id: "NS-01", plate: "粤B·J8845", battery: 56, status: "delivering", speed: 39, trips: 2, color: "#8b5cf6" },
    { id: "NS-02", plate: "粤B·L2278", battery: 22, status: "delivering", speed: 0, trips: 1, color: "#ec4899" },
    { id: "NS-03", plate: "粤B·N9934", battery: 81, status: "returning", speed: 51, trips: 3, color: "#f43f5e" },
  ],
};

export const ROUTE_NAMES: Record<string, string> = {
  sz: "Shenzhen → Central",
  yantian: "Yantian → Wan Chai",
  nanshan: "Nanshan → Tsim Sha Tsui",
};

export const ROUTE_ORIGINS: Record<string, string> = {
  sz: "Shenzhen Port",
  yantian: "Yantian Port",
  nanshan: "Nanshan Port",
};

export const ROUTE_DESTINATIONS: Record<string, string> = {
  sz: "Central, Hong Kong",
  yantian: "Wan Chai, Hong Kong",
  nanshan: "Tsim Sha Tsui, Hong Kong",
};

export type StopType = "origin" | "stop" | "destination";

export interface RouteStop {
  type: StopType;
  label: string;
  address: string;
  action?: string;
}

export const ROUTE_STOPS: Record<string, RouteStop[]> = {
  sz: [
    { type: "origin", label: "Origin", address: "Shenzhen Port" },
    { type: "stop", label: "Stop 1", address: "Lok Ma Chau V2G Hub", action: "Charge to 80%" },
    { type: "stop", label: "Stop 2", address: "Kwai Chung Grid Station", action: "Discharge to 30%" },
    { type: "destination", label: "Destination", address: "Central, Hong Kong" },
  ],
  yantian: [
    { type: "origin", label: "Origin", address: "Yantian Port" },
    { type: "stop", label: "Stop 1", address: "Sha Tau Kok V2G Hub", action: "Charge to 75%" },
    { type: "stop", label: "Stop 2", address: "Kwun Tong Grid Station", action: "Discharge to 25%" },
    { type: "destination", label: "Destination", address: "Wan Chai, Hong Kong" },
  ],
  nanshan: [
    { type: "origin", label: "Origin", address: "Nanshan Port" },
    { type: "stop", label: "Stop 1", address: "Shekou V2G Hub", action: "Charge to 80%" },
    { type: "stop", label: "Stop 2", address: "Stonecutters Grid Station", action: "Discharge to 30%" },
    { type: "destination", label: "Destination", address: "Tsim Sha Tsui, Hong Kong" },
  ],
};
