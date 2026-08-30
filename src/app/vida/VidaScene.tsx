'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './vida.module.css';
import {
  fetchVidaCategorias,
  fetchVidaItems,
  fetchVidaLibrosPreview,
  VidaCategoria,
  VidaItem,
  VidaLibrosPreview,
} from '../utils/vidaApi';
import { VidaEngine, VidaHoverInfo } from './vidaEngine';
import { AMBITOS, fmtRango, humaniza } from './vidaFormat';
import { useSiteTheme } from './useSiteTheme';
import VidaTooltip from './VidaTooltip';
import VidaDetailPanel, { VidaDetalle } from './VidaDetailPanel';
import VidaLecturasPanel from './VidaLecturasPanel';

const buildDetalle = (
  item: VidaItem,
  itemMap: Record<string, VidaItem>,
  catMap: Record<string, VidaCategoria>,
): VidaDetalle => {
  const cat = catMap[item.categoria];
  const meta = Object.entries(item.meta || {}).map(([k, v]) => ({ k: humaniza(k), v: String(v) }));
  const relacionados = (item.relacionados || [])
    .map((slug) => itemMap[slug])
    .filter((r): r is VidaItem => Boolean(r))
    .map((r) => ({
      slug: r.slug,
      titulo: r.titulo,
      categoria: catMap[r.categoria]?.nombre || r.categoria,
    }));

  return {
    slug: item.slug,
    titulo: item.titulo,
    subtitulo: item.subtitulo,
    resumen: item.resumen,
    categoria: cat?.nombre || item.categoria,
    ambito: (item.ambito && AMBITOS[item.ambito]) || '',
    tieneAmbito: !!item.ambito,
    fecha: fmtRango(item),
    peso: item.peso,
    lugar: [item.ciudad, item.pais].filter(Boolean).join(', '),
    tieneLugar: !!(item.ciudad || item.pais),
    parrafos: (item.descripcion || '').split('\n\n').filter(Boolean),
    tieneDesc: !!item.descripcion,
    media: item.media || [],
    tieneMedia: (item.media || []).length > 0,
    meta,
    tieneMeta: meta.length > 0,
    tags: item.tags || [],
    tieneTags: (item.tags || []).length > 0,
    enlaces: item.enlaces || [],
    tieneEnlaces: (item.enlaces || []).length > 0,
    relacionados,
    tieneRel: relacionados.length > 0,
  };
};

const VidaScene = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const miniRef = useRef<HTMLCanvasElement | null>(null);
  const tipRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<VidaEngine | null>(null);

  const [categorias, setCategorias] = useState<VidaCategoria[]>([]);
  const [items, setItems] = useState<VidaItem[]>([]);
  const [librosPreview, setLibrosPreview] = useState<VidaLibrosPreview | null>(null);
  const [dataReady, setDataReady] = useState(false);
  const [dataError, setDataError] = useState(false);
  const [cargando, setCargando] = useState(true);

  const [sel, setSel] = useState<VidaItem | null>(null);
  const [showLecturas, setShowLecturas] = useState(false);
  const [hover, setHover] = useState<VidaHoverInfo | null>(null);
  const [nDesc, setNDesc] = useState(0);
  const [totalIslas, setTotalIslas] = useState(0);
  const [ancho, setAncho] = useState(typeof window === 'undefined' ? 1200 : window.innerWidth);

  const tema = useSiteTheme();

  const catMap = useMemo(() => {
    const m: Record<string, VidaCategoria> = {};
    categorias.forEach((c) => (m[c.slug] = c));
    return m;
  }, [categorias]);
  const itemMap = useMemo(() => {
    const m: Record<string, VidaItem> = {};
    items.forEach((i) => (m[i.slug] = i));
    return m;
  }, [items]);

  useEffect(() => {
    let vivo = true;
    (async () => {
      const [cats, its, preview] = await Promise.all([
        fetchVidaCategorias(),
        fetchVidaItems(),
        fetchVidaLibrosPreview(),
      ]);
      if (!vivo) return;
      if (!cats.length) {
        setDataError(true);
        return;
      }
      setCategorias(cats);
      setItems(its);
      setLibrosPreview(preview);
      setDataReady(true);
    })();
    return () => {
      vivo = false;
    };
  }, []);

  useEffect(() => {
    const onResize = () => setAncho(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!dataReady || !canvasRef.current) return;
    const librosDestacados = librosPreview?.destacados || [];
    const engine = new VidaEngine(
      canvasRef.current,
      miniRef.current,
      categorias,
      items,
      librosDestacados,
      tema,
      true,
      {
        onHover: setHover,
        onCursorMove: (x, y) => {
          if (tipRef.current)
            tipRef.current.style.transform = `translate(${x + 16}px, ${y + 14}px)`;
        },
        onSelectItem: (item) => {
          setShowLecturas(false);
          setSel(item);
        },
        onSelectPortal: () => {
          setSel(null);
          setShowLecturas(true);
        },
        onDiscoveryChange: (n, total) => {
          setNDesc(n);
          setTotalIslas(total);
        },
      },
    );
    engineRef.current = engine;
    engine.start();
    setCargando(false);

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataReady]);

  useEffect(() => {
    engineRef.current?.setTema(tema);
  }, [tema]);

  const cerrarDetalle = () => engineRef.current?.seleccionarItem(null);
  const irA = (slug: string) => engineRef.current?.seleccionarItem(slug);
  const reiniciarNiebla = () => engineRef.current?.reiniciarNiebla();

  const verMini = !((sel || showLecturas) && ancho < 980);
  const detalle = sel ? buildDetalle(sel, itemMap, catMap) : null;

  if (dataError) {
    return (
      <div className={styles.root}>
        <div className={styles.loading}>
          <div className={styles.loadingLabel}>
            No se pudo cargar el archipiélago. Inténtalo de nuevo más tarde.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.overlay}>
        <div className={styles.intro}>
          <div className={styles.eyebrow}>Vida</div>
          <div className={styles.title}>Un archipiélago de siete islas</div>
          <div className={styles.subtitle}>
            Cada isla es una categoría, no un año. Arrastra el mar para descubrirlas.
          </div>
          <div className={styles.hints}>
            <div>Arrastra el mar para navegar · rueda o pinza para acercar</div>
            <div>Haz clic en una estructura para abrir su ficha</div>
          </div>
        </div>

        <Link href="/" className={styles.backLink}>
          ← Inicio
        </Link>

        {verMini && (
          <div className={styles.minimapWrap}>
            <div className={styles.minimapHeader}>
              <span className={styles.minimapLabel}>Archipiélago</span>
              <span className={styles.minimapCount}>
                {nDesc} / {totalIslas || categorias.length} islas
              </span>
            </div>
            <canvas ref={miniRef} width={500} height={424} className={styles.minimapCanvas} />
            <div className={styles.minimapFooter}>
              <span className={styles.legend}>
                <span className={styles.legendSwatch} />
                sin explorar
              </span>
              <button onClick={reiniciarNiebla} className={styles.resetLink}>
                reiniciar exploración
              </button>
            </div>
          </div>
        )}

        <VidaTooltip tipRef={tipRef} hover={hover} />

        {detalle && <VidaDetailPanel sel={detalle} onClose={cerrarDetalle} onIrA={irA} />}
        {showLecturas && librosPreview && (
          <VidaLecturasPanel lecturas={librosPreview} onClose={() => setShowLecturas(false)} />
        )}

        {cargando && (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <div className={styles.loadingLabel}>Levantando el archipiélago</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VidaScene;
