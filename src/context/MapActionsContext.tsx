import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface MapActionsContextType {
  onOverviewClick?: () => void;
  setOverviewClick: (fn: (() => void) | undefined) => void;
  focusRoute?: (routeId: string) => void;
  setFocusRoute: (fn: ((routeId: string) => void) | undefined) => void;
  followTruck?: (routeId: string, truckIdx: number) => void;
  setFollowTruck: (fn: ((routeId: string, truckIdx: number) => void) | undefined) => void;
}

const MapActionsContext = createContext<MapActionsContextType>({
  setOverviewClick: () => {},
  setFocusRoute: () => {},
  setFollowTruck: () => {},
});

export function MapActionsProvider({ children }: { children: ReactNode }) {
  const [onOverviewClick, setOnOverviewClick] = useState<(() => void) | undefined>(undefined);
  const [focusRoute, setFocusRouteState] = useState<((routeId: string) => void) | undefined>(undefined);
  const [followTruck, setFollowTruckState] = useState<((routeId: string, truckIdx: number) => void) | undefined>(undefined);

  const setOverviewClick = useCallback((fn: (() => void) | undefined) => {
    setOnOverviewClick(() => fn);
  }, []);

  const setFocusRoute = useCallback((fn: ((routeId: string) => void) | undefined) => {
    setFocusRouteState(() => fn);
  }, []);

  const setFollowTruck = useCallback((fn: ((routeId: string, truckIdx: number) => void) | undefined) => {
    setFollowTruckState(() => fn);
  }, []);

  return (
    <MapActionsContext.Provider value={{ onOverviewClick, setOverviewClick, focusRoute, setFocusRoute, followTruck, setFollowTruck }}>
      {children}
    </MapActionsContext.Provider>
  );
}

export function useMapActions() {
  return useContext(MapActionsContext);
}
