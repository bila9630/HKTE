import { ROUTE_CONFIGS } from "@/lib/truckRoutes";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface RoutesPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRouteClick?: (routeId: string) => void;
}

export function RoutesPanel({ open, onOpenChange, onRouteClick }: RoutesPanelProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-700 text-gray-100">
        <DialogHeader>
          <DialogTitle className="text-gray-100">Routes</DialogTitle>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700 hover:bg-gray-800">
              <TableHead className="text-gray-400">Route ID</TableHead>
              <TableHead className="text-gray-400">From</TableHead>
              <TableHead className="text-gray-400">To</TableHead>
              <TableHead className="text-gray-400">Trucks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ROUTE_CONFIGS.map((route) => (
              <TableRow
                key={route.id}
                className="border-gray-700 hover:bg-gray-800 cursor-pointer"
                onClick={() => {
                  onRouteClick?.(route.id);
                  onOpenChange(false);
                }}
              >
                <TableCell className="font-medium capitalize">
                  <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: route.lineColor }} />
                  {route.id}
                </TableCell>
                <TableCell className="text-gray-300">{route.from[1].toFixed(4)}, {route.from[0].toFixed(4)}</TableCell>
                <TableCell className="text-gray-300">{route.to[1].toFixed(4)}, {route.to[0].toFixed(4)}</TableCell>
                <TableCell className="text-gray-300">{route.numTrucks}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
