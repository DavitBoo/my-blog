'use client';

import { useState, useEffect } from 'react';

export interface TocHeading {
  level: string;
  text: string;
  id: string;
}

export default function TableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-15% 0% -70% 0%' },
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  return (
    <nav className="toc" aria-label="Tabla de contenidos">
      <p className="toc-title">Contenidos</p>
      <ul className="toc-list">
        {headings.map(({ level, text, id }) => (
          <li key={id} className={`toc-item toc-${level}${activeId === id ? ' toc-active' : ''}`}>
            <a href={`#${id}`} className="toc-link">
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
