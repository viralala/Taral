import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Publishable key only. Table `runs` has RLS: anon may select + insert.
export const supabase = url && key ? createClient(url, key) : null;

export type Run = {
  id?: string;
  name: string;
  level: 1 | 2 | 3;
  humanity: number; // 0-100
  time_ms: number;
  verdict?: string;
  created_at?: string;
};

export async function saveRun(run: Run) {
  if (!supabase) return { error: "offline" };
  const { error } = await supabase.from("runs").insert(run);
  return { error: error?.message };
}

export async function topRuns(level: 1 | 2 | 3 = 1, limit = 10): Promise<Run[]> {
  if (!supabase) return [];
  const { data } = await supabase
    .from("runs")
    .select("*")
    .eq("level", level)
    .order("humanity", { ascending: false })
    .order("time_ms", { ascending: true })
    .limit(limit);
  return (data as Run[]) ?? [];
}
