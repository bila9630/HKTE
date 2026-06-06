import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface MapActionsContextType {
  onOverviewClick?: () => void;
  setOverviewClick: (fn: (() => void) | undefined) => void;
  focusRoute?: (routeId: string) => void;
  setFocusRoute: (fn: ((routeId: string) => void) | undefined) => void;
}

const MapActionsContext = createContext<MapActionsContextType>({
  setOverviewClick: () => {},
  setFocusRoute: () => {},
});

export function MapActionsProvider({ children }: { children: ReactNode }) {
  const [onOverviewClick, setOnOverviewClick] = useState<(() => void) | undefined>(undefined);
  const [focusRoute, setFocusRouteState] = useState<((routeId: string) => void) | undefined>(undefined);

  const setOverviewClick = useCallback((fn: (() => void) | undefined) => {
    setOnOverviewClick(() => fn);
  }, []);

  const setFocusRoute = useCallback((fn: ((routeId: string) => void) | undefined) => {
    setFocusRouteState(() => fn);
  }, []);

  return (
    <MapActionsContext.Provider value={{ onOverviewClick, setOverviewClick, focusRoute, setFocusRoute }}>
      {children}
    </MapActionsContext.Provider>
  );
}

export function useMapActions() {
  return useContext(MapActionsContext);
}
