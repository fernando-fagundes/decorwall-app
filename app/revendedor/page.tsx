import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = { title: "Seja um Revendedor - DecorWall" };

export default function RevendedorPage() {
  return (
    <>
      <Header />
      <main>
        <section className="max-w-6xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-light"><span className="text-gray-800">Decor</span><span className="text-red-700">Wall</span></span>
              <span className="text-sm text-gray-500">Arte e Decoração</span>
            </div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">Seja um Revendedor</h1>
            <p className="text-2xl text-gray-700 mb-6">e venha fazer parte da <strong>família Decorwall</strong>!</p>
            <a href="https://wa.me/555132312340" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors">
              Chame no Whatsapp →
            </a>
            <p className="mt-6 text-gray-500 font-medium">#sejadecorwall</p>
          </div>
          <div className="rounded-2xl overflow-hidden">
            <img src="https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729019245893x611893756838977500/WhatsApp%20Image%202024-10-15%20at%2020.04.57.jpeg"
              alt="Decorwall Revendedor" className="w-full h-80 object-cover" />
          </div>
        </section>
        <section className="bg-gray-50 py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Sobre a Decorwall</h2>
            <p className="text-gray-600 mb-4 leading-relaxed">A Decorwall se destaca como a maior fabricante de papel de parede personalizado no Brasil e tem uma ampla rede de revendedores, com presença em 15 estados e mais de 500 distribuidores.</p>
            <p className="text-gray-600 mb-4 leading-relaxed">Seu portfólio inclui mais de 20.000 projetos de paredes transformadas, abrangendo estilos desde o clássico até o moderno.</p>
          </div>
        </section>
      </main>
      <a href="https://wa.me/555132312340" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 left-6 w-14 h-14 z-50">
        <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-14 h-14 drop-shadow-lg" />
      </a>
      <Footer />
    </>
  );
}
