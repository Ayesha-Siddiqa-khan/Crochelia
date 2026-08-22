import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const startedAt = Date.now();

  try {
    const supabase = await createClient();
    // Any successful round trip confirms Postgres is reachable — RLS may
    // filter the anon-role result to zero rows, which is fine; a thrown
    // error is the only failure signal we care about here.
    const { error } = await supabase.from("profiles").select("id").limit(1);
    if (error) throw error;

    return NextResponse.json(
      {
        status: "ok",
        checks: { process: "up", database: "reachable" },
        latencyMs: Date.now() - startedAt,
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json(
      {
        status: "degraded",
        checks: { process: "up", database: "unreachable" },
        latencyMs: Date.now() - startedAt,
      },
      { status: 503 },
    );
  }
}
