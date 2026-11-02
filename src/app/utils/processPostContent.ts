import type { TocHeading } from '@/app/components/TableOfContents';

export interface ProcessedCarousel {
  id: string;
  images: string[];
}

export interface ProcessedPostContent {
  html: string;
  carousels: ProcessedCarousel[];
  headings: TocHeading[];
}

// Reemplaza los bloques <div data-type="carousel">...</div> por un marcador
// vacío (el carrusel real se renderiza aparte como componente de cliente) y
// devuelve las imágenes encontradas en cada uno. Cuenta apertura/cierre de
// <div> para soportar divs anidados dentro del carrusel.
function extractCarousels(html: string): Omit<ProcessedPostContent, 'headings'> {
  const carousels: ProcessedCarousel[] = [];
  const openTagRegex = /<div\b[^>]*data-type=["']carousel["'][^>]*>/i;
  const anyDivTagRegex = /<div\b[^>]*>|<\/div>/gi;

  let result = '';
  let cursor = 0;

  while (cursor < html.length) {
    const remaining = html.slice(cursor);
    const openMatch = remaining.match(openTagRegex);
    if (!openMatch || openMatch.index === undefined) {
      result += remaining;
      break;
    }

    const openStart = cursor + openMatch.index;
    const contentStart = openStart + openMatch[0].length;
    result += html.slice(cursor, openStart);

    anyDivTagRegex.lastIndex = contentStart;
    let depth = 1;
    let match: RegExpExecArray | null;
    let blockEnd = html.length;
    let innerEnd = html.length;

    while ((match = anyDivTagRegex.exec(html)) !== null) {
      if (match[0].toLowerCase().startsWith('</div')) {
        depth--;
        if (depth === 0) {
          innerEnd = match.index;
          blockEnd = match.index + match[0].length;
          break;
        }
      } else {
        depth++;
      }
    }

    const inner = html.slice(contentStart, innerEnd);
    const images = Array.from(inner.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)).map(
      (m) => m[1],
    );

    if (images.length > 0) {
      const id = `carousel-${carousels.length}`;
      carousels.push({ id, images });
      result += `<div data-carousel-id="${id}" class="carousel-placeholder"></div>`;
    } else {
      result += html.slice(openStart, blockEnd);
    }

    cursor = blockEnd;
  }

  return { html: result, carousels };
}

// Mantiene letras de cualquier alfabeto (griego, por ejemplo) y quita solo los acentos
const slugifyHeading = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const getUniqueId = (baseId: string, usedIds: Set<string>) => {
  let id = baseId;
  for (let suffix = 2; usedIds.has(id); suffix++) {
    id = `${baseId}-${suffix}`;
  }
  usedIds.add(id);
  return id;
};

// Recorre los <h2>/<h3> una sola vez para que cada entrada de la tabla de contenidos y su anclaje
// salgan del mismo título. Los títulos vacíos se quedan sin id y fuera de la tabla.
function injectHeadingIds(html: string): { html: string; headings: TocHeading[] } {
  const headings: TocHeading[] = [];
  const usedIds = new Set<string>();

  const result = html.replace(
    /<(h[23])((?:\s[^>]*)?)>([\s\S]*?)<\/\1>/gi,
    (full, tag: string, attrs: string, inner: string) => {
      const text = inner.replace(/<[^>]*>/g, '').trim();
      if (!text) return full;

      const id = getUniqueId(slugifyHeading(text) || 'seccion', usedIds);
      headings.push({ level: tag.toLowerCase(), text, id });

      const cleanedAttrs = attrs.replace(/\s+id=["'][^"']*["']/i, '');
      return `<${tag}${cleanedAttrs} id="${id}">${inner}</${tag}>`;
    },
  );

  return { html: result, headings };
}

export function processPostContent(html: string): ProcessedPostContent {
  const { html: withoutCarousels, carousels } = extractCarousels(html);
  const { html: withHeadingIds, headings } = injectHeadingIds(withoutCarousels);
  return { html: withHeadingIds, carousels, headings };
}
