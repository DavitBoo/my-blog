'use client';

import { useEffect } from 'react';
import { registerView } from '../utils/api';

interface ViewTrackerProps {
  type: 'posts' | 'projects';
  slug: string;
}

const BOT_USER_AGENT = /bot|crawl|spider|slurp|headless|preview/i;

// Solo cuenta quien abre la página en un navegador: los rastreadores que no ejecutan JavaScript y
// la generación de la imagen Open Graph no pasan por aquí. Una visita por pestaña y artículo.
export default function ViewTracker({ type, slug }: ViewTrackerProps) {
  useEffect(() => {
    if (navigator.webdriver || BOT_USER_AGENT.test(navigator.userAgent)) return;

    const storageKey = `viewed:${type}:${slug}`;
    try {
      if (sessionStorage.getItem(storageKey)) return;
      sessionStorage.setItem(storageKey, '1');
    } catch {
      // Sin sessionStorage (modo privado estricto) la visita se cuenta igualmente
    }

    registerView(type, slug).catch((error) => console.error('Failed to register view', error));
  }, [type, slug]);

  return null;
}
