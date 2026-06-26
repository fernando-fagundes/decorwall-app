import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PedidoForm from "./PedidoForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Decorwall — Novo Pedido",
  description: "Formulário de pedido para revendedores.",
};

export default async function PedidoPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("aprovado, role, full_name")
    .eq("id", user.id)
    .single();

  if (!profile?.aprovado) redirect("/aguardando-aprovacao");

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-2xl font-light tracking-tight">
            <span className="text-gray-800">Decor</span>
            <span className="text-red-700">Wall</span>
          </span>
          <span className="text-sm text-gray-500">
            Olá, {profile?.full_name || user.email}
          </span>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-1">Novo Pedido</h1>
        <p className="text-gray-500 mb-8">Preencha os dados abaixo para registrar seu pedido.</p>
        <PedidoForm userId={user.id} vendedorNome={profile?.full_name || user.email || ""} />
      </div>
    </main>
  );
}
