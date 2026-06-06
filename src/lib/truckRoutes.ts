export const SPEED = 1 / (500 * 1000); // progress per ms (~500s full traverse)

export const ROUTE_CONFIGS = [
  {
    id: "sz",
    from: [114.0579, 22.5431] as [number, number],
    to: [114.1577, 22.2808] as [number, number], // Central
    lineColor: "#60a5fa",
    truckColor: "#f59e0b",
    numTrucks: 5,
  },
  {
    id: "yantian",
    from: [114.2967, 22.5761] as [number, number],
    to: [114.1822, 22.2783] as [number, number], // Wan Chai
    lineColor: "#34d399",
    truckColor: "#10b981",
    numTrucks: 3,
  },
  {
    id: "nanshan",
    from: [113.933, 22.5346] as [number, number],
    to: [114.1722, 22.2975] as [number, number], // Tsim Sha Tsui
    lineColor: "#a78bfa",
    truckColor: "#8b5cf6",
    numTrucks: 3,
  },
];

export type RouteConfig = (typeof ROUTE_CONFIGS)[number];

// Returns position and bearing (degrees clockwise from north) at progress t along the route
export function getPositionAndBearing(
  coords: [number, number][],
  t: number,
): { position: [number, number]; bearing: number } {
  if (coords.length < 2) return { position: coords[0], bearing: 0 };

  const segLengths: number[] = [];
  let totalLength = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const dx = coords[i + 1][0] - coords[i][0];
    const dy = coords[i + 1][1] - coords[i][1];
    segLengths.push(Math.sqrt(dx * dx + dy * dy));
    totalLength += segLengths[i];
  }

  const target = Math.min(t, 1) * totalLength;
  let accumulated = 0;

  for (let i = 0; i < segLengths.length; i++) {
    if (accumulated + segLengths[i] >= target) {
      const segT = segLengths[i] === 0 ? 0 : (target - accumulated) / segLengths[i];
      const position: [number, number] = [
        coords[i][0] + (coords[i + 1][0] - coords[i][0]) * segT,
        coords[i][1] + (coords[i + 1][1] - coords[i][1]) * segT,
      ];
      const dLng = coords[i + 1][0] - coords[i][0];
      const dLat = coords[i + 1][1] - coords[i][1];
      const bearing = (Math.atan2(dLng, dLat) * 180) / Math.PI;
      return { position, bearing };
    }
    accumulated += segLengths[i];
  }

  return { position: coords[coords.length - 1], bearing: 0 };
}

export function buildTruckCollection(
  coords: [number, number][],
  progress: number[],
  directions: (1 | -1)[],
) {
  return {
    type: "FeatureCollection" as const,
    features: progress.map((t, i) => {
      const { position, bearing } = getPositionAndBearing(coords, t);
      // Flip bearing 180° when travelling in reverse direction
      const rotation = directions[i] === 1 ? bearing : bearing + 180;
      return {
        type: "Feature" as const,
        geometry: { type: "Point" as const, coordinates: position },
        properties: { id: i, bearing: rotation },
      };
    }),
  };
}

export function loadNavArrow(color: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    // Triangle pointing up (north = 0°); Mapbox rotates it by the bearing property
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <polygon points="12,2 22,22 12,16 2,22" fill="${color}" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
    </svg>`;
    const img = new Image(24, 24);
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}
