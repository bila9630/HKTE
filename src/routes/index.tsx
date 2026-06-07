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
  const { setOverviewClick, setFocusRoute, setFollowTruck, setFlyToLocation, setShowPlannedRoute, setClearPlannedRoute, onMapTruckClick } = useMapActions();

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

  useEffect(() => {
    setFlyToLocation((lng: number, lat: number) => mapRef.current?.flyToLocation(lng, lat));
    return () => setFlyToLocation(undefined);
  }, [setFlyToLocation]);

  useEffect(() => {
    setShowPlannedRoute((from: [number, number], to: [number, number]) => mapRef.current?.showPlannedRoute(from, to));
    return () => setShowPlannedRoute(undefined);
  }, [setShowPlannedRoute]);

  useEffect(() => {
    setClearPlannedRoute(() => mapRef.current?.clearPlannedRoute());
    return () => setClearPlannedRoute(undefined);
  }, [setClearPlannedRoute]);

  return <Map ref={mapRef} onTruckClick={(routeId, truckIdx) => onMapTruckClick?.(routeId, truckIdx)} />;
}
