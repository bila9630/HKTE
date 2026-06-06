import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RoutePlanerCard } from "@/components/RoutePlanerCard";

export const Route = createFileRoute("/test")({
  component: Test,
});

type TestRow = {
  id: number;
  created_at: string;
  name: string;
};

function Test() {
  const [rows, setRows] = useState<TestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("test")
      .select("*")
      .then(({ data, error }) => {
        if (error) setError(error.message);
        else setRows(data ?? []);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Test Table</h1>
        <div className="space-y-2">
          {rows.map((row) => (
            <p key={row.id}>
              {row.id} — {new Date(row.created_at).toLocaleString()} — {row.name}
            </p>
          ))}
        </div>
      </div>
      <RoutePlanerCard />
    </>
  );
}
