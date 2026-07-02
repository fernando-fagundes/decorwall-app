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

  // Busca TODOS os pedidos de todos os agentes
  const { data: pedidos } = await supabase
    .from("pedidos")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-light tracking-tight">
          <span className="text-gray-800">decor</span>
          <span className="text-red-700">wall</span>
          <span className="text-gray-400 text-sm font-normal ml-2">painel</span>
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{profile?.nome || profile?.email}</span>
          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium uppercase">
            {profile?.role}
          </span>
          <a href="/api/auth/signout" className="text-xs text-gray-400 hover:text-gray-700 border border-gray-200 hover:border-gray-400 rounded-lg px-3 py-1.5 transition-colors">
            Sair
          </a>
        </div>
      </header>

      <div className="bg-white border-b border-gray-100 px-6">
        <div className="flex gap-6 max-w-6xl mx-auto">
          <a href="/painel" className="text-sm font-medium text-gray-900 border-b-2 border-gray-900 py-3">Pedidos</a>
          <a href="/pedido" className="text-sm text-gray-400 hover:text-gray-700 py-3 transition-colors">Novo pedido</a>
          <a href="/catalogo" className="text-sm text-gray-400 hover:text-gray-700 py-3 transition-colors">Catálogo</a>
            <a href="/calculadora" className="text-sm text-gray-400 hover:text-gray-700 py-3 transition-colors">Calculadora</a>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <PainelClient
          pedidos={pedidos ?? []}
          isGestor={true}
          nomeUsuario={profile?.nome || profile?.email || ""}
        />
      </main>
    </div>
  );
}
