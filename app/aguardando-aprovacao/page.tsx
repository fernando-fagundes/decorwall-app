export default function AguardandoAprovacao() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm p-8 text-center">
        <div className="text-5xl mb-4">😏</sdiv>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Cadastro em análise
        </h1>
        <p className="text-gray-600 mb-6">
          Seu cadastro está aguardando aprovação da nossa equipe. Você receberá um
          e-mail quando sua conta for ativada.
        </p>
        <a
          href="/login"
          className="text-sm text-gray-500 hover:text-gray-900 underline"
        >
          Voltar para o login
        </a>
      </div>
    </div>
  );
}
