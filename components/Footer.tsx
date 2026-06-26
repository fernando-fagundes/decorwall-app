import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Super informado */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Super informado</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link href="#" className="hover:text-gray-900">Blog</Link></li>
            <li><Link href="#" className="hover:text-gray-900">Novidades</Link></li>
            <li><Link href="#" className="hover:text-gray-900">Política de Privacidade</Link></li>
          </ul>
        </div>

        {/* Conecte-se */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Conecte-se</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>
              <a href="https://wa.me/5551999999999" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900">
                WhatsApp
              </a>
            </li>
            <li><Link href="#" className="hover:text-gray-900">FAQ's</Link></li>
            <li><Link href="/revendedor" className="hover:text-gray-900">Seja um revendedor</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Newsletter</h3>
          <form className="flex flex-col gap-2">
            <input
              type="text"
              placeholder="Seu nome"
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <input
              type="email"
              placeholder="Seu e-mail"
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <button
              type="submit"
              className="bg-gray-900 text-white text-sm py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Já assinante
            </button>
          </form>
        </div>

        {/* Contato */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Contato</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p className="font-medium">WhatsApp</p>
            <a href="https://wa.me/555132312340" className="text-gray-800 hover:underline">
              51 32312340
            </a>
            <p className="mt-2">Rua Estevão Cruz, 67</p>
            <p>Porto Alegre - RS</p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-400">
        Decorwall Arte e Decoração · CNPJ: 04.505.259/0001-45
      </div>
    </footer>
  );
}
