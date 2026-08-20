// ---------------------------------------------------------------------------
// PUNTO DE CARGA DE DATOS DE "VIDA" — el único fichero que hay que tocar
// para cambiar de dónde vienen los datos del archipiélago y de /libros.
// ---------------------------------------------------------------------------

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface VidaCategoria {
  id: number;
  slug: string;
  nombre: string;
  descripcion: string | null;
  orden: number;
  posX: number;
  posY: number;
  radio: number;
  tipoContenido: "items" | "portal";
  urlDestino: string | null;
  endpointPreview: string | null;
  publicada: boolean;
}

export interface VidaEnlace {
  tipo: string;
  url: string;
  etiqueta: string | null;
}

export interface VidaMediaItem {
  tipo: string;
  src: string;
  alt: string | null;
  principal: boolean;
}

export interface VidaItem {
  id: number;
  slug: string;
  categoria: string; // slug de la categoría
  ambito: string | null;
  titulo: string;
  subtitulo: string | null;
  resumen: string;
  descripcion: string | null;
  fechaInicio: string;
  fechaFin: string | null;
  precisionFecha: "anio" | "mes" | "dia";
  enCurso: boolean;
  destacado: boolean;
  peso: number;
  ciudad: string | null;
  pais: string | null;
  lat: number | null;
  lng: number | null;
  meta: Record<string, unknown>;
  tags: string[];
  enlaces: VidaEnlace[];
  media: VidaMediaItem[];
  relacionados: string[]; // slugs de otros ítems
}

export interface VidaLibroDestacado {
  titulo: string;
  autor: string;
  anio_lectura: number;
  color: string | null;
}

export interface VidaLibrosPreview {
  total: number;
  este_anio: number;
  cifra: string;
  destacados: VidaLibroDestacado[];
}

export interface VidaLibro {
  titulo: string;
  autor: string;
  anioLectura: number;
  genero: string | null;
  nota: string | null;
  color: string | null;
}

export interface VidaLibrosResumen {
  total: number;
  esteAnio: number;
  cifra: string;
}

export interface VidaLibrosCatalogo {
  resumen: VidaLibrosResumen;
  libros: VidaLibro[];
}

export const fetchVidaCategorias = async (): Promise<VidaCategoria[]> => {
  try {
    const res = await fetch(`${API_URL}/vida/categorias`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
};

export const fetchVidaItems = async (): Promise<VidaItem[]> => {
  try {
    const res = await fetch(`${API_URL}/vida/items`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
};

export const fetchVidaLibrosPreview = async (): Promise<VidaLibrosPreview | null> => {
  try {
    const res = await fetch(`${API_URL}/vida/libros/preview`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
};

// Catálogo completo (sin paginar): la página de /libros agrupa, busca y filtra
// por género en el cliente, así que necesita la lista entera de una vez.
export const fetchVidaLibros = async (): Promise<VidaLibrosCatalogo | null> => {
  try {
    const res = await fetch(`${API_URL}/vida/libros`, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
};
