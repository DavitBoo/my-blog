export interface ProcessedCarousel {
  id: string;
  images: string[];
}

export interface ProcessedPostContent {
  html: string;
  carousels: ProcessedCarousel[];
}

// Reemplaza los bloques <div data-type="carousel">...</div> por un marcador
// vacío (el carrusel real se renderiza aparte como componente de cliente) y
// devuelve las imágenes encontradas en cada uno. Cuenta apertura/cierre de
// <div> para soportar divs anidados dentro del carrusel.
function extractCarousels(html: string): ProcessedPostContent {
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
      result += `<div id="${id}" class="carousel-placeholder"></div>`;
    } else {
      result += html.slice(openStart, blockEnd);
    }

    cursor = blockEnd;
  }

  return { html: result, carousels };
}

// Inyecta los ids ya calculados (slugify del texto) en los <h2>/<h3> del
// contenido, en el mismo orden en que se extrajeron para la tabla de
// contenidos, para que los anclajes del TOC funcionen.
function injectHeadingIds(html: string, headingIds: string[]): string {
  if (headingIds.length === 0) return html;

  let index = 0;
  return html.replace(/<(h[23])((?:\s+[^>]*)?)>/gi, (full, tag: string, attrs: string) => {
    if (index >= headingIds.length) return full;
    const id = headingIds[index++];
    const cleanedAttrs = attrs.replace(/\s+id=["'][^"']*["']/i, '');
    return `<${tag}${cleanedAttrs} id="${id}">`;
  });
}

export function processPostContent(html: string, headingIds: string[] = []): ProcessedPostContent {
  const { html: withoutCarousels, carousels } = extractCarousels(html);
  return { html: injectHeadingIds(withoutCarousels, headingIds), carousels };
}
