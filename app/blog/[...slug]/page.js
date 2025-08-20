import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import dynamic from 'next/dynamic';
import { getPostBySlug, getAllSlugParamArrays } from '@/lib/blog/posts.js';
import { Button } from '@/components/ui/button';
import Header from '../../dashboard/_components/Header';

const TableOfContentsClient = dynamic(() => import('@/components/blog/TableOfContentsClient'), { ssr: false });

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function generateStaticParams() {
  return getAllSlugParamArrays();
}

export async function generateMetadata({ params }) {
  const slugPath = params.slug.join('/');
  const post = getPostBySlug(slugPath);
  if (!post) return { title: 'Post não encontrado' };
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.image ? [{ url: post.image }] : [],
      type: 'article'
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : []
    }
  };
}

export default function BlogPostPage({ params }) {
  const slugPath = params.slug.join('/');
  const post = getPostBySlug(slugPath);
  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="pt-20 flex items-center justify-center h-64">
          <div className="text-lg">Post não encontrado</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div>
        <div className="container max-w-none p-0">
          <PostHeader post={post} slugArray={params.slug} />
          <div className="px-4 pb-8 lg:ml-[220px] lg:mr-[220px]">
            <div className="flex gap-8">
              <div className="flex-1 max-w-4xl">
                <article className="prose prose-lg max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                    components={{
                      h1: ({ children }) => {
                        const id = children?.toString()?.toLowerCase()?.replace(/[^\w\s-]/g, '')?.replace(/\s+/g, '-');
                        return <h1 id={id} className="text-3xl font-bold text-gray-900 mb-6 mt-8 scroll-mt-24">{children}</h1>;
                      },
                      h2: ({ children }) => {
                        const id = children?.toString()?.toLowerCase()?.replace(/[^\w\s-]/g, '')?.replace(/\s+/g, '-');
                        return <h2 id={id} className="text-2xl font-bold text-gray-900 mb-4 mt-8 scroll-mt-24">{children}</h2>;
                      },
                      h3: ({ children }) => {
                        const id = children?.toString()?.toLowerCase()?.replace(/[^\w\s-]/g, '')?.replace(/\s+/g, '-');
                        return <h3 id={id} className="text-xl font-semibold text-gray-900 mb-3 mt-6 scroll-mt-24">{children}</h3>;
                      },
                      p: ({ children }) => {
                        // Verifica se o parágrafo contém apenas uma imagem
                        const childArray = React.Children.toArray(children);
                        const hasOnlyImage = childArray.length === 1 && 
                          childArray[0]?.props?.src; // Detecta elemento img
                        
                        if (hasOnlyImage) {
                          return <>{children}</>;
                        }
                        
                        return <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>;
                      },
                      ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>,
                      li: ({ children }) => <li className="text-gray-700">{children}</li>,
                      blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-6 italic text-gray-700 bg-gray-50 p-4 rounded-r-lg mb-6">{children}</blockquote>,
                      code: ({ inline, children }) => inline ? (
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>
                      ) : (
                        <code className="block bg-gray-900 text-white p-4 rounded-lg overflow-x-auto text-sm font-mono">{children}</code>
                      ),
                      img: ({ src, alt }) => (
                        <div className="relative mb-6">
                          <Image
                            src={src}
                            alt={alt}
                            width={800}
                            height={400}
                            className="rounded-lg object-cover w-full"
                          />
                          <div className="absolute top-3 left-3">
                            <div className="bg-white text-black text-xs pl-3 pr-1 py-2 rounded-full shadow-md flex items-center gap-2">
                              <span>Imagem criada com inteligência artificial da DecorAFlow</span>
                              <Link href="/">
                                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                                  Teste grátis
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      )
                    }}
                  >
                    {post.content}
                  </ReactMarkdown>
                </article>
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex justify-center">
                    <Button asChild variant="outline"><Link href="/blog">← Voltar ao Blog</Link></Button>
                  </div>
                </div>
              </div>
              <div className="hidden xl:block w-80">
                <TableOfContentsClient content={post.content} />
              </div>
            </div>
          </div>
        </div>
        <section className="px-4 py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Gostou das dicas? Aplique no seu projeto!</h2>
            <p className="text-xl text-gray-600 mb-8">Use nossa IA para transformar seu ambiente com as tendências do blog</p>
            <Button asChild size="lg" className="px-8 py-6 text-lg font-semibold"><Link href="/dashboard/create-new">Ganhe 3 Criações Grátis</Link></Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function PostHeader({ post, slugArray }) {
  // Cria breadcrumb onde cada segmento (exceto o último que é o arquivo) gera um link
  // para a página principal do blog já filtrada pela categoria correspondente.
  // Antes: usava /blog/<segmento> que cai em rota de post (catch-all) e gera 404.
  const breadcrumbItems = [{ href: '/blog', label: 'Blog' }];
  // Os segmentos antes do nome do arquivo representam categorias/subcategorias
  const categorySegments = slugArray.slice(0, -1);

  function humanize(seg) {
    return seg.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  categorySegments.forEach((segment) => {
    breadcrumbItems.push({
      href: `/blog?cat=${encodeURIComponent(segment)}`,
      label: humanize(segment)
    });
  });

  return (
    <div className="relative">
      <div className="px-4 py-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <nav className="text-sm flex flex-wrap items-center gap-1">
            {breadcrumbItems.map((item, idx) => (
              <span key={item.href} className="flex items-center">
                <Link href={item.href} className="text-gray-600 hover:text-primary">{item.label}</Link>
                <span className="mx-2 text-gray-400">/</span>
              </span>
            ))}
            <span className="text-gray-900">{post.title}</span>
          </nav>
        </div>
      </div>
      <div className="px-4 py-0 md:py-12 bg-white">
        <div className="max-w-4xl mx-auto">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">{tag}</span>
              ))}
            </div>
          )}
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">{post.title}</h1>
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">{post.description}</p>
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <span>{formatDate(post.publishedAt)}</span>
            <span className="mx-2">•</span>
            <span>{post.readingTime} minutos de leitura</span>
          </div>
          {post.image && (
            <div className="relative aspect-video rounded-xl overflow-hidden">
              <Image src={post.image} alt={post.title} fill className="object-cover" priority />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
