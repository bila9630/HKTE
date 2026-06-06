import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { DarkModeProvider, useDarkModeContext } from "@/context/DarkModeContext";
import { MapActionsProvider, useMapActions } from "@/context/MapActionsContext";
import { AppSidebar } from "@/components/AppSidebar";
import { RoutesPanel } from "@/components/RoutesPanel";
import { RouteInfoOverlay, EnergyOverlay, TrucksOverlay } from "@/components/RouteInfoOverlay";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AppLayout() {
  const { isDark, toggle } = useDarkModeContext();
  const { focusRoute, followTruck } = useMapActions();
  const router = useRouter();
  const [routesOpen, setRoutesOpen] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const pathname = router.state.location.pathname;
  const isMap = pathname === "/";

  const handleRouteClick = (routeId: string) => {
    focusRoute?.(routeId);
    setSelectedRoute(routeId);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar isDark={isDark} toggle={toggle} onRoutesClick={() => setRoutesOpen(true)} />
      <div className="relative flex-1 overflow-hidden">
        <Outlet />
        {isMap && selectedRoute && (
          <div className="absolute top-6 left-6 z-50 flex flex-col gap-3 w-72 animate-in slide-in-from-left-4 fade-in duration-300">
            <RouteInfoOverlay routeId={selectedRoute} onClose={() => setSelectedRoute(null)} onRouteChange={handleRouteClick} />
            <TrucksOverlay routeId={selectedRoute} onTruckClick={(routeId, truckIdx) => followTruck?.(routeId, truckIdx)} />
          </div>
        )}
        {isMap && <EnergyOverlay visible={!!selectedRoute} />}
      </div>
      <RoutesPanel open={routesOpen} onOpenChange={setRoutesOpen} onRouteClick={handleRouteClick} />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <DarkModeProvider>
        <MapActionsProvider>
          <AppLayout />
        </MapActionsProvider>
      </DarkModeProvider>
    </QueryClientProvider>
  );
}
