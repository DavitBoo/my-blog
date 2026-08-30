'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './vidaFallback.module.css';
import { fetchVidaCategorias, fetchVidaItems, VidaCategoria, VidaItem } from '../utils/vidaApi';
import Loader from '../components/Loader';

// Vista simplificada y honesta para cuando el navegador no soporta WebGL:
// misma información, sin la escena 3D.
const VidaFallback = () => {
  const [categorias, setCategorias] = useState<VidaCategoria[]>([]);
  const [items, setItems] = useState<VidaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [cats, its] = await Promise.all([fetchVidaCategorias(), fetchVidaItems()]);
      setCategorias(cats);
      setItems(its);
      setLoading(false);
    })();
  }, []);

  if (loading) return <Loader message="Cargando vida..." />;

  return (
    <div className={styles.wrap}>
      <div className={styles.notice}>
        Vista simplificada — tu navegador no soporta WebGL, así que no se puede mostrar la escena 3D
        del archipiélago. Aquí tienes el mismo contenido organizado por categorías.
      </div>

      {categorias.map((cat) => {
        const catItems = items.filter((i) => i.categoria === cat.slug);
        return (
          <section key={cat.slug}>
            <h2 className={styles.groupTitle}>{cat.nombre}</h2>
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
                  <div key={item.slug} className={styles.card}>
                    <div className={styles.cardTitle}>{item.titulo}</div>
                    <div className={styles.cardResumen}>{item.resumen}</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default VidaFallback;
