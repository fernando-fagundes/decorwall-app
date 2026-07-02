const heroImage =
  "https://fotomural.com.br/version-test/files/style_photo/f_auto,q_auto/1729019245893x6118937568389775000/WhatsApp%20Image%202024-10-15%20at%2020.04.57.jpeg";

const vantagens = [
  {
    titulo: "Atendimento com Especialista",
    desc: "Quando precisar de uma ajudinha, estaremos sempre à disposição!",
  },
  {
    titulo: "Novidades",
    desc: "Receberá dicas e novidades de estampas novas e tendências!",
  },
  {
    titulo: "Marketing",
    desc: "Você terá acesso a materiais de marketing e divulgação, fotos para utilizar onde quiser.",
  },
  {
    titulo: "Know-how de mais de 15 Anos",
    desc: "A experiência nos ajuda a melhorar e dar o melhor suporte do mercado.",
  },
  {
    titulo: "Plataforma Própria",
    desc: "Conteúdos de marketing, treinamentos e acompanhamento de pedidos tudo em um só lugar.",
  },
  {
    titulo: "Preços Competitivos",
    desc: "Tendo o substrato próprio conseguimos manter o melhor preço do mercado.",
  },
];

interface LandPageProps {
  vendedor: string;
  whatsapp: string;
}

export default function LandPage({ vendedor, whatsapp }: LandPageProps) {
  const waLink = `https://wa.me/${whatsapp}`;
  const waMsg = `https://wa.me/${whatsapp}?text=Ol%C3%A1%2C%20tenho%20interesse%20em%20ser%20um%20revendedor%20Decorwall!`;

  return (
    <>
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-4 border-b border-gray-100 bg-white">
        <div>
          <div className="text-3xl font-light tracking-wide">
            <span className="text-gray-900">Decor</span>
            <span className="text-red-800 font-bold">Wall</span>
          </div>
          <div className="text-xs text-gray-400 tracking-widest mt-0.5">Arte e Decoração</div>
        </div>
        <div className="flex gap-5 items-center">
          <a href="https://www.facebook.com/decorwallbrasil" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-600 transition-colors">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
          </a>
          <a href="https://www.instagram.com/decorwall.brasil" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-pink-500 transition-colors">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-10 py-16 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1">
          <h1 className="text-4xl font-bold leading-snug mb-8">
            <span className="font-extrabold">Seja um Revendedor</span><br />
            <span className="font-normal">e venha fazer parte</span><br />
            <span className="font-normal">da </span><strong>família Decorwall</strong>!
          </h1>
          <a
            href={waMsg}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 text-white px-8 py-3 rounded font-semibold hover:bg-green-600 transition-colors mb-10 text-base"
          >
            Chame no Whatsapp →
          </a>
          <p className="text-gray-400 text-xl mt-4">#sejadecorwall</p>
        </div>
        <div className="flex-1">
          <img
            src={heroImage}
            alt="Decorwall"
            className="w-full rounded-2xl shadow-md"
          />
        </div>
      </section>

      {/* Sobre a Decorwall */}
      <section className="max-w-2xl mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-light mb-6 text-gray-800">Sobre a Decorwall</h2>
        <p className="text-gray-600 leading-relaxed mb-4">
          A Decorwall se destaca como a maiores fabricantes de papel de parede personalizado
          no Brasil e tem uma ampla rede de revendedores, com presença em 15 estados e mais
          de 500 distribuidores.
        </p>
        <p className="text-gray-600 leading-relaxed">
          Seu portfólio inclui mais de 20.000 projetos de paredes transformadas, abrangendo
          estilos desde o clássico até o moderno, atendendo à demanda crescente por
          personalização e sofisticação na decoração
        </p>
      </section>

      {/* Vantagens */}
      <section className="bg-gray-900 text-white py-16 px-8">
        <h2 className="text-2xl font-light text-center mb-12">
          Vantagens de ser um revendedor Decorwall
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {vantagens.map((v) => (
            <div key={v.titulo}>
              <p className="font-bold mb-2">{v.titulo}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <a
            href={waMsg}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 text-white px-10 py-3 rounded font-semibold hover:bg-green-600 transition-colors"
          >
            Atendimento para revendedor →
          </a>
        </div>
      </section>

      {/* O Mercado de Papel Personalizado */}
      <section className="bg-pink-50 rounded-2xl max-w-5xl mx-auto my-12 px-10 py-10">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-900">
          O Mercado de Papel Personalizado
        </h2>
        <div className="flex flex-col md:flex-row gap-10 items-start">
          <div className="flex-1 text-gray-700 leading-relaxed text-sm">
            <p className="mb-4">
              O <strong>mercado</strong> de papel de parede <strong>personalizado</strong> no{" "}
              <strong>Brasil</strong> tem <strong>crescido</strong> consideravelmente nos últimos
              anos, impulsionado por <strong>mudanças no comportamento</strong> dos consumidores e{" "}
              <strong>tendências de design</strong> de interiores. A <strong>busca</strong> por{" "}
              <strong>personalização</strong> e <strong>diferenciação</strong>, tanto em residências
              quanto em ambientes comerciais, tem gerado uma <strong>demanda crescente</strong> por
              produtos que <strong>reflitam o estilo</strong> pessoal e criem{" "}
              <strong>ambientes únicos</strong>.
            </p>
            <p className="font-bold mb-2">Fatores que impulsionam o crescimento:</p>
            <p>
              -Personalização e Exclusividade<br />
              -Avanços Tecnológicos<br />
              -Tendência Crescente de Decoração e Reformas
            </p>
          </div>
          <div className="flex-1">
            <iframe
              width="100%"
              height="270"
              src="https://www.youtube.com/embed/Vc2CdilV6Uo?rel=0"
              title="Papel de parede personalizado DecorWall Brasil"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-xl"
            />
          </div>
        </div>
      </section>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 py-4 text-center text-xs text-gray-400 bg-white">
        Decorwall Arte e Decoração · CNPJ: 04.505.259/0001-45
      </div>

      {/* Floating WhatsApp */}
      <a
        href={waLink}
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
    </>
  );
}
