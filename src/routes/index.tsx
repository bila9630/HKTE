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
  const { setOverviewClick } = useMapActions();

  useEffect(() => {
    setOverviewClick(() => mapRef.current?.flyToHongKong());
    return () => setOverviewClick(undefined);
  }, [setOverviewClick]);

  return <Map ref={mapRef} />;
}
