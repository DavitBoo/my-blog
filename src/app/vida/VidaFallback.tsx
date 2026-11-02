'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './vidaFallback.module.css';
import { fetchVidaCategorias, fetchVidaItems, VidaCategoria, VidaItem } from '../utils/vidaApi';
import { fmtRango, humaniza } from './vidaFormat';
import Loader from '../components/Loader';

interface VidaFallbackProps {
  // Sin esta función, la lista es la única vista posible porque no hay WebGL
  onVerEscena?: () => void;
  enfocarAlMontar?: boolean;
}

const VidaFallbackItem = ({
  item,
  itemMap,
}: {
  item: VidaItem;
  itemMap: Record<string, VidaItem>;
}) => {
  const lugar = [item.ciudad, item.pais].filter(Boolean).join(', ');
  const meta = Object.entries(item.meta || {});
  const relacionados = (item.relacionados || []).map((slug) => itemMap[slug]).filter(Boolean);

  return (
    <details className={styles.card}>
      <summary className={styles.cardSummary}>
        <h3 className={styles.cardTitle}>{item.titulo}</h3>
        <span className={styles.cardResumen}>{item.resumen}</span>
      </summary>
      <div className={styles.cardBody}>
        {item.subtitulo && <p className={styles.cardSubtitulo}>{item.subtitulo}</p>}
        <p className={styles.cardDato}>
          {fmtRango(item)}
          {lugar && ` · ${lugar}`}
        </p>
        {(item.descripcion || '')
          .split('\n\n')
          .filter(Boolean)
          .map((parrafo, i) => (
            <p key={i}>{parrafo}</p>
          ))}
        {item.media
          ?.filter((m) => m.tipo === 'imagen')
          .map((m) => (
            <Image
              key={m.src}
              src={m.src}
              alt={m.alt || ''}
              width={400}
              height={300}
              className={styles.cardImagen}
            />
          ))}
        {meta.length > 0 && (
          <dl className={styles.cardMeta}>
            {meta.map(([clave, valor]) => (
              <div key={clave}>
                <dt>{humaniza(clave)}</dt>
                <dd>{String(valor)}</dd>
              </div>
            ))}
          </dl>
        )}
        {item.tags?.length > 0 && <p className={styles.cardDato}>{item.tags.join(' · ')}</p>}
        {item.enlaces?.map((enlace) => (
          <a key={enlace.url} href={enlace.url} target="_blank" rel="noreferrer">
            {enlace.etiqueta || enlace.tipo}
          </a>
        ))}
        {relacionados.length > 0 && (
          <p className={styles.cardDato}>
            Conectado con: {relacionados.map((r) => r.titulo).join(', ')}
          </p>
        )}
      </div>
    </details>
  );
};

// Misma información que el archipiélago, sin la escena 3D: para quien no tiene WebGL o prefiere leer
const VidaFallback = ({ onVerEscena, enfocarAlMontar = false }: VidaFallbackProps) => {
  const [categorias, setCategorias] = useState<VidaCategoria[]>([]);
  const [items, setItems] = useState<VidaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const tituloRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    (async () => {
      const [cats, its] = await Promise.all([fetchVidaCategorias(), fetchVidaItems()]);
      setCategorias(cats);
      setItems(its);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!loading && enfocarAlMontar) tituloRef.current?.focus();
  }, [loading, enfocarAlMontar]);

  if (loading) return <Loader message="Cargando vida..." />;

  const itemMap = Object.fromEntries(items.map((item) => [item.slug, item]));

  return (
    <main className={styles.wrap}>
      <div className={styles.cabecera}>
        <h1 ref={tituloRef} tabIndex={-1} className={styles.titulo}>
          Vida, en forma de lista
        </h1>
        {onVerEscena && (
          <button onClick={onVerEscena} className="btn">
            <span>Ver el archipiélago 3D</span>
          </button>
        )}
      </div>

      {!onVerEscena && (
        <div className={styles.notice}>
          Vista simplificada: tu navegador no soporta WebGL, así que no se puede mostrar la escena
          3D del archipiélago. Aquí tienes el mismo contenido organizado por categorías.
        </div>
      )}

      {categorias.length === 0 && (
        <p className={styles.empty}>
          No se pudo cargar el contenido. Inténtalo de nuevo más tarde.
        </p>
      )}

      {categorias.map((cat) => {
        const catItems = items.filter((i) => i.categoria === cat.slug);
        return (
          <section key={cat.slug}>
            <h2 className={styles.groupTitle}>{cat.nombre}</h2>
            {cat.descripcion && <p className={styles.empty}>{cat.descripcion}</p>}
            {cat.tipoContenido === 'portal' ? (
              <p className={styles.empty}>
                Los libros no están aquí: visita{' '}
                <Link href={cat.urlDestino || '/libros'}>{cat.urlDestino || '/libros'}</Link>.
              </p>
            ) : catItems.length === 0 ? (
              <p className={styles.empty}>Sin ítems todavía.</p>
            ) : (
              <div className={styles.grid}>
                {catItems.map((item) => (
                  <VidaFallbackItem key={item.slug} item={item} itemMap={itemMap} />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </main>
  );
};

export default VidaFallback;
