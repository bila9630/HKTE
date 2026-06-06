import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import Map, { MapHandle } from "../components/Map";
import { useMapActions } from "../context/MapActionsContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Map" },
      { name: "description", content: "An immersive 3D map experience." },
      { property: "og:title", content: "Map" },
      { property: "og:description", content: "An immersive 3D map experience." },
    ],
  }),
  component: Index,
});

function Index() {
  const mapRef = useRef<MapHandle>(null);
  const { setOverviewClick, setFocusRoute, setFollowTruck } = useMapActions();

  useEffect(() => {
    setOverviewClick(() => mapRef.current?.flyToHongKong());
    return () => setOverviewClick(undefined);
  }, [setOverviewClick]);

  useEffect(() => {
    setFocusRoute((routeId: string) => mapRef.current?.focusRoute(routeId));
    return () => setFocusRoute(undefined);
  }, [setFocusRoute]);

  useEffect(() => {
    setFollowTruck((routeId: string, truckIdx: number) => mapRef.current?.followTruck(routeId, truckIdx));
    return () => setFollowTruck(undefined);
  }, [setFollowTruck]);

  return <Map ref={mapRef} />;
}
