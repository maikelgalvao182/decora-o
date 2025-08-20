import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Header from "./dashboard/_components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header/>
      
      {/* Hero Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          {/* Rating moved to top */}
          <div className="flex flex-col items-center mb-8 space-y-4">
            {/* Avatares no topo */}
            <div className="flex -space-x-2">
              <Image src="/avatar/Female.jpg" alt="Cliente satisfeito" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-white" />
              <Image src="/avatar/Female (1).jpg" alt="Cliente satisfeito" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-white" />
              <Image src="/avatar/avatar2.jpg" alt="Cliente satisfeito" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-white" />
              <Image src="/avatar/Female (2).jpg" alt="Cliente satisfeito" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-white" />
              <Image src="/avatar/avatar3.jpg" alt="Cliente satisfeito" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-white" />
            </div>
            {/* Estrelas e texto abaixo */}
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">Mais de 1000 clientes satisfeitos</span>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-black">
            Crie um Projeto de Decoração para sua Casa ou Empresa com apenas um Clique.
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Em apenas 30 segundos nossa Inteligência Artificial analisa e transforma fotos de qualquer ambiente em decorações de alto padrão, com mais de 50 estilos disponíveis.
          </p>
          <Button asChild size="lg" className="px-8 py-6 text-lg font-semibold">
            <Link href="/dashboard">Teste Grátis Agora!</Link>
          </Button>
        </div>

        {/* Hero Video */}
        <div className="max-w-5xl mx-auto mt-16">
          <div className="relative w-full overflow-hidden aspect-video bg-black border-0 outline-none rounded-2xl">
            <iframe
              className="w-full h-full border-0 outline-none"
              width="1920"
              height="1080"
              src="https://www.youtube.com/embed/mHcAmsx174Q?si=YkVsM8hZJukQ-6nA"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      {/* Como Usar Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">São apenas 4 passos simples para criar<br /> seu projeto de decoração</h2>
            <p className="text-xl text-gray-600">Você vai economizar muito tempo e dinheiro com poucos cliques.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Cards de texto à esquerda */}
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Tire uma Foto do seu Ambiente</h3>
                  <p className="text-gray-600">Esqueça projetos caros que levam meses pra ficar prontos, tire uma foto do ambiente que você quer decorar e envie.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Escolha um Estilo de Decoração</h3>
                  <p className="text-gray-600">São 50 tipos de estilos disponíveis: sofisticado, moderno, contemporâneo, minimalista, industrial, vintage...</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Escolha o Tipo de Ambiente</h3>
                  <p className="text-gray-600">Sala de estar, Sala de jantar, quarto, banheiro, cozinha, escritório, quarto infantil...</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Nossa IA Projeta a Decoração em Segundos!</h3>
                  <p className="text-gray-600">Nossa IA gera decoração baseada no tema que você selecionou, se não gostar, basta gerar uma nova imagem.</p>
                </div>
              </div>
            </div>

            {/* Imagem de cozinha preenchendo todo o container */}
            <div className="relative rounded-3xl overflow-hidden min-h-[600px] h-full w-full">
              <Image 
                src="/decoracao-cozinha.jpg" 
                alt="Exemplo de cozinha decorada gerada por IA" 
                fill
                priority
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Sketch to Render Section */}
      <section className="px-4 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transforme Seus Esboços e SketchUp<br />
              em Renderizações Fotorrealistas
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Desenhos à mão ou feitos no SketchUp deixam de ser rascunhos em menos de 30 segundos e se transformam em imagens fotorrealistas. 
              Mostre aos clientes não apenas um rascunho, mas uma visão concreta de como o projeto pode ganhar vida.
            </p>
          </div>

          {/* Examples */}
          <div className="space-y-8">
            {/* SketchUp Examples */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="relative group">
                <Image 
                  src="/sketch/sketchup-modelo-3d-antes.jpeg" 
                  alt="SketchUp antes - modelo 3D básico" 
                  width={500} 
                  height={400} 
                  className="rounded-lg w-full h-[400px] object-cover"
                />
                <div className="absolute top-4 left-4">
          <span className="bg-black/80 text-white px-3 py-1 text-sm font-medium rounded">Antes</span>
                </div>
              </div>
              <div className="relative group">
                <Image 
                  src="/sketch/sketchup-render-depois.jpeg" 
                  alt="SketchUp depois - renderização fotorrealista" 
                  width={500} 
                  height={400} 
                  className="rounded-lg w-full h-[400px] object-cover"
                />
                <div className="absolute top-4 left-4">
          <span className="bg-black text-white px-3 py-1 text-sm font-medium rounded">Depois</span>
                </div>
              </div>
            </div>

            {/* Hand Sketch Examples */}
            <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="relative group">
                <Image 
                  src="/rabiscos/esboco-mao-antes.jpeg" 
                  alt="Esboço à mão antes" 
                  width={500} 
                  height={400} 
                  className="rounded-lg w-full h-[400px] object-cover"
                />
                <div className="absolute top-4 left-4">
          <span className="bg-black/80 text-white px-3 py-1 text-sm font-medium rounded">Antes</span>
                </div>
              </div>
              <div className="relative group">
                <Image 
                  src="/rabiscos/esboco-render-depois.jpeg" 
                  alt="Esboço transformado em renderização" 
                  width={500} 
                  height={400} 
                  className="rounded-lg w-full h-[400px] object-cover"
                />
                <div className="absolute top-4 left-4">
          <span className="bg-black text-white px-3 py-1 text-sm font-medium rounded">Depois</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Categories Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Você pode Decorar qualquer Espaço<br />
              da sua Casa ou Empresa
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { title: "Decoração de Quarto", image: "/decoracao-quarto-antes.jpg" },
                { title: "Decoração de Cozinha", image: "/decoracao-cozinha.jpg" },
                { title: "Decoração Sala de Jantar", image: "/decoracao-sala-jantar.png" },
                { title: "Decoração de Banheiro", image: "/decoracao-banheiro-moderno.png" },
                { title: "Decoração para Restaurantes", image: "/decoracao-restaurante-industrial.png" },
                { title: "Decoração de Escritório", image: "/decoracao-escritorio-minimalista.png" },
                { title: "Decoração Sala de TV", image: "/decoracao-sala-tv.jpeg" },
                { title: "Decoração de Sala", image: "/decoracao-sala-jantar.png" }
            ].map((category, index) => (
              <div key={index} className="relative group cursor-pointer overflow-hidden rounded-2xl">
                <Image 
                  src={category.image} 
                  alt={category.title} 
                  width={400} 
                  height={300} 
                  className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white text-xl font-semibold">{category.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Design Styles Section */}
      <section className="px-4 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Escolha entre mais de 50 estilos<br /> de design de interiores
            </h2>
            <p className="text-lg text-purple-600 font-semibold">
              Todos os estilos estão incluídos! Você pode experimentar quantos quiser.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Modern", title: "Moderno", description: "Caracterizado por linhas limpas, cores neutras e simplicidade, com foco na funcionalidade em vez da decoração.", image: "/estilos/modern.jpeg" },
              { name: "Minimalist", title: "Minimalista", description: "Enfatiza extrema simplicidade, espaços organizados e um esquema de cores monocromático para criar um ambiente tranquilo.", image: "/estilos/minimalist.jpeg" },
              { name: "Simple", title: "Simples", description: "Foca na funcionalidade e decoração minimalista para um espaço limpo e organizado.", image: "/estilos/simple.jpeg" },
              { name: "Scandinavian", title: "Escandinavo", description: "Caracterizado pela funcionalidade, simplicidade e conexão com a natureza, com uma paleta de cores claras e suaves.", image: "/estilos/scandinavian.jpeg" },
              { name: "Contemporary", title: "Contemporâneo", description: "Apresenta tendências atuais com foco na simplicidade, sofisticação sutil e linhas limpas.", image: "/estilos/contemporary.jpeg" },
              { name: "Luxury", title: "Luxo", description: "Apresenta materiais de alta qualidade, designs sofisticados e atenção meticulosa aos detalhes para uma sensação opulenta.", image: "/estilos/luxury.jpeg" },
              { name: "French", title: "Francês", description: "Exala elegância e requinte, com detalhes ornamentados, tecidos luxuosos e uma paleta de cores clássica.", image: "/estilos/french.jpeg" },
              { name: "Airbnb", title: "Airbnb", description: "Um estilo acolhedor, confortável e versátil, que visa agradar a uma ampla gama de gostos, muitas vezes incorporando toques locais.", image: "/estilos/airbnb.jpeg" },
              { name: "Neoclassic", title: "Neoclássico", description: "Combina elegância e simetria com motivos clássicos, apresentando grandes colunas, molduras ornamentadas e materiais luxuosos.", image: "/estilos/neoclassic.jpeg" },
              { name: "Boho-chic", title: "Boho-chic", description: "Uma atualização boêmia com um toque de moda, misturando padrões, cores e texturas para um clima descontraído.", image: "/estilos/boho-chic.jpeg" },
              { name: "Futuristic", title: "Futurista", description: "Incorpora designs elegantes e inovadores e tecnologia avançada para um visual moderno e inovador.", image: "/estilos/futuristic.jpeg" },
              { name: "Tropical", title: "Tropical", description: "Apresenta vegetação exuberante, cores brilhantes e materiais naturais para evocar a sensação de um paraíso tropical.", image: "/estilos/tropical.jpeg" },
              { name: "Midcentury Modern", title: "Moderno de Meados do Século", description: "Caracterizado por linhas elegantes, formas orgânicas e design funcional de meados do século XX.", image: "/estilos/midcentury-modern.jpeg" },
              { name: "Traditional", title: "Tradicional", description: "Apresenta detalhes clássicos, móveis suntuosos e um profundo respeito pelo design histórico.", image: "/estilos/traditional.jpeg" },
              { name: "Cottagecore", title: "Cottagecore", description: "Celebra a vida rural com móveis vintage, padrões florais e uma estética aconchegante e feita à mão.", image: "/estilos/cottagecore.jpeg" },
              { name: "Modern Boho", title: "Boho Moderno", description: "O estilo Boho moderno mistura decoração descontraída e eclética com toques limpos e contemporâneos.", image: "/estilos/modern-boho.jpeg" },
              { name: "Parisian", title: "Parisiense", description: "Elegante e sofisticado, com uma mistura de elementos históricos e modernos, refletindo o gosto parisiense.", image: "/estilos/parisian.jpeg" },
              { name: "Zen", title: "Zen", description: "Concentra-se na tranquilidade e na simplicidade, inspirado no minimalismo japonês e nos elementos naturais.", image: "/estilos/zen.jpeg" },
              { name: "Eclectic", title: "Eclético", description: "Combina vários estilos, texturas e cores para um interior único e personalizado.", image: "/estilos/eclectic.jpeg" },
              { name: "Industrial", title: "Industrial", description: "Apresenta materiais brutos e inacabados, como tijolos aparentes, metal e concreto, para uma aparência rústica de armazém.", image: "/estilos/industrial.jpeg" },
              { name: "Eco-friendly", title: "Ecológico", description: "Enfatiza materiais sustentáveis e naturais e design com eficiência energética para minimizar o impacto ambiental.", image: "/estilos/eco-friendly.jpeg" },
              { name: "Bohemian", title: "Boêmio", description: "Uma estética de espírito livre que mistura texturas, padrões e cores para um visual pessoal e eclético.", image: "/estilos/bohemian.jpeg" },
              { name: "Mediterranean", title: "Mediterrâneo", description: "Inspirado nas cores e texturas da região, com arcos, terracota e uma paleta ensolarada.", image: "/estilos/mediterranean.jpeg" },
              { name: "Farmhouse", title: "Casa de Fazenda", description: "Combina o aconchego rústico com a simplicidade moderna, apresentando texturas naturais e uma paleta neutra.", image: "/estilos/farmhouse.jpeg" },
              { name: "Retro Futuristic", title: "Retro Futurista", description: "Combina estilo retrô com elementos futuristas, imaginando o futuro como foi imaginado no passado.", image: "/estilos/retro-futuristic.jpeg" },
              { name: "French Country", title: "Campo Francês", description: "Evoca o charme do interior da França com cores suaves, materiais naturais e motivos florais.", image: "/estilos/french-country.jpeg" },
              { name: "Japanese Design", title: "Design Japonês", description: "Enfatiza o minimalismo, os materiais naturais e a harmonia com a natureza, seguindo a estética tradicional japonesa.", image: "/estilos/japanese-design.jpeg" },
              { name: "Vintage", title: "Vintage", description: "Incorpora peças com história e personalidade, geralmente de épocas específicas, para dar um toque nostálgico.", image: "/estilos/vintage.jpeg" },
              { name: "Retro", title: "Retrô", description: "Revive estilos do passado, especialmente dos anos 50, 60 e 70, para uma atmosfera nostálgica e divertida.", image: "/estilos/retro.jpeg" },
              { name: "Art Deco", title: "Art Déco", description: "Conhecida por seus padrões geométricos ousados, cores ricas e detalhes glamorosos, evocando luxo e sofisticação do início do século XX.", image: "/estilos/art-deco.jpeg" },
              { name: "Coastal", title: "Costeiro", description: "Captura a essência arejada do litoral, misturando paletas de cores claras e arejadas com texturas naturais.", image: "/estilos/coastal.jpeg" },
              { name: "Hollywood Glam", title: "Glamour de Hollywood", description: "Traz luxo e drama com cores ousadas, acabamentos brilhantes e um toque vintage de Hollywood.", image: "/estilos/hollywood-glam.jpeg" },
              { name: "Gaming Room", title: "Sala de Jogos", description: "Projetado para jogadores, conta com assentos confortáveis, diversas telas e iluminação LED vibrante.", image: "/estilos/gaming-room.jpeg" },
              { name: "Sketch", title: "Esboço", description: "Um estilo artístico e inacabado que incorpora elementos e contornos ásperos e desenhados à mão no interior.", image: "/estilos/sketch.jpeg" },
              { name: "Biophilic", title: "Biofílico", description: "Integra elementos naturais, vegetação e luz natural para aumentar a conectividade com o ambiente natural.", image: "/estilos/biophilic.jpeg" },
              { name: "Shabby Chic", title: "Shabby Chic", description: "Combina elegância vintage com um visual desgastado para uma sensação confortável e vivida.", image: "/estilos/shabby-chic.jpeg" },
              { name: "Gothic", title: "Gótico", description: "Escuro e dramático, com cores ricas, detalhes ornamentados e um toque de elegância medieval.", image: "/estilos/gothic.jpeg" },
              { name: "Tribal", title: "Tribal", description: "Incorpora padrões, texturas e arte indígenas, celebrando a herança cultural e adicionando calor natural.", image: "/estilos/tribal.jpeg" },
              { name: "Christmas", title: "Natal", description: "Cheio de decorações festivas, luzes e cores como vermelho, verde e dourado para celebrar a temporada de festas.", image: "/estilos/christmas.jpeg" },
              { name: "Baroque", title: "Barroco", description: "Caracterizado por detalhes opulentos, cores dramáticas e grandiosidade, refletindo a extravagância do século XVII.", image: "/estilos/baroque.jpeg" },
              { name: "Rustic", title: "Rústico", description: "Abraça a beleza natural com madeira bruta, pedra e uma paleta inspirada no ar livre para uma sensação aconchegante.", image: "/estilos/rustic.jpeg" },
              { name: "Nautical", title: "Náutico", description: "Inspirado no mar, usando tons de azul e branco, acessórios marítimos e estampas listradas.", image: "/estilos/nautical.jpeg" },
              { name: "Maximalist", title: "Maximalista", description: "Abrange padrões ousados, cores vibrantes e uma mistura de texturas e épocas para um visual rico e em camadas.", image: "/estilos/maximalist.jpeg" },
              { name: "Art Nouveau", title: "Art Nouveau", description: "Apresenta linhas fluidas, formas naturais e padrões complexos inspirados na natureza, enfatizando o artesanato.", image: "/estilos/art-nouveau.jpeg" },
              { name: "Easter", title: "Páscoa", description: "Apresenta cores pastéis, padrões florais e decorações com tema de Páscoa, como ovos e coelhos.", image: "/estilos/easter.jpeg" },
              { name: "Ski Chalet", title: "Chalé de Esqui", description: "Evoca aconchego e calor com elementos rústicos, madeira natural e uma lareira, que lembra um chalé nas montanhas.", image: "/estilos/ski-chalet.jpeg" },
              { name: "Halloween", title: "Halloween", description: "Decoração que incorpora elementos góticos e assustadores e cores laranja e preto para evocar o espírito do Halloween.", image: "/estilos/halloween.jpeg" },
              { name: "Hot Pink", title: "Rosa Choque", description: "Um estilo ousado e vibrante que usa o rosa choque como cor de destaque para criar um espaço animado e cheio de energia.", image: "/estilos/hot-pink.jpeg" },
              { name: "Medieval", title: "Medieval", description: "Reflete o período histórico com móveis pesados de madeira, paredes de pedra e detalhes em ferro forjado.", image: "/estilos/medieval.jpeg" },
              { name: "Cyberpunk", title: "Cyberpunk", description: "Futurista e corajoso, misturando elementos de alta tecnologia com um toque distópico e detalhes em neon.", image: "/estilos/cyberpunk.jpeg" },
              { name: "Chinese New Year", title: "Ano Novo Chinês", description: "Incorpora decorações vermelhas e douradas, lanternas e símbolos de prosperidade para celebrar o ano novo lunar.", image: "/estilos/chinese-new-year.jpeg" },
              { name: "Vaporwave", title: "Vaporwave", description: "Um estilo retrô-futurista que combina a nostalgia dos anos 80 e 90 com cores pastéis e motivos digitais ou cibernéticos.", image: "/estilos/vaporwave.jpeg" }
            ].map((style, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                <div className="relative h-56 overflow-hidden">
                  <Image 
                    src={style.image} 
                    alt={style.title} 
                    width={400} 
                    height={300} 
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <div className="p-6 border-t border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{style.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{style.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto Para Transformar<br />
            Seu Ambiente?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Junte-se a milhares de pessoas que já transformaram seus espaços com nossa IA.
          </p>
          <Button asChild size="lg" className="px-8 py-6 text-lg font-semibold">
            <Link href="/dashboard">Teste Grátis Agora</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
