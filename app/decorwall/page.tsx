import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const heroImages = [
  "https://s3.amazonaws.com/appforest_uf/f1702500000000x000000000000000000/safari-bg.jpg",
];

const categoryShowcase = [
  {
    name: "Floresta",
    imageUrl: "https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729019245893x611893756838977500/WhatsApp%20Image%202024-10-15%20at%2020.04.57.jpeg",
  },
  {
    name: "Safari",
    imageUrl: "https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729019245893x611893756838977500/WhatsApp%20Image%202024-10-15%20at%2020.04.57.jpeg",
  },
  {
    name: "Estampas Personalizadas",
    imageUrl: "https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729019245893x611893756838977500/WhatsApp%20Image%202024-10-15%20at%2020.04.57.jpeg",
  },
  {
    name: "Painel Fotogr\u00e1fico",
    imageUrl: "https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729537032785x476673555682803700/WhatsApp%20Image%202024-10-21%20at%2015.25.04.jpeg",
  },
];

const productTypes = [
  {
    name: "Adesivo Azulejo",
    description: "Confira a categoria completa",
    imageUrl: "https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1730923479546x841563553548984300/Captura%20de%20tela%202024-11-06%20141745.png",
  },
  {
    name: "Adesivo Porta",
    description: "Confira a categoria completa",
    imageUrl: "https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1730923479546x841563553548984300/Captura%20de%20tela%202024-11-06%20141745.png",
  },
  {
    name: "Adesivo Lousa",
    description: "Confira a categoria completa",
    imageUrl: "https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1730923479546x841563553548984300/Captura%20de%20tela%202024-11-06%20141745.png",
  },
  {
    name: "Adesivo para Vidro",
    description: "Confira a categoria completa",
    imageUrl: "https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1730923479546x841563553548984300/Captura%20de%20tela%202024-11-06%20141745.png",
  },
];

const destaques = [
  { name: "Xadrez", description: "Confira a categoria completa", imageUrl: "https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729019245893x611893756838977500/WhatsApp%20Image%202024-10-15%20at%2020.04.57.jpeg" },
  { name: "Cortina de Flores", description: "Confira a categoria completa", imageUrl: "https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729019245893x611893756838977500/WhatsApp%20Image%202024-10-15%20at%2020.04.57.jpeg" },
  { name: "Tropical", description: "Confira a categoria completa", imageUrl: "https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729537032785x476673555682803700/WhatsApp%20Image%202024-10-21%20at%2015.25.04.jpeg" },
];

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative min-h-[520px] flex items-center bg-gray-100 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url('https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729019245893x611893756838977500/WhatsApp%20Image%202024-10-15%20at%2020.04.57.jpeg')` }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
              Aumente o lucro e mix de produtos na sua loja.
            </h1>
            <p className="text-gray-600 mb-6">
              Revenda produtos de alta qualidade da maior empresa de pap\u00e9is de parede e
              revestimentos personalizados do Brasil
            </p>
            <Link
              href="/revendedor"
              className="inline-block bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
            >
              Saiba mais
            </Link>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-10 px-4 flex items-center justify-center gap-4 bg-white">
        <p className="text-xl font-semibold text-gray-800 text-center">
          Quando precisar de uma ajudinha,<br />
          estaremos sempre \u00e0 disposi\u00e7\u00e3o!
        </p>
        <a
          href="https://wa.me/555132312340"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 flex-shrink-0"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            className="w-14 h-14"
          />
        </a>
      </section>

      {/* Category showcase */}
      <section className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {categoryShowcase.map((cat) => (
          <div key={cat.name} className="flex items-stretch rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
            <div className="bg-white flex items-center justify-center px-8 py-6 min-w-[200px]">
              <span className="text-lg font-medium text-gray-800">{cat.name}</span>
            </div>
            <div
              className="flex-1 min-h-[160px] bg-cover bg-center"
              style={{ backgroundImage: `url('${cat.imageUrl}')` }}
            />
          </div>
        ))}
      </section>

      {/* Product types grid */}
      <section className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {productTypes.map((product) => (
          <div key={product.name} className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div
              className="h-40 bg-cover bg-center bg-gray-100"
              style={{ backgroundImage: `url('${product.imageUrl}')` }}
            />
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{product.description}</p>
              <Link
                href="/catalogo"
                className="block text-center border border-gray-300 rounded-lg py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Saiba mais
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* Destaques */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-8">Destaque</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {destaques.map((item) => (
            <div key={item.name} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
              <div
                className="h-56 bg-cover bg-center bg-gray-100"
                style={{ backgroundImage: `url('${item.imageUrl}')` }}
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{item.description}</p>
                <Link
                  href="/catalogo"
                  className="block text-center bg-gray-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Veja o Cat\u00e1logo
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WhatsApp floating button */}
      <a
        href="https://wa.me/555132312340"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 z-50"
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
