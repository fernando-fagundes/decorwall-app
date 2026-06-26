import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Seja um Revendedor - DecorWall",
};

export default function RevendedorPage() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-light">
                <span className="text-gray-800">Decor</span>
                <span className="text-red-700">Wall</span>
              </span>
              <span className="text-sm text-gray-500">Arte e Decoração</span>
            </div>
            <div className="flex gap-4 mb-8">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <svg className="w-7 h-7 text-gray-600 hover:text-blue-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg className="w-7 h-7 text-gray-600 hover:text-pink-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Seja um Revendedor
            </h1>
            <p className="text-2xl text-gray-700 mb-6">
              e venha fazer parte da <strong>família Decorwall</strong>!
            </p>
            <a
              href="https://wa.me/555132312340"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              Chame no Whatsapp →
            </a>
            <p className="mt-6 text-gray-500 font-medium">#sejadecorwall</p>
          </div>

          <div className="rounded-2xl overflow-hidden">
            <img
              src="https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729019245893x611893756838977500/WhatsApp%20Image%202024-10-15%20at%2020.04.57.jpeg"
              alt="Decorwall Revendedor"
              className="w-full h-80 object-cover"
            />
          </div>
        </section>

        {/* Sobre */}
        <section className="bg-gray-50 py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sobre a Decorwall</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              A Decorwall se destaca como a maior fabricante de papel de parede personalizado no Brasil
              e tem uma ampla rede de revendedores, com presença em 15 estados e mais de 500 distribuidores.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Seu portfólio inclui mais de 20.000 projetos de paredes transformadas, abrangendo estilos
              desde o clássico até o moderno, atendendo à demanda crescente por personalização e
              sofisticação na decoração.
            </p>
          </div>
        </section>
      </main>

      {/* WhatsApp floating */}
      <a
        href="https://wa.me/555132312340"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 w-14 h-14 z-50"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          className="w-14 h-14 drop-shadow-lg"
        />
      </a>

      <Footer />
    </>
  );
}
