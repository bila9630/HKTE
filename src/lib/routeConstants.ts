export const TRUCK_DATA: Record<
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
  ],
  yantian: [
    { id: "YT-01", plate: "粤B·D4418", battery: 88, status: "delivering", speed: 41, trips: 4 },
    { id: "YT-02", plate: "粤B·F6623", battery: 34, status: "returning", speed: 58, trips: 2 },
    { id: "YT-03", plate: "粤B·H1190", battery: 71, status: "delivering", speed: 43, trips: 3 },
  ],
  nanshan: [
    { id: "NS-01", plate: "粤B·J8845", battery: 56, status: "delivering", speed: 39, trips: 2 },
    { id: "NS-02", plate: "粤B·L2278", battery: 22, status: "delivering", speed: 0, trips: 1 },
    { id: "NS-03", plate: "粤B·N9934", battery: 81, status: "returning", speed: 51, trips: 3 },
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
