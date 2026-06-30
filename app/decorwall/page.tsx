import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CDN = "https://863c7441b944411b744b3e4d037f100f.cdn.bubble.io";

const categoryShowcase = [
  {
    name: "Floresta",
    imageUrl: CDN + "/f1740593171859x250298538386911400/Floresta%20aquarela%20pinheiro%20arvore%202329891549%20baixa.jpg",
  },
  {
    name: "Safari",
    imageUrl: CDN + "/f1615312424002x222058692035429500/fotomural%20infantil.png",
  },
  {
    name: "Estampas Personalizadas",
    imageUrl: CDN + "/f1618261071507x156400461429389020/shutterstock_1060649744%20triangulos%20rose%20ambiente.jpg",
  },
  {
    name: "Painel Fotográfico",
    imageUrl: CDN + "/f1615337378985x727677735628804500/Painel%20fotografico%20baixo.jpg",
  },
];

const productTypes = [
  {
    name: "Adesivo Azulejo",
    description: "Confira a categoria completa",
    imageUrl: CDN + "/f1619870157064x905326007794203100/Azulejo-02.jpg",
  },
  {
    name: "Adesivo Porta",
    description: "Confira a categoria completa",
    imageUrl: CDN + "/f1619874710286x146820826799292100/Porta%20ambientes-0baixo.jpg",
  },
  {
    name: "Adesivo Lousa",
    description: "Confira a categoria completa",
    imageUrl: CDN + "/f1619870330212x152846077615480100/Parede%20com%20adesivo%20lousa.jpg",
  },
  {
    name: "Adesivo para Vidro",
    description: "Confira a categoria completa",
    imageUrl: CDN + "/f1619870802850x157189763120703330/Imagem%20jateado1.jpg",
  },
];

const destaques = [
  {
    name: "Xadrez",
    description: "Confira a categoria completa",
    imageUrl: CDN + "/f1738156318724x272745475905038500/xadrez%20rosa.jpg",
  },
  {
    name: "Cortina de Flores",
    description: "Confira a categoria completa",
    imageUrl: CDN + "/f1738156647225x863265231025634800/_%20facepost%20-%202023-05-18T155400.700.png",
  },
  {
    name: "Tropical",
    description: "Confira a categoria completa",
    imageUrl: CDN + "/f1738156717929x813480626046225800/1000_F_652998153_ncJ6gJIVHfK1gH9JdOLBKdTwWHOirCkD%20mockup.jpg",
  },
];

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative min-h-[520px] flex items-center bg-gray-100 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url('${CDN}/f1737982784465x330243915918055940/WhatsApp%20Image%202025-01-16%20at%2015.46.47.jpeg')` }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
              Aumente o lucro e mix de produtos na sua loja.
            </h1>
            <p className="text-gray-600 mb-6">
              Revenda produtos de alta qualidade da maior empresa de papéis de parede e
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
          estaremos sempre à disposição!
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
                  Veja o Catálogo
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
