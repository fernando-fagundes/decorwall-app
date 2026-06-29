import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PedidoCard from "./PedidoCard";

export const dynamic = "force-dynamic";

function fmt(v: number) {
  return v.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

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

  const total = pedidos?.length || 0;
  const pendentes = pedidos?.filter(p => p.status === "pendente").length || 0;
  const aprovados = pedidos?.filter(p => p.status === "aprovado").length || 0;
  const valorTotal = pedidos?.reduce((acc, p) => acc + (p.valor_total || 0), 0) || 0;

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
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            {isGestor ? "Pedidos recebidos" : "Meus pedidos"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Olá, {profile?.nome || "usuário"}!</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-800">{total}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Pendentes</p>
            <p className="text-2xl font-bold text-yellow-600">{pendentes}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Aprovados</p>
            <p className="text-2xl font-bold text-green-600">{aprovados}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Valor total</p>
            <p className="text-lg font-bold text-gray-800">R$ {fmt(valorTotal)}</p>
          </div>
        </div>

        {(!pedidos || pedidos.length === 0) ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
            <p className="text-gray-400 mb-4">Nenhum pedido encontrado.</p>
            <a href="/pedido" className="text-sm text-gray-600 border border-dashed border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors">
              + Criar primeiro pedido
            </a>
          </div>
        ) : (
          <div className="space-y-3">
            {pedidos.map(pedido => (
              <PedidoCard key={pedido.id} pedido={pedido} isGestor={isGestor} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
