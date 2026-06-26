import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-light tracking-tight">
          <span className="text-gray-800">foto</span>
          <span className="text-red-700">mural</span>
          <span className="text-gray-400 text-sm font-normal ml-2">painel</span>
        </span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{profile?.nome || profile?.email}</span>
          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium uppercase">
            {profile?.role}
          </span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Bem-vindo ao painel</h1>
        <p className="text-gray-500 text-sm mb-8">
          Olá, {profile?.nome || "usuário"}! O painel está em construção.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Pedidos", value: "—", color: "bg-blue-50 text-blue-700" },
            { label: "Clientes", value: "—", color: "bg-green-50 text-green-700" },
            { label: "Produtos", value: "—", color: "bg-purple-50 text-purple-700" },
          ].map((card) => (
            <div key={card.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <p className="text-sm text-gray-500 mb-1">{card.label}</p>
              <p className={`text-3xl font-bold ${card.color.split(" ")[1]}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {profile?.role === "admin" && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <p className="text-sm font-medium text-yellow-800">
              Você é administrador. As funcionalidades completas do painel estão sendo implementadas.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
