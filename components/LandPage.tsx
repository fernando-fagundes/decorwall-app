import Link from "next/link";

const heroImage =
  "https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729019245893x6118937568389775000/WhatsApp%20Image%202024-10-15%20at%2020.04.57.jpeg";

const categoryShowcase = [
  {
    name: "Floresta",
    imageUrl:
      "https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729019245893x6118937568389775000/WhatsApp%20Image%202024-10-15%20at%2020.04.57.jpeg",
  },
  {
    name: "Safari",
    imageUrl:
      "https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729019245893x6118937568389775000/WhatsApp%20Image%202024-10-15%20at%2020.04.57.jpeg",
  },
  {
    name: "Tropical",
    imageUrl:
      "https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729537032785x4766735556828037000/WhatsApp%20Image%202024-10-21%20at%2015.25.04.jpeg",
  },
  {
    name: "Painel Fotogr\u00e1fico",
    imageUrl:
      "https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729537032785x4766735556828037000/WhatsApp%20Image%202024-10-21%20at%2015.25.04.jpeg",
  },
];

const productTypes = [
  { name: "Papel de Parede", description: "Transforme qualquer ambiente" },
  { name: "Adesivo Azulejo", description: "Reforma sem obra" },
  { name: "Adesivo Porta", description: "Design moderno e f\u00e1cil" },
  { name: "Adesivo para Vidro", description: "Privacidade com estilo" },
];

const destaquesItems = [
  {
    name: "Xadrez",
    imageUrl:
      "https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729019245893x6118937568389775000/WhatsApp%20Image%202024-10-15%20at%2020.04.57.jpeg",
  },
  {
    name: "Cortina de Flores",
    imageUrl:
      "https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729019245893x6118937568389775000/WhatsApp%20Image%202024-10-15%20at%2020.04.57.jpeg",
  },
  {
    name: "Tropical",
    imageUrl:
      "https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729537032785x4766735556828037000/WhatsApp%20Image%202024-10-21%20at%2015.25.04.jpeg",
  },
];

interface LandPageProps {
  vendedor: string;
  whatsapp: string;
}

export default function LandPage({ vendedor, whatsapp }: LandPageProps) {
  const waLink = `https://wa.me/${whatsapp}`;
  const waMsg = `https://wa.me/${whatsapp}?text=Ol%C3%A1%20${encodeURIComponent(vendedor)}%2C%20tenho%20interesse%20nos%20produtos%20Decorwall!`;

  return (
    <>
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/decorwall" className="flex items-center">
            <span className="text-2xl font-light tracking-tight">
              <span className="text-gray-800">Decor</span>
              <span className="text-red-700">Wall</span>
            </span>
          </Link>
          <a
            href={waMsg}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-green-600 transition-colors"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              alt="WhatsApp"
              className="w-4 h-4"
            />
            Falar com {vendedor}
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[540px] flex items-center bg-gray-100 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-8 py-20">
          <div className="bg-white/85 backdrop-blur-sm rounded-2xl p-8 max-w-lg">
            <p className="text-sm text-red-700 font-medium mb-2 uppercase tracking-wide">
              Consultora {vendedor}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-4">
              Aumente o lucro e mix de produtos na sua loja.
            </h1>
            <p className="text-gray-600 mb-6">
              Revenda produtos de alta qualidade da maior empresa de pap\u00e9is de
              parede e revestimentos personalizados do Brasil.
            </p>
            <a
              href={waMsg}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt=""
                className="w-5 h-5"
              />
              Chamar {vendedor} no WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* WhatsApp CTA strip */}
      <section className="py-8 px-4 flex items-center justify-center gap-6 bg-white border-b border-gray-100">
        <p className="text-lg font-semibold text-gray-800 text-center">
          Quando precisar de uma ajudinha,<br />
          <span className="text-green-600">{vendedor}</span> est\u00e1 sempre \u00e0 disposi\u00e7\u00e3o!
        </p>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 w-14 h-14"
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
          <div
            key={cat.name}
            className="flex items-stretch rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
          >
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

      {/* Product types */}
      <section className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {productTypes.map((product) => (
          <div
            key={product.name}
            className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-white"
          >
            <div className="h-40 bg-gray-100" />
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{product.description}</p>
              <a
                href={waMsg}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center bg-green-500 text-white rounded-lg py-2 text-sm font-medium hover:bg-green-600 transition-colors"
              >
                Pedir or\u00e7amento
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* Destaques */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-8">Destaques</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {destaquesItems.map((item) => (
            <div
              key={item.name}
              className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
            >
              <div
                className="h-56 bg-cover bg-center bg-gray-100"
                style={{ backgroundImage: `url('${item.imageUrl}')` }}
              />
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-3">{item.name}</h3>
                <a
                  href={waMsg}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center bg-gray-900 text-white rounded-lg py-2 text-sm font-medium hover:bg-gray-700 transition-colors"
                >
                  Falar com {vendedor}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-gray-900 text-white py-12 px-4 text-center">
        <p className="text-xl font-semibold mb-2">Pronto para transformar seus ambientes?</p>
        <p className="text-gray-400 mb-6">
          Fale diretamente com {vendedor} e receba um atendimento personalizado.
        </p>
        <a
          href={waMsg}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-green-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors text-lg"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt=""
            className="w-6 h-6"
          />
          Chamar {vendedor} agora
        </a>
      </section>

      {/* Floating WhatsApp */}
      <a
        href={waLink}
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

      {/* Bottom bar */}
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-400 bg-white">
        Decorwall Arte e Decora\u00e7\u00e3o \u00b7 CNPJ: 04.505.259/0001-45
      </div>
    </>
  );
}
