import { useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibWFwYm94OTYzMCIsImEiOiJjbWh4Y2lpOXAwMHZiMmxzOWVtaW1weTZvIn0.1lj2lcLygace2d9gcLnVMA";

const HK_CENTER: [number, number] = [114.1694, 22.3193];

export interface MapHandle {
  flyToHongKong: () => void;
}

const Map = forwardRef<MapHandle, object>(function Map(_, ref) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useImperativeHandle(ref, () => ({
    flyToHongKong: () => {
      if (!mapRef.current) return;
      mapRef.current.flyTo({
        center: HK_CENTER,
        zoom: 11,
        pitch: 45,
        bearing: 0,
        duration: 3000,
        essential: true,
      });
    },
  }));

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    if (!MAPBOX_TOKEN) {
      console.warn("Mapbox access token is missing.");
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const secondsPerRevolution = 120;
    const maxSpinZoom = 5;
    const slowSpinZoom = 3;
    let userInteracting = false;

    let map: mapboxgl.Map;
    try {
      map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [0, 20],
        zoom: 1.5,
        projection: { name: "globe" },
        attributionControl: false,
        renderWorldCopies: false,
      });
    } catch (err) {
      console.error("[Map] Failed to create map:", err);
      return;
    }

    mapRef.current = map;

    function spinGlobe() {
      if (!mapRef.current) return;
      const zoom = mapRef.current.getZoom();
      if (!userInteracting && zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution;
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
          distancePerSecond *= zoomDif;
        }
        const center = mapRef.current.getCenter();
        center.lng -= distancePerSecond;
        mapRef.current.easeTo({ center, duration: 1000, easing: (n) => n });
      }
    }

    map.on("load", () => {
      spinGlobe();
    });

    map.on("style.load", () => {
      map.setFog({
        color: "rgb(10, 10, 30)",
        "high-color": "rgb(20, 20, 60)",
        "horizon-blend": 0.5,
        "space-color": "rgb(5, 5, 15)",
        "star-intensity": 0.8,
      });
    });

    map.on("mousedown", () => { userInteracting = true; });
    map.on("dragstart", () => { userInteracting = true; });

    map.on("mouseup", () => {
      userInteracting = false;
      spinGlobe();
    });
    map.on("dragend", () => {
      userInteracting = false;
      spinGlobe();
    });
    map.on("touchend", () => {
      userInteracting = false;
      spinGlobe();
    });

    map.on("moveend", () => {
      spinGlobe();
    });

    map.on("error", (e) => {
      console.error("[Map] Mapbox error:", e);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mapContainerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    />
  );
});

Map.displayName = "Map";

export default Map;
