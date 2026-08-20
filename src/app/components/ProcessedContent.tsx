'use client';

import { useEffect, useRef } from 'react';
import Carousel from './Carousel';
import { ProcessedCarousel } from '@/app/utils/processPostContent';

interface ProcessedContentProps {
  html: string;
  carousels?: ProcessedCarousel[];
}

export default function ProcessedContent({ html, carousels = [] }: ProcessedContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    contentRef.current.querySelectorAll('pre').forEach((pre) => {
      if (pre.querySelector('.copy-code-btn')) return;

      const btn = document.createElement('button');
      btn.textContent = 'Copiar';
      btn.className = 'copy-code-btn';
      btn.setAttribute('aria-label', 'Copiar código');
      btn.addEventListener('click', () => {
        const text = pre.querySelector('code')?.textContent ?? pre.textContent ?? '';
        navigator.clipboard.writeText(text).then(() => {
          btn.textContent = '¡Copiado!';
          setTimeout(() => { btn.textContent = 'Copiar'; }, 2000);
        }).catch(() => {
          btn.textContent = 'Error';
          setTimeout(() => { btn.textContent = 'Copiar'; }, 2000);
        });
      });

      pre.appendChild(btn);
    });
  }, [html]);

  return (
    <div className="article-content">
      <div ref={contentRef} dangerouslySetInnerHTML={{ __html: html }} />
      {carousels.map((carousel) => (
        <Carousel key={carousel.id} images={carousel.images} />
      ))}
    </div>
  );
}
