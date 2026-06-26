"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push("/painel");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      if (msg.includes("Invalid login credentials")) {
        setError("E-mail ou senha incorretos.");
      } else if (msg.includes("Email not confirmed")) {
        setError("Confirme seu e-mail antes de entrar.");
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-light tracking-tight">
            <span className="text-gray-800">foto</span>
            <span className="text-red-700">mural</span>
          </Link>
          <p className="text-gray-500 text-sm mt-2">Área restrita</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h1 className="text-lg font-semibold text-gray-800 mb-6">Entrar</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="seu@email.com"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700">Senha</label>
                <Link href="/reset-senha" className="text-xs text-red-700 hover:underline">
                  Esqueci a senha
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 text-white rounded-lg py-3 text-sm font-medium hover:bg-red-800 disabled:opacity-50 transition-colors"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Novo agente?{" "}
            <Link href="/cadastro" className="text-red-700 font-medium hover:underline">
              Solicitar acesso
            </Link>
          </p>
        </div>

        <p className="text-center mt-4 text-sm text-gray-500">
          <Link href="/" className="hover:underline">← Voltar ao site</Link>
        </p>
      </div>
    </div>
  );
}
