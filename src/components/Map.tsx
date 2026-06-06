import { useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ROUTE_CONFIGS, SPEED, buildTruckCollection, getPositionAndBearing, loadNavArrow } from "@/lib/truckRoutes";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoibWFwYm94OTYzMCIsImEiOiJjbWh4Y2lpOXAwMHZiMmxzOWVtaW1weTZvIn0.1lj2lcLygace2d9gcLnVMA";

const HK_CENTER: [number, number] = [114.1694, 22.3193];

export interface MapHandle {
  flyToHongKong: () => void;
  focusRoute: (routeId: string) => void;
  followTruck: (routeId: string, truckIdx: number) => void;
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
  onTruckClickRef.current = onTruckClick;

  useImperativeHandle(ref, () => ({
    flyToHongKong: () => {
      const map = mapRef.current;
      if (!map) return;
      followingRef.current = null;
      // Reset all route lines to default
      ROUTE_CONFIGS.forEach((r) => {
        if (map.getLayer(`route-line-${r.id}`)) {
          map.setPaintProperty(`route-line-${r.id}`, "line-opacity", 0.5);
          map.setPaintProperty(`route-line-${r.id}`, "line-width", 2);
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
    focusRoute: (routeId: string) => {
      const map = mapRef.current;
      if (!map) return;
      const cfg = ROUTE_CONFIGS.find((r) => r.id === routeId);
      if (!cfg) return;

      // Stop following
      followingRef.current = null;

      // Reset all route lines and truck visibility
      ROUTE_CONFIGS.forEach((r) => {
        if (map.getLayer(`route-line-${r.id}`)) {
          map.setPaintProperty(`route-line-${r.id}`, "line-opacity", r.id === routeId ? 1 : 0.2);
          map.setPaintProperty(`route-line-${r.id}`, "line-width", r.id === routeId ? 5 : 2);
        }
        if (map.getLayer(`trucks-layer-${r.id}`)) {
          map.setLayoutProperty(`trucks-layer-${r.id}`, "visibility", r.id === routeId ? "visible" : "none");
        }
      });

      // Fit bounds to the selected route
      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(cfg.from);
      bounds.extend(cfg.to);
      map.fitBounds(bounds, { padding: 100, duration: 2000, pitch: 0 });
    },
    followTruck: (routeId: string, truckIdx: number) => {
      const map = mapRef.current;
      if (!map) return;
      const routeIdx = ROUTE_CONFIGS.findIndex((r) => r.id === routeId);
      if (routeIdx === -1) return;
      followingRef.current = { routeIdx, truckIdx };

      // Get the truck's current position from state
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

      Promise.all(ROUTE_CONFIGS.map((cfg) => loadNavArrow(cfg.truckColor)))
        .then((images) => {
          images.forEach((img, idx) => {
            map.addImage(`truck-${ROUTE_CONFIGS[idx].id}`, img);
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
              paint: {
                "line-color": cfg.lineColor,
                "line-width": 2,
                "line-opacity": 0.5,
                "line-dasharray": [2, 3],
              },
            });

            map.addSource(`trucks-${cfg.id}`, {
              type: "geojson",
              data: buildTruckCollection(state.coords, state.progress, state.directions),
            });
            map.addLayer({
              id: `trucks-layer-${cfg.id}`,
              type: "symbol",
              source: `trucks-${cfg.id}`,
              layout: {
                "icon-image": `truck-${cfg.id}`,
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

                // Add waypoint dots: start, end, and up to 4 intermediate
                const totalPts = coords.length;
                const waypointIndices = [0];
                const numMid = Math.min(4, totalPts - 2);
                for (let i = 1; i <= numMid; i++) {
                  waypointIndices.push(Math.round((i / (numMid + 1)) * (totalPts - 1)));
                }
                waypointIndices.push(totalPts - 1);

                const waypointFeatures = waypointIndices.map((i) => ({
                  type: "Feature" as const,
                  geometry: { type: "Point" as const, coordinates: coords[i] },
                  properties: { isEndpoint: i === 0 || i === totalPts - 1 },
                }));

                map.addSource(`waypoints-${cfg.id}`, {
                  type: "geojson",
                  data: { type: "FeatureCollection", features: waypointFeatures },
                });
                map.addLayer({
                  id: `waypoints-layer-${cfg.id}`,
                  type: "circle",
                  source: `waypoints-${cfg.id}`,
                  paint: {
                    "circle-radius": ["case", ["get", "isEndpoint"], 6, 4],
                    "circle-color": cfg.lineColor,
                    "circle-stroke-width": 2,
                    "circle-stroke-color": "#ffffff",
                    "circle-opacity": 0.9,
                  },
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
              (map.getSource(`trucks-${cfg.id}`) as mapboxgl.GeoJSONSource).setData(
                buildTruckCollection(state.coords, state.progress, state.directions),
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
