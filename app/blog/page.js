import Link from 'next/link';
import Image from 'next/image';
import { getAllPosts, getAllCategories } from '@/lib/blog/posts.js';
import { Button } from '@/components/ui/button';
import Header from '../dashboard/_components/Header';

export const metadata = {
  title: 'Blog - AI Room Design',
  description: 'Dicas, tendências e inspirações sobre design de interiores e decoração.',
};

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function BlogPage({ searchParams }) {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const filterCat = searchParams?.cat || null;
  const filtered = filterCat ? posts.filter(p => p.categories.includes(filterCat)) : posts;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-20">
        {/* Hero Section */}
        <section className="px-4 py-12 bg-gradient-to-br from-gray-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-black">
              Blog DecoFlow
            </h1>
            <p className="text-xl text-gray-600 mb-0 max-w-2xl mx-auto">
              Inspirações, tendências e dicas profissionais para transformar seus ambientes com estilo e funcionalidade.
            </p>
          </div>
        </section>

        {/* Categories - centralizado abaixo do hero */}
        {categories.length > 0 && (
          <section className="px-4 py-2">
            <div className="max-w-4xl mx-auto flex justify-center flex-wrap gap-3">
              <Link href="/blog" className={`px-3 py-1 rounded-full text-sm border ${!filterCat ? 'bg-black text-white' : 'bg-white text-gray-700'}`}>Todas</Link>
              {categories.map(cat => (
                <Link key={cat} href={`/blog?cat=${encodeURIComponent(cat)}`} className={`px-3 py-1 rounded-full text-sm border ${filterCat===cat ? 'bg-black text-white' : 'bg-white text-gray-700'}`}>{cat}</Link>
              ))}
            </div>
          </section>
        )}

        {/* Posts Grid - Seguindo o padrão da referência */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Ainda não há posts publicados
                </h2>
                <p className="text-gray-600 mb-8">
                  Em breve teremos muito conteúdo sobre design de interiores!
                </p>
                <Button asChild>
                  <Link href="/dashboard">Criar Design</Link>
                </Button>
              </div>
            ) : (
              <PostsGridList>
                {filtered.map((post) => (
                  <PostPreview key={post.slug} post={post} />
                ))}
              </PostsGridList>
            )}
          </div>
        </section>
        

        {/* CTA Section */}
        <section className="px-4 py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pronto para transformar seu ambiente?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Use nossa IA para aplicar as dicas do blog no seu próprio espaço
            </p>
            <Button asChild size="lg" className="px-8 py-6 text-lg font-semibold">
              <Link href="/dashboard/create-new">Criar Design Agora</Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

// Grid de Posts - Replicando exatamente o padrão da referência
function PostsGridList({ children }) {
  return (
    <div className="grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-8 md:gap-y-12 lg:grid-cols-3 lg:gap-x-12">
      {children}
    </div>
  );
}

// PostPreview - Replicando o padrão da referência
function PostPreview({ post }) {
  const slug = `/blog/${post.slug}`;
  const imageHeight = 250;

  return (
    <div className="transition-shadow-sm flex flex-col gap-y-4 rounded-lg duration-500">
      {post.image && (
        <div className="relative mb-2 w-full" style={{ height: imageHeight }}>
          <Link href={slug}>
            <div className="relative w-full h-full rounded-lg overflow-hidden">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </Link>
        </div>
      )}

      <div className="flex flex-col space-y-4 px-1">
        <div className="flex flex-col space-y-2">
          <h2 className="text-xl leading-snug font-semibold tracking-tight">
            <Link href={slug} className="hover:underline">
              {post.title}
            </Link>
          </h2>

          <div className="flex flex-row items-center gap-x-3 text-sm">
            <div className="text-gray-500">
              {formatDate(post.publishedAt)}
            </div>
            <span className="text-gray-400">•</span>
            <div className="text-gray-500">
              {post.readingTime} min de leitura
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3">
          {post.description}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
