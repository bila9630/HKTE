import { createFileRoute } from "@tanstack/react-router";
import Globe from "../components/Globe";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Globe" },
      { name: "description", content: "An immersive 3D globe experience." },
      { property: "og:title", content: "Globe" },
      { property: "og:description", content: "An immersive 3D globe experience." },
    ],
  }),
  component: Index,
});

function Index() {
  return <Globe />;
}

