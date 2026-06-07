import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface MapActionsContextType {
  onOverviewClick?: () => void;
  setOverviewClick: (fn: (() => void) | undefined) => void;
  onOverviewReady?: () => void;
  setOnOverviewReady: (fn: (() => void) | undefined) => void;
  followTruck?: (routeId: string, truckIdx: number) => void;
  setFollowTruck: (fn: ((routeId: string, truckIdx: number) => void) | undefined) => void;
  onMapTruckClick?: (routeId: string, truckIdx: number) => void;
  setOnMapTruckClick: (fn: ((routeId: string, truckIdx: number) => void) | undefined) => void;
  flyToLocation?: (lng: number, lat: number) => void;
  setFlyToLocation: (fn: ((lng: number, lat: number) => void) | undefined) => void;
  showPlannedRoute?: (from: [number, number], to: [number, number]) => void;
  setShowPlannedRoute: (fn: ((from: [number, number], to: [number, number]) => void) | undefined) => void;
  clearPlannedRoute?: () => void;
  setClearPlannedRoute: (fn: (() => void) | undefined) => void;
}

const MapActionsContext = createContext<MapActionsContextType>({
  setOverviewClick: () => {},
  setOnOverviewReady: () => {},
  setFollowTruck: () => {},
  setOnMapTruckClick: () => {},
  setFlyToLocation: () => {},
  setShowPlannedRoute: () => {},
  setClearPlannedRoute: () => {},
});

export function MapActionsProvider({ children }: { children: ReactNode }) {
  const [onOverviewClick, setOnOverviewClick] = useState<(() => void) | undefined>(undefined);
  const [onOverviewReady, setOnOverviewReadyState] = useState<(() => void) | undefined>(undefined);
  const [followTruck, setFollowTruckState] = useState<((routeId: string, truckIdx: number) => void) | undefined>(undefined);
  const [onMapTruckClick, setOnMapTruckClickState] = useState<((routeId: string, truckIdx: number) => void) | undefined>(undefined);
  const [flyToLocation, setFlyToLocationState] = useState<((lng: number, lat: number) => void) | undefined>(undefined);
  const [showPlannedRoute, setShowPlannedRouteState] = useState<((from: [number, number], to: [number, number]) => void) | undefined>(undefined);
  const [clearPlannedRoute, setClearPlannedRouteState] = useState<(() => void) | undefined>(undefined);

  const setOverviewClick = useCallback((fn: (() => void) | undefined) => {
    setOnOverviewClick(() => fn);
  }, []);

  const setOnOverviewReady = useCallback((fn: (() => void) | undefined) => {
    setOnOverviewReadyState(() => fn);
  }, []);

  const setFollowTruck = useCallback((fn: ((routeId: string, truckIdx: number) => void) | undefined) => {
    setFollowTruckState(() => fn);
  }, []);

  const setOnMapTruckClick = useCallback((fn: ((routeId: string, truckIdx: number) => void) | undefined) => {
    setOnMapTruckClickState(() => fn);
  }, []);

  const setFlyToLocation = useCallback((fn: ((lng: number, lat: number) => void) | undefined) => {
    setFlyToLocationState(() => fn);
  }, []);

  const setShowPlannedRoute = useCallback((fn: ((from: [number, number], to: [number, number]) => void) | undefined) => {
    setShowPlannedRouteState(() => fn);
  }, []);

  const setClearPlannedRoute = useCallback((fn: (() => void) | undefined) => {
    setClearPlannedRouteState(() => fn);
  }, []);

  return (
    <MapActionsContext.Provider value={{ onOverviewClick, setOverviewClick, onOverviewReady, setOnOverviewReady, followTruck, setFollowTruck, onMapTruckClick, setOnMapTruckClick, flyToLocation, setFlyToLocation, showPlannedRoute, setShowPlannedRoute, clearPlannedRoute, setClearPlannedRoute }}>
      {children}
    </MapActionsContext.Provider>
  );
}

export function useMapActions() {
  return useContext(MapActionsContext);
}
