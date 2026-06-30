import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PainelClient from "./PainelClient";

export const dynamic = "force-dynamic";

export default async function PainelPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nome, email, role, aprovado")
    .eq("id", user.id)
    .single();

  if (!profile?.aprovado) redirect("/aguardando-aprovacao");

  const isGestor = ["admin", "vendedor"].includes(profile?.role || "");

  const baseQuery = supabase
    .from("pedidos")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: pedidos } = isGestor
    ? await baseQuery
    : await baseQuery.eq("user_id", user.id);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-light tracking-tight">
          <span className="text-gray-800">foto</span>
          <span className="text-red-700">mural</span>
          <span className="text-gray-400 text-sm font-normal ml-2">painel</span>
        </span>
        <div className="flex items-center gap-4">
          <a href="/pedido" className="text-sm text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors">
            + Novo pedido
          </a>
          <span className="text-sm text-gray-600">{profile?.nome || profile?.email}</span>
          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium uppercase">
            {profile?.role}
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        <PainelClient
          pedidos={pedidos || []}
          isGestor={isGestor}
          nomeUsuario={profile?.nome || profile?.email || "usuario"}
        />
      </main>
    </div>
  );
}
