import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface MapActionsContextType {
  onOverviewClick?: () => void;
  setOverviewClick: (fn: (() => void) | undefined) => void;
  followTruck?: (routeId: string, truckIdx: number) => void;
  setFollowTruck: (fn: ((routeId: string, truckIdx: number) => void) | undefined) => void;
  onMapTruckClick?: (routeId: string, truckIdx: number) => void;
  setOnMapTruckClick: (fn: ((routeId: string, truckIdx: number) => void) | undefined) => void;
}

const MapActionsContext = createContext<MapActionsContextType>({
  setOverviewClick: () => {},
  setFollowTruck: () => {},
  setOnMapTruckClick: () => {},
});

export function MapActionsProvider({ children }: { children: ReactNode }) {
  const [onOverviewClick, setOnOverviewClick] = useState<(() => void) | undefined>(undefined);
  const [followTruck, setFollowTruckState] = useState<((routeId: string, truckIdx: number) => void) | undefined>(undefined);
  const [onMapTruckClick, setOnMapTruckClickState] = useState<((routeId: string, truckIdx: number) => void) | undefined>(undefined);

  const setOverviewClick = useCallback((fn: (() => void) | undefined) => {
    setOnOverviewClick(() => fn);
  }, []);

  const setFollowTruck = useCallback((fn: ((routeId: string, truckIdx: number) => void) | undefined) => {
    setFollowTruckState(() => fn);
  }, []);

  const setOnMapTruckClick = useCallback((fn: ((routeId: string, truckIdx: number) => void) | undefined) => {
    setOnMapTruckClickState(() => fn);
  }, []);

  return (
    <MapActionsContext.Provider value={{ onOverviewClick, setOverviewClick, followTruck, setFollowTruck, onMapTruckClick, setOnMapTruckClick }}>
      {children}
    </MapActionsContext.Provider>
  );
}

export function useMapActions() {
  return useContext(MapActionsContext);
}
