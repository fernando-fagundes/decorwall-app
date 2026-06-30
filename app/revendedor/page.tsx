import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Seja um Revendedor - DecorWall",
};

const CDN = "https://863c7441b944411b744b3e4d037f100f.cdn.bubble.io";

const vantagens = [
  {
    icon: "🎯",
    titulo: "Atendimento Especialista",
    desc: "Quando precisar de uma ajudinha, estaremos sempre à disposição!",
  },
  {
    icon: "📢",
    titulo: "Marketing Incluso",
    desc: "Você terá acesso a materiais de marketing e divulgação, fotos para utilizar onde quiser.",
  },
  {
    icon: "💻",
    titulo: "Plataforma Própria",
    desc: "Conteúdos de marketing, treinamentos e acompanhamento de pedidos tudo em um só lugar.",
  },
  {
    icon: "✨",
    titulo: "Novidades Constantes",
    desc: "Receberá dicas e novidades de estampas novas e tendências!",
  },
  {
    icon: "🏆",
    titulo: "Know-how de mais de 15 Anos",
    desc: "A experiência nos ajuda a melhorar e dar o melhor suporte do mercado.",
  },
  {
    icon: "💰",
    titulo: "Preços Competitivos",
    desc: "Tendo o substrato próprio conseguimos manter o melhor preço do mercado.",
  },
];

const depoimentos = [
  {
    nome: "Renata Mussatto",
    texto:
      "Atendimento personalizado com toda atenção possível! Foram incansáveis em prestar todo suporte para o atendimento de nossas necessidades. Nota mil! Parabéns a toda equipe de Decorwall!!",
  },
  {
    nome: "Leonardo Webster",
    texto:
      "Material de ótima qualidade. Atendimento, mesmo que remoto, rápido e exemplar. Obrigado Decorwall",
  },
  {
    nome: "Osvaldo Brand",
    texto:
      "Produtos de excelente qualidade, a gente se surpreende no final do trabalho supera nossas expectativas, atendimento personalizado com muita atenção, experiência e competência, e um ponto que temos que considerar é o pós vendas garantido a total satisfação de seus clientes.",
  },
];

export default function RevendedorPage() {
  return (
    <>
      <Header />
      <main>

        {/* HERO */}
        <section
          className="relative min-h-[560px] flex items-center overflow-hidden"
          style={{
            backgroundImage: `url('${CDN}/f1780509893874x613254443255299300/Infantil%20jardim%20menina%20bal%C3%B5es%20%C3%A1rvores.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-white">
            <p className="text-sm font-semibold uppercase tracking-widest mb-4 opacity-80">#sejadecorwall</p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              Seja um Revendedor
            </h1>
            <p className="text-2xl mb-8 font-light">
              e venha fazer parte da <strong>família Decorwall</strong>
            </p>
            <a
              href="https://wa.me/555132312340"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chame no WhatsApp
            </a>
          </div>
        </section>

        {/* SOBRE */}
        <section className="bg-white py-16 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Sobre a Decorwall</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                A Decorwall se destaca como a maior fabricante de papel de parede personalizado no Brasil
                e tem uma ampla rede de revendedores, com presença em <strong>15 estados</strong> e mais de <strong>500 distribuidores</strong>.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Seu portfólio inclui mais de <strong>20.000 projetos</strong> de paredes transformadas, abrangendo
                estilos desde o clássico até o moderno, atendendo à demanda crescente por personalização
                e sofisticação na decoração.
              </p>
            </div>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <div
                className="h-72 bg-cover bg-center"
                style={{ backgroundImage: `url('${CDN}/f1626465585015x559624273751845100/Design%20sem%20nome.webp')` }}
              />
            </div>
          </div>
        </section>

        {/* VANTAGENS */}
        <section className="bg-gray-50 py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-12">
              Vantagens de ser um revendedor Decorwall
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vantagens.map((v) => (
                <div key={v.titulo} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="text-3xl mb-3">{v.icon}</div>
                  <h3 className="font-bold text-gray-900 mb-2">{v.titulo}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-10">
              <a
                href="https://wa.me/555132312340"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-xl transition-colors"
              >
                Atendimento para revendedor →
              </a>
            </div>
          </div>
        </section>

        {/* MERCADO */}
        <section className="bg-white py-16 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <div
                className="h-80 bg-cover bg-center"
                style={{ backgroundImage: `url('${CDN}/f1626529257655x732613809621165800/76c9bb_4107f97cf982463f92e4c5c33dd9de1c_mv2.webp')` }}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">O Mercado de Papel Personalizado</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                O mercado de papel de parede personalizado cresceu consideravelmente nos últimos anos,
                impulsionado por mudanças no comportamento dos consumidores e tendências de design de
                interiores. A personalização e diferenciação, tanto em residências quanto em ambientes
                comerciais, tem gerado uma demanda crescente por produtos que reflitam o estilo pessoal
                e criem ambientes únicos.
              </p>
              <p className="text-gray-700 font-semibold mb-3">Fatores que impulsionam o crescimento:</p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Personalização e Exclusividade</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Avanços Tecnológicos</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-0.5">✓</span> Tendência Crescente de Decoração e Reformas</li>
              </ul>
              <p className="text-gray-600 mt-4 leading-relaxed">
                O consumidor está cada vez mais online e os negócios também precisam estar.
                Somos a maior empresa de papel de parede e revestimentos personalizados do Brasil,
                com produção em material diversificado e excelente margem de lucro.
              </p>
            </div>
          </div>
        </section>

        {/* 15 ESTADOS */}
        <section className="bg-gray-900 text-white py-14 px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">Já estamos em 15 estados</h2>
          <p className="text-gray-300 mb-8 text-lg">Mais de 500 revendedores em todo o Brasil</p>
          <a
            href="https://wa.me/555132312340"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-lg"
          >
            Atendimento para revendedor →
          </a>
          <p className="mt-6 text-green-400 font-semibold text-lg">#sejadecorwall</p>
        </section>

        {/* DEPOIMENTOS */}
        <section className="bg-gray-50 py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-10">
              O que dizem nossos revendedores
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {depoimentos.map((d) => (
                <div key={d.nome} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex mb-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">"{d.texto}"</p>
                  <p className="font-semibold text-gray-900 text-sm">{d.nome}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTATO */}
        <section className="bg-white py-16 px-4">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Ainda tem dúvidas?</h2>
            <p className="text-gray-500 mb-8">Para um contato de nossos vendedores, chame no WhatsApp.</p>
            <a
              href="https://wa.me/555132312340"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-10 py-4 rounded-xl transition-colors text-lg w-full justify-center"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Falar com um vendedor
            </a>
            <p className="mt-6 text-gray-400 text-sm">Decorwall Arte e Decoração · 51 3231-2340 / 3247-1760</p>
            <div className="mt-6">
              <Link href="/cadastro" className="text-sm text-gray-500 underline hover:text-gray-700">
                Gostaria de me cadastrar como revendedor
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* WhatsApp flutuante */}
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
