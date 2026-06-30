import { createClient } from "@/lib/supabase/server";
import PedidoForm from "./PedidoForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Decorwall — Novo Pedido",
  description: "Formulario de pedido para revendedores.",
};

export default async function PedidoPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const userId = user?.id ?? null;
  const nomeUsuario = user ? (await supabase
    .from("profiles")
    .select("nome")
    .eq("id", user.id)
    .single()).data?.nome || user.email : null;

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-2xl font-light tracking-tight">
            <span className="text-gray-800">Decor</span>
            <span className="text-red-700">Wall</span>
          </span>
          {nomeUsuario && (
            <span className="text-sm text-gray-500">Ola, {nomeUsuario}</span>
          )}
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Novo Pedido</h1>
        <p className="text-gray-500 mb-8">Preencha os dados abaixo para registrar seu pedido.</p>
        <PedidoForm userId={userId} />
      </div>
    </main>
  );
}
