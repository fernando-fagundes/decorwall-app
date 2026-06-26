"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AtualizarSenhaPage() {
  const supabase = createClient();
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (senha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setLoading(false);
    if (error) {
      setErro(error.message);
    } else {
      setMensagem("Senha atualizada com sucesso!");
      setErro("");
      setTimeout(() => router.push("/login"), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-6">
            Nova senha
          </h1>
          {mensagem && <p className="text-green-600 mb-4 text-sm">{mensagem}</p>}
          {erro && <p className="text-red-500 mb-4 text-sm">{erro}</p>}
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Nova senha</label>
            <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>
          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-1">Confirmar senha</label>
            <input type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-700 transition-colors disabled:opacity-50">
            {loading ? "Atualizando..." : "Atualizar senha"}
          </button>
        </form>
      </div>
    </div>
  );
}
