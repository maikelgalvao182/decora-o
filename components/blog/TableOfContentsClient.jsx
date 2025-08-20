"use client";
import { useState, useEffect } from 'react';

export default function TableOfContentsClient({ content }) {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const extracted = [];
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const raw = match[2].trim();
      const id = raw.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      extracted.push({ id, text: raw, level });
    }
    setHeadings(extracted);
  }, [content]);

  useEffect(() => {
    if (!headings.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveId(entry.target.id);
      });
    }, { rootMargin: '0% 0% -75% 0%' });

    const timer = setTimeout(() => {
      headings.forEach(h => {
        const el = document.getElementById(h.id);
        if (el) observer.observe(el);
      });
    }, 200);

    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [headings]);

  if (!headings.length) return null;

  return (
    <div className="sticky top-24 max-h-[75vh] overflow-y-auto">
      <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-3 text-sm tracking-wide uppercase">Índice</h3>
        <ul className="space-y-1">
          {headings.map(h => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`block text-sm leading-snug transition-colors hover:text-blue-600 ${activeId === h.id ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                style={{ paddingLeft: (h.level - 1) * 12 }}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
