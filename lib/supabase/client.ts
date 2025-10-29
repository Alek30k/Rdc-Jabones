import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log(
    "[v0] Supabase URL:",
    supabaseUrl ? "✓ Configurado" : "✗ NO ENCONTRADO"
  );
  console.log(
    "[v0] Supabase Anon Key:",
    supabaseAnonKey ? "✓ Configurado" : "✗ NO ENCONTRADO"
  );

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "[v0] ERROR: Faltan las credenciales de Supabase en .env.local"
    );
    console.error("[v0] Asegúrate de tener:");
    console.error("[v0] - NEXT_PUBLIC_SUPABASE_URL=tu_url");
    console.error("[v0] - NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_key");
    console.error("[v0] Y reinicia el servidor con: npm run dev");
  }

  return createBrowserClient(supabaseUrl!, supabaseAnonKey!);
}
