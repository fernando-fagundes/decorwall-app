"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AguardandoAprovacaoPage() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-light tracking-tight">
            <span className="text-gray-800">foto</span>
            <span className="text-red-700">mural</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-2">Aguardando aprovação</h2>
          <p className="text-gray-500 text-sm mb-6">
            Seu cadastro foi recebido. Um administrador irá aprovar seu acesso em breve.
            Você receberá um e-mail quando sua conta for liberada.
          </p>

          <button
            onClick={handleLogout}
            className="w-full border border-gray-300 text-gray-700 rounded-lg py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
