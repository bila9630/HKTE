import { createFileRoute } from "@tanstack/react-router";
import { ROUTE_CONFIGS } from "@/lib/truckRoutes";
import { Truck, Route as RouteIcon, Zap, Activity } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard" },
      { name: "description", content: "Fleet overview dashboard." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const totalTrucks = ROUTE_CONFIGS.reduce((sum, r) => sum + r.numTrucks, 0);
  const totalRoutes = ROUTE_CONFIGS.length;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Truck className="h-5 w-5 text-blue-400" />} label="Total Trucks" value={totalTrucks} />
        <StatCard icon={<RouteIcon className="h-5 w-5 text-purple-400" />} label="Active Routes" value={totalRoutes} />
        <StatCard icon={<Zap className="h-5 w-5 text-yellow-400" />} label="Energy Delivered" value="521 kWh" />
        <StatCard icon={<Activity className="h-5 w-5 text-green-400" />} label="Uptime" value="99.2%" />
      </div>

      {/* Routes table */}
      <div className="rounded-xl border border-white/10 bg-gray-900/70 backdrop-blur-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">Routes Overview</h2>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-gray-400 text-xs uppercase">
              <th className="px-6 py-3 text-left">Route</th>
              <th className="px-6 py-3 text-left">From</th>
              <th className="px-6 py-3 text-left">To</th>
              <th className="px-6 py-3 text-left">Trucks</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {ROUTE_CONFIGS.map((route) => (
              <tr key={route.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-6 py-4 flex items-center gap-2">
                  <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: route.lineColor }} />
                  <span className="capitalize font-medium">{route.id}</span>
                </td>
                <td className="px-6 py-4 text-gray-300 text-sm">
                  {route.from[1].toFixed(4)}°N, {route.from[0].toFixed(4)}°E
                </td>
                <td className="px-6 py-4 text-gray-300 text-sm">
                  {route.to[1].toFixed(4)}°N, {route.to[0].toFixed(4)}°E
                </td>
                <td className="px-6 py-4">{route.numTrucks}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-gray-900/70 backdrop-blur-xl p-5">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
