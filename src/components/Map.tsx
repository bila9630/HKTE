import { useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ROUTE_CONFIGS, SPEED, buildTruckCollection, getPositionAndBearing, loadNavArrow } from "@/lib/truckRoutes";
import { TRUCK_DATA } from "@/lib/routeConstants";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibWFwYm94OTYzMCIsImEiOiJjbWh4Y2lpOXAwMHZiMmxzOWVtaW1weTZvIn0.1lj2lcLygace2d9gcLnVMA";

const HK_CENTER: [number, number] = [114.1694, 22.3193];

export interface MapHandle {
  flyToHongKong: () => void;
  followTruck: (routeId: string, truckIdx: number) => void;
  flyToLocation: (lng: number, lat: number) => void;
  showPlannedRoute: (from: [number, number], to: [number, number]) => void;
  clearPlannedRoute: () => void;
}

interface MapProps {
  onTruckClick?: (routeId: string, truckIdx: number) => void;
}

const Map = forwardRef<MapHandle, MapProps>(function Map({ onTruckClick }, ref) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const followingRef = useRef<{ routeIdx: number; truckIdx: number } | null>(null);
  const routeStateRef = useRef<{ coords: [number, number][]; progress: number[]; directions: (1 | -1)[] }[]>([]);
  const onTruckClickRef = useRef(onTruckClick);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  onTruckClickRef.current = onTruckClick;

  useImperativeHandle(ref, () => ({
    flyToHongKong: () => {
      const map = mapRef.current;
      if (!map) return;
      followingRef.current = null;
      // Remove location marker if present
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      // Remove highlighted building
      if (map.getLayer("highlighted-building")) map.removeLayer("highlighted-building");
      if (map.getSource("highlighted-building")) map.removeSource("highlighted-building");
      // Remove planned route if present
      if (map.getLayer("planned-route-line")) map.removeLayer("planned-route-line");
      if (map.getSource("planned-route")) map.removeSource("planned-route");
      if ((map as any)._plannedStartMarker) { (map as any)._plannedStartMarker.remove(); (map as any)._plannedStartMarker = null; }
      if ((map as any)._plannedStopMarkers) {
        (map as any)._plannedStopMarkers.forEach((m: mapboxgl.Marker) => m.remove());
        (map as any)._plannedStopMarkers = null;
      }
      // Reset all route lines to default
      ROUTE_CONFIGS.forEach((r) => {
        if (map.getLayer(`route-line-${r.id}`)) {
          map.setLayoutProperty(`route-line-${r.id}`, "visibility", "none");
        }
        if (map.getLayer(`trucks-layer-${r.id}`)) {
          map.setLayoutProperty(`trucks-layer-${r.id}`, "visibility", "visible");
        }
      });
      map.flyTo({
        center: HK_CENTER,
        zoom: 10,
        pitch: 0,
        bearing: 0,
        duration: 3000,
        essential: true,
      });
    },
    followTruck: (routeId: string, truckIdx: number) => {
      const map = mapRef.current;
      if (!map) return;
      const routeIdx = ROUTE_CONFIGS.findIndex((r) => r.id === routeId);
      if (routeIdx === -1) return;
      followingRef.current = { routeIdx, truckIdx };

      // Show only the followed route's line, hide others
      ROUTE_CONFIGS.forEach((r) => {
        if (map.getLayer(`route-line-${r.id}`)) {
          map.setLayoutProperty(`route-line-${r.id}`, "visibility", r.id === routeId ? "visible" : "none");
        }
      });

      const state = routeStateRef.current[routeIdx];
      if (state && truckIdx < state.progress.length) {
        const { position, bearing } = getPositionAndBearing(state.coords, state.progress[truckIdx]);
        const truckBearing = state.directions[truckIdx] === 1 ? bearing : bearing + 180;
        map.flyTo({
          center: position,
          zoom: 18,
          pitch: 72,
          bearing: truckBearing,
          duration: 1500,
          essential: true,
        });
      }
    },
    flyToLocation: (lng: number, lat: number) => {
      const map = mapRef.current;
      if (!map) return;
      followingRef.current = null;

      // Remove old marker if any
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      // Fly to location first, then highlight building on arrival
      map.flyTo({
        center: [lng, lat],
        zoom: 16,
        pitch: 60,
        bearing: -20,
        duration: 2000,
        essential: true,
      });

      // Highlight building after flyTo completes
      map.once("moveend", () => {
        // Query building features at the target point
        const point = map.project([lng, lat]);
        const features = map.queryRenderedFeatures(
          [
            [point.x - 20, point.y - 20],
            [point.x + 20, point.y + 20],
          ],
          { layers: ["3d-buildings"] }
        );

        // Remove previous highlight layer
        if (map.getLayer("highlighted-building")) map.removeLayer("highlighted-building");
        if (map.getSource("highlighted-building")) map.removeSource("highlighted-building");

        if (features.length > 0) {
          // Use the first building's geometry
          const buildingFeature = features[0];
          map.addSource("highlighted-building", {
            type: "geojson",
            data: {
              type: "Feature",
              geometry: buildingFeature.geometry,
              properties: buildingFeature.properties,
            } as GeoJSON.Feature,
          });
          map.addLayer({
            id: "highlighted-building",
            type: "fill-extrusion",
            source: "highlighted-building",
            paint: {
              "fill-extrusion-color": "#3b82f6",
              "fill-extrusion-height": (buildingFeature.properties?.height as number) || 20,
              "fill-extrusion-base": (buildingFeature.properties?.min_height as number) || 0,
              "fill-extrusion-opacity": 0.9,
            },
          });
        }
      });
    },
    showPlannedRoute: (from: [number, number], to: [number, number]) => {
      const map = mapRef.current;
      if (!map) return;
      followingRef.current = null;

      // Hide all existing routes and trucks
      ROUTE_CONFIGS.forEach((r) => {
        if (map.getLayer(`route-line-${r.id}`)) {
          map.setPaintProperty(`route-line-${r.id}`, "line-opacity", 0);
        }
        if (map.getLayer(`trucks-layer-${r.id}`)) {
          map.setLayoutProperty(`trucks-layer-${r.id}`, "visibility", "none");
        }
        if (map.getLayer(`waypoints-layer-${r.id}`)) {
          map.setPaintProperty(`waypoints-layer-${r.id}`, "circle-opacity", 0);
          map.setPaintProperty(`waypoints-layer-${r.id}`, "circle-stroke-opacity", 0);
        }
      });

      // Remove existing marker
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }

      // Immediately fit bounds to show both points
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(from);
      bounds.extend(to);
      map.fitBounds(bounds, { padding: 200, pitch: 45, duration: 1500 });

      const url =
        `https://api.mapbox.com/directions/v5/mapbox/driving/` +
        `${from[0]},${from[1]};${to[0]},${to[1]}` +
        `?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;

      fetch(url)
        .then((r) => r.json())
        .then((data) => {
          const coords = data?.routes?.[0]?.geometry?.coordinates;
          if (!coords?.length) return;

          // Update or add planned route source/layer
          if (map.getSource("planned-route")) {
            (map.getSource("planned-route") as mapboxgl.GeoJSONSource).setData({
              type: "Feature",
              geometry: { type: "LineString", coordinates: coords },
              properties: {},
            });
          } else {
            map.addSource("planned-route", {
              type: "geojson",
              data: {
                type: "Feature",
                geometry: { type: "LineString", coordinates: coords },
                properties: {},
              },
            });
            map.addLayer({
              id: "planned-route-line",
              type: "line",
              source: "planned-route",
              paint: {
                "line-color": "#3b82f6",
                "line-width": 4,
                "line-opacity": 0.9,
              },
              layout: {
                "line-cap": "round",
                "line-join": "round",
              },
            });
          }

          // Add start/end markers
          if (markerRef.current) markerRef.current.remove();
          // Use two markers stored in an array-like approach
          const startMarker = new mapboxgl.Marker({ color: "#22c55e" }).setLngLat(from).addTo(map);
          const endMarker = new mapboxgl.Marker({ color: "#ef4444" }).setLngLat(to).addTo(map);
          // Store end marker in markerRef for cleanup; store start in a data attribute
          markerRef.current = endMarker;
          (map as any)._plannedStartMarker = startMarker;

          // Add intermediate stop points along the route (at 1/3 and 2/3)
          const stopPositions = [
            coords[Math.floor(coords.length * 0.33)],
            coords[Math.floor(coords.length * 0.66)],
          ];
          const stopMarkers = stopPositions.map((pos: [number, number]) => {
            const el = document.createElement("div");
            el.className = "planned-stop-marker";
            el.style.width = "14px";
            el.style.height = "14px";
            el.style.borderRadius = "50%";
            el.style.border = "2.5px solid white";
            el.style.backgroundColor = "#facc15";
            el.style.boxShadow = "0 0 6px rgba(250,204,21,0.5)";
            return new mapboxgl.Marker({ element: el }).setLngLat(pos).addTo(map);
          });
          (map as any)._plannedStopMarkers = stopMarkers;

          // Fit bounds to show the whole route
          const bounds = new mapboxgl.LngLatBounds();
          coords.forEach((c: [number, number]) => bounds.extend(c));
          map.fitBounds(bounds, { padding: 200, pitch: 45, duration: 2000 });
        })
        .catch((err) => console.error("[Map] Planned route fetch failed:", err));
    },
    clearPlannedRoute: () => {
      const map = mapRef.current;
      if (!map) return;
      if (map.getLayer("planned-route-line")) map.removeLayer("planned-route-line");
      if (map.getSource("planned-route")) map.removeSource("planned-route");
      if (map.getLayer("highlighted-building")) map.removeLayer("highlighted-building");
      if (map.getSource("highlighted-building")) map.removeSource("highlighted-building");
      if (markerRef.current) { markerRef.current.remove(); markerRef.current = null; }
      if ((map as any)._plannedStartMarker) { (map as any)._plannedStartMarker.remove(); (map as any)._plannedStartMarker = null; }
      if ((map as any)._plannedStopMarkers) {
        (map as any)._plannedStopMarkers.forEach((m: mapboxgl.Marker) => m.remove());
        (map as any)._plannedStopMarkers = null;
      }
      // Restore all routes and trucks
      ROUTE_CONFIGS.forEach((r) => {
        if (map.getLayer(`route-line-${r.id}`)) {
          map.setPaintProperty(`route-line-${r.id}`, "line-opacity", 0.5);
        }
        if (map.getLayer(`trucks-layer-${r.id}`)) {
          map.setLayoutProperty(`trucks-layer-${r.id}`, "visibility", "visible");
        }
        if (map.getLayer(`waypoints-layer-${r.id}`)) {
          map.setPaintProperty(`waypoints-layer-${r.id}`, "circle-opacity", 0.9);
          map.setPaintProperty(`waypoints-layer-${r.id}`, "circle-stroke-opacity", 1);
        }
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
        zoom: 2,
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

    let animFrameId: number;

    map.on("load", () => {
      spinGlobe();
      setTimeout(() => {
        userInteracting = true;
        map.flyTo({
          center: HK_CENTER,
          zoom: 10,
          pitch: 0,
          bearing: 0,
          duration: 3000,
          essential: true,
        });
      }, 500);

      const truckImageTasks = ROUTE_CONFIGS.flatMap((cfg) =>
        (TRUCK_DATA[cfg.id] ?? []).map((truck, truckIdx) => ({
          key: `truck-${cfg.id}-${truckIdx}`,
          color: truck.color,
        }))
      );

      Promise.all(truckImageTasks.map((t) => loadNavArrow(t.color)))
        .then((images) => {
          images.forEach((img, i) => {
            map.addImage(truckImageTasks[i].key, img);
          });

          const routeState = ROUTE_CONFIGS.map((cfg) => ({
            coords: [cfg.from, cfg.to] as [number, number][],
            progress: Array.from({ length: cfg.numTrucks }, (_, i) => i / cfg.numTrucks),
            directions: Array.from(
              { length: cfg.numTrucks },
              (_, i) => (i % 2 === 0 ? 1 : -1) as 1 | -1,
            ),
          }));
          routeStateRef.current = routeState;

          ROUTE_CONFIGS.forEach((cfg, idx) => {
            const state = routeState[idx];

            map.addSource(`route-${cfg.id}`, {
              type: "geojson",
              data: {
                type: "Feature",
                geometry: { type: "LineString", coordinates: [cfg.from, cfg.to] },
                properties: {},
              },
            });
            map.addLayer({
              id: `route-line-${cfg.id}`,
              type: "line",
              source: `route-${cfg.id}`,
              layout: { "visibility": "none" },
              paint: {
                "line-color": cfg.lineColor,
                "line-width": 2,
                "line-opacity": 0.8,
                "line-dasharray": [2, 3],
              },
            });

            const imageKeys = Array.from({ length: cfg.numTrucks }, (_, i) => `truck-${cfg.id}-${i}`);
            map.addSource(`trucks-${cfg.id}`, {
              type: "geojson",
              data: buildTruckCollection(state.coords, state.progress, state.directions, imageKeys),
            });
            map.addLayer({
              id: `trucks-layer-${cfg.id}`,
              type: "symbol",
              source: `trucks-${cfg.id}`,
              layout: {
                "icon-image": ["get", "iconImage"],
                "icon-size": 1,
                "icon-allow-overlap": true,
                "icon-ignore-placement": true,
                "icon-rotate": ["get", "bearing"],
                "icon-rotation-alignment": "map",
              },
            });

            const url =
              `https://api.mapbox.com/directions/v5/mapbox/driving/` +
              `${cfg.from[0]},${cfg.from[1]};${cfg.to[0]},${cfg.to[1]}` +
              `?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;

            fetch(url)
              .then((res) => res.json())
              .then((data) => {
                const coords: [number, number][] = data?.routes?.[0]?.geometry?.coordinates;
                if (!coords?.length) return;
                state.coords = coords;
                (map.getSource(`route-${cfg.id}`) as mapboxgl.GeoJSONSource).setData({
                  type: "Feature",
                  geometry: { type: "LineString", coordinates: coords },
                  properties: {},
                });
              })
              .catch((err) => console.error(`[Map] Directions fetch failed for ${cfg.id}:`, err));
          });

          // Click on truck to follow it
          ROUTE_CONFIGS.forEach((cfg, idx) => {
            map.on("click", `trucks-layer-${cfg.id}`, (e) => {
              const feature = e.features?.[0];
              if (!feature) return;
              const truckIdx = feature.properties?.id ?? 0;
              followingRef.current = { routeIdx: idx, truckIdx };
              // Notify parent
              onTruckClickRef.current?.(cfg.id, truckIdx);
              // Zoom in close with 3D buildings view
              const coords = (feature.geometry as GeoJSON.Point).coordinates as [number, number];
              const truckBearing = feature.properties?.bearing ?? 0;
              map.flyTo({
                center: coords,
                zoom: 18,
                pitch: 72,
                bearing: truckBearing,
                duration: 1500,
                essential: true,
              });
            });
            map.on("mouseenter", `trucks-layer-${cfg.id}`, () => {
              map.getCanvas().style.cursor = "pointer";
            });
            map.on("mouseleave", `trucks-layer-${cfg.id}`, () => {
              map.getCanvas().style.cursor = "";
            });
          });

          // Click on empty map to stop following
          map.on("click", (e) => {
            const features = map.queryRenderedFeatures(e.point, {
              layers: ROUTE_CONFIGS.map((cfg) => `trucks-layer-${cfg.id}`),
            });
            if (!features.length) {
              followingRef.current = null;
            }
          });

          let lastTime: number | null = null;
          function animate(timestamp: number) {
            if (lastTime === null) lastTime = timestamp;
            const delta = timestamp - lastTime;
            lastTime = timestamp;

            ROUTE_CONFIGS.forEach((cfg, idx) => {
              const state = routeState[idx];
              // Slow down trucks on the followed route to a realistic speed
              const isFollowedRoute = followingRef.current?.routeIdx === idx;
              const speed = isFollowedRoute ? SPEED * 0.05 : SPEED;
              for (let i = 0; i < cfg.numTrucks; i++) {
                state.progress[i] += speed * delta * state.directions[i];
                if (state.progress[i] >= 1) {
                  state.progress[i] = 1;
                  state.directions[i] = -1;
                } else if (state.progress[i] <= 0) {
                  state.progress[i] = 0;
                  state.directions[i] = 1;
                }
              }
              const animImageKeys = Array.from({ length: cfg.numTrucks }, (_, i) => `truck-${cfg.id}-${i}`);
              (map.getSource(`trucks-${cfg.id}`) as mapboxgl.GeoJSONSource).setData(
                buildTruckCollection(state.coords, state.progress, state.directions, animImageKeys),
              );
            });

            // Follow truck camera
            if (followingRef.current) {
              const { routeIdx, truckIdx } = followingRef.current;
              const state = routeState[routeIdx];
              if (state && truckIdx < state.progress.length && !map.isMoving()) {
                const { position, bearing } = getPositionAndBearing(state.coords, state.progress[truckIdx]);
                const truckBearing = state.directions[truckIdx] === 1 ? bearing : bearing + 180;
                map.easeTo({
                  center: position,
                  bearing: truckBearing,
                  zoom: 18,
                  pitch: 72,
                  duration: 100,
                  easing: (n) => n,
                });
              }
            }

            animFrameId = requestAnimationFrame(animate);
          }
          animFrameId = requestAnimationFrame(animate);
        })
        .catch((err) => console.error("[Map] Failed to load nav arrows:", err));
    });

    map.on("style.load", () => {
      map.setFog({
        color: "rgb(10, 10, 30)",
        "high-color": "rgb(20, 20, 60)",
        "horizon-blend": 0.5,
        "space-color": "rgb(5, 5, 15)",
        "star-intensity": 0.8,
      });

      // 3D building extrusions
      const layers = map.getStyle().layers;
      const labelLayerId = layers?.find(
        (layer) => layer.type === "symbol" && layer.layout?.["text-field"]
      )?.id;

      if (!map.getLayer("3d-buildings")) {
        map.addLayer(
          {
            id: "3d-buildings",
            source: "composite",
            "source-layer": "building",
            filter: ["==", "extrude", "true"],
            type: "fill-extrusion",
            minzoom: 14,
            paint: {
              "fill-extrusion-color": "#1a1a2e",
              "fill-extrusion-height": ["get", "height"],
              "fill-extrusion-base": ["get", "min_height"],
              "fill-extrusion-opacity": 0.7,
            },
          },
          labelLayerId,
        );
      }
    });

    map.on("mousedown", () => {
      userInteracting = true;
    });
    map.on("dragstart", () => {
      userInteracting = true;
    });

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
      cancelAnimationFrame(animFrameId);
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
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    />
  );
});

Map.displayName = "Map";

export default Map;
