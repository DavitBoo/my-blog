'use client';

import { useState, useEffect } from 'react';
import Carousel from './Carousel';

interface ProcessedContentProps {
  html: string;
}

export default function ProcessedContent({ html }: ProcessedContentProps) {
  const [processedHtml, setProcessedHtml] = useState('');
  const [carousels, setCarousels] = useState<{id: string, images: string[]}[]>([]);

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
        
        // Reemplazar con un marcador
        const marker = document.createElement('div');
        marker.id = id;
        marker.className = 'carousel-placeholder';
        carousel.replaceWith(marker);
      }
    });
    
    setCarousels(foundCarousels);
    setProcessedHtml(doc.body.innerHTML);
  }, [html]);

  return (
    <div className="article-content">
      <div dangerouslySetInnerHTML={{ __html: processedHtml }} />
      {carousels.map((carousel) => (
        <Carousel key={carousel.id} images={carousel.images} />
      ))}
    </div>
  );
}