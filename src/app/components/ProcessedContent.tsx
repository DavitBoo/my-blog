'use client';

import { useState, useEffect, useRef } from 'react';
import Carousel from './Carousel';
import { TocHeading } from './TableOfContents';

interface ProcessedContentProps {
  html: string;
  headings?: TocHeading[];
}

export default function ProcessedContent({ html, headings }: ProcessedContentProps) {
  const [processedHtml, setProcessedHtml] = useState('');
  const [carousels, setCarousels] = useState<{id: string, images: string[]}[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const foundCarousels: {id: string, images: string[]}[] = [];
    let carouselCount = 0;

    doc.querySelectorAll('div[data-type="carousel"]').forEach((carousel) => {
      const images = Array.from(carousel.querySelectorAll('img')).map(img => img.src);
      if (images.length > 0) {
        const id = `carousel-${carouselCount++}`;
        foundCarousels.push({ id, images });

        const marker = document.createElement('div');
        marker.id = id;
        marker.className = 'carousel-placeholder';
        carousel.replaceWith(marker);
      }
    });

    // Inject IDs into headings so TOC anchor links work
    if (headings?.length) {
      let i = 0;
      doc.querySelectorAll('h2, h3').forEach((heading) => {
        if (i < headings.length) {
          heading.id = headings[i].id;
          i++;
        }
      });
    }

    setCarousels(foundCarousels);
    setProcessedHtml(doc.body.innerHTML);
  }, [html, headings]);

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
  }, [processedHtml]);

  return (
    <div className="article-content">
      <div ref={contentRef} dangerouslySetInnerHTML={{ __html: processedHtml }} />
      {carousels.map((carousel) => (
        <Carousel key={carousel.id} images={carousel.images} />
      ))}
    </div>
  );
}