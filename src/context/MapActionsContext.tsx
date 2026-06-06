import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface MapActionsContextType {
  onOverviewClick?: () => void;
  setOverviewClick: (fn: (() => void) | undefined) => void;
}

const MapActionsContext = createContext<MapActionsContextType>({
  setOverviewClick: () => {},
});

export function MapActionsProvider({ children }: { children: ReactNode }) {
  const [onOverviewClick, setOnOverviewClick] = useState<(() => void) | undefined>(undefined);

  const setOverviewClick = useCallback((fn: (() => void) | undefined) => {
    setOnOverviewClick(() => fn);
  }, []);

  return (
    <MapActionsContext.Provider value={{ onOverviewClick, setOverviewClick }}>
      {children}
    </MapActionsContext.Provider>
  );
}

export function useMapActions() {
  return useContext(MapActionsContext);
}
