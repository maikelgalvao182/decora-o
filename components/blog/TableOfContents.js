import { useState, useEffect } from 'react';

export function TableOfContents({ content }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // Extrair headings do conteúdo markdown
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const matches = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      matches.push({
        id,
        text,
        level,
      });
    }

    setHeadings(matches);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '0% 0% -80% 0%',
      }
    );

    const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
    headingElements.forEach((el) => observer.observe(el));

    return () => {
      headingElements.forEach((el) => observer.unobserve(el));
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="hidden lg:block sticky top-24 max-h-screen overflow-y-auto">
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-4">
          Índice do Artigo
        </h3>
        <nav>
          <ul className="space-y-2">
            {headings.map((heading) => (
              <li key={heading.id}>
                <a
                  href={`#${heading.id}`}
                  className={`block text-sm transition-colors hover:text-primary ${
                    activeId === heading.id
                      ? 'text-primary font-medium'
                      : 'text-gray-600'
                  }`}
                  style={{
                    paddingLeft: `${(heading.level - 1) * 0.75}rem`,
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(heading.id)?.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
