import { useEffect, useRef, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Mapbox access token — publishable key, safe for client-side use
const MAPBOX_TOKEN =
  "pk.eyJ1IjoibWFwYm94OTYzMCIsImEiOiJjbWh4Y2lpOXAwMHZiMmxzOWVtaW1weTZvIn0.1lj2lcLygace2d9gcLnVMA";

export default function Globe() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const rotationRef = useRef<number>(0);
  const animFrameRef = useRef<number>(0);
  const isInteractingRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startRotation = useCallback(() => {
    if (!mapRef.current || isInteractingRef.current) return;

    const rotate = () => {
      if (!mapRef.current || isInteractingRef.current) {
        animFrameRef.current = requestAnimationFrame(rotate);
        return;
      }

      const center = mapRef.current.getCenter();
      rotationRef.current = center.lng - 0.15;
      mapRef.current.easeTo({
        center: [rotationRef.current, center.lat],
        duration: 0,
        easing: (n: number) => n,
      });

      animFrameRef.current = requestAnimationFrame(rotate);
    };

    animFrameRef.current = requestAnimationFrame(rotate);
  }, []);

  const stopRotation = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = 0;
    }
  }, []);

  const handleInteractionStart = useCallback(() => {
    isInteractingRef.current = true;
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
    stopRotation();
  }, [stopRotation]);

  const handleInteractionEnd = useCallback(() => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = setTimeout(() => {
      isInteractingRef.current = false;
      startRotation();
    }, 2500);
  }, [startRotation]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    if (!MAPBOX_TOKEN) {
      console.warn(
        "Mapbox access token is missing. Set VITE_MAPBOX_ACCESS_TOKEN in your environment."
      );
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [0, 20],
      zoom: 1.5,
      projection: { name: "globe" },
      attributionControl: false,
      renderWorldCopies: false,
    });

    mapRef.current = map;

    map.on("style.load", () => {
      // Set atmosphere for space-like feel
      map.setFog({
        color: "rgb(10, 10, 30)",
        "high-color": "rgb(20, 20, 60)",
        "horizon-blend": 0.5,
        "space-color": "rgb(5, 5, 15)",
        "star-intensity": 0.8,
      });

      startRotation();
    });

    // Pause rotation on user interaction
    map.on("mousedown", handleInteractionStart);
    map.on("touchstart", handleInteractionStart);
    map.on("dragstart", handleInteractionStart);

    // Resume rotation after interaction ends
    map.on("mouseup", handleInteractionEnd);
    map.on("touchend", handleInteractionEnd);
    map.on("dragend", handleInteractionEnd);

    return () => {
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
      stopRotation();
      map.remove();
      mapRef.current = null;
    };
  }, [handleInteractionStart, handleInteractionEnd, startRotation, stopRotation]);

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
}
