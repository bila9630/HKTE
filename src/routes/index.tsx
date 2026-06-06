import { createFileRoute } from "@tanstack/react-router";
import Map from "../components/Map";

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
  return <Map />;
}
