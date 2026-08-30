'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import styles from './libros.module.css';
import { fetchVidaLibros, VidaLibro, VidaLibrosResumen } from '../utils/vidaApi';

interface LibroConMeta extends VidaLibro {
  meta: string;
  mostrarNota: boolean;
}

interface Grupo {
  titulo: string;
  cuenta: string;
  libros: LibroConMeta[];
}

const RESUMEN_VACIO: VidaLibrosResumen = { total: 0, esteAnio: 0, cifra: '' };

const agrupar = (libros: VidaLibro[]): Grupo[] => {
  const mapa = new Map<number, VidaLibro[]>();
  libros.forEach((l) => {
    if (!mapa.has(l.anioLectura)) mapa.set(l.anioLectura, []);
    mapa.get(l.anioLectura)!.push(l);
  });
  const anios = Array.from(mapa.keys()).sort((a, b) => b - a);
  return anios.map((anio) => {
    const items = mapa
      .get(anio)!
      .slice()
      .sort((a, b) => a.titulo.localeCompare(b.titulo));
    return {
      titulo: String(anio),
      cuenta: items.length === 1 ? '1 libro' : `${items.length} libros`,
      libros: items.map((l) => ({
        ...l,
        meta: [l.autor, l.genero].filter(Boolean).join(' · '),
        mostrarNota: !!l.nota,
      })),
    };
  });
};

const LibrosPage = () => {
  const [libros, setLibros] = useState<VidaLibro[]>([]);
  const [resumen, setResumen] = useState<VidaLibrosResumen>(RESUMEN_VACIO);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [genero, setGenero] = useState('Todos');

  useEffect(() => {
    let vivo = true;
    fetchVidaLibros().then((data) => {
      if (!vivo) return;
      setLibros(data?.libros || []);
      setResumen(data?.resumen || RESUMEN_VACIO);
      setCargando(false);
    });
    return () => {
      vivo = false;
    };
  }, []);

  const generos = useMemo(
    () => [
      'Todos',
      ...Array.from(new Set(libros.map((l) => l.genero).filter((g): g is string => !!g))).sort(),
    ],
    [libros],
  );

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return libros.filter((l) => {
      const okGenero = genero === 'Todos' || l.genero === genero;
      const okTexto =
        !q || (l.titulo + ' ' + l.autor + ' ' + (l.nota || '')).toLowerCase().includes(q);
      return okGenero && okTexto;
    });
  }, [libros, busqueda, genero]);

  const grupos = useMemo(() => agrupar(filtrados), [filtrados]);
  const sinResultados = !cargando && filtrados.length === 0;
  const limpiarFiltros = () => {
    setBusqueda('');
    setGenero('Todos');
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <Link href="/vida" className={styles.backLink}>
          ← El archipiélago
        </Link>

        <div className={styles.heading}>
          <span className={styles.eyebrow}>Lecturas</span>
          <h1 className={styles.title}>La biblioteca</h1>
          <p className={styles.subtitle}>Todo lo leído, sin islas ni escenas: solo la lista.</p>
        </div>

        {cargando ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            Cargando biblioteca
          </div>
        ) : (
          <div className={styles.content}>
            <div className={styles.statsRow}>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{resumen.total}</span>
                <span className={styles.statLabel}>libros leídos</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statNumber}>{resumen.esteAnio}</span>
                <span className={styles.statLabel}>este año</span>
              </div>
              <div className={`${styles.statCard} ${styles.cifraCard}`}>
                <span className={styles.cifraText}>{resumen.cifra}</span>
              </div>
            </div>

            <div className={styles.filters}>
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar por título, autor o nota…"
                className={styles.searchInput}
              />
              <div className={styles.pills}>
                {generos.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGenero(g)}
                    className={`${styles.pill} ${g === genero ? styles.pillActive : ''}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
              <div className={styles.contador}>
                {filtrados.length} de {libros.length} libros
              </div>
            </div>

            {sinResultados && (
              <div className={styles.empty}>
                <span>No hay libros que coincidan con el filtro.</span>
                <button onClick={limpiarFiltros} className={styles.emptyBtn}>
                  Limpiar filtros
                </button>
              </div>
            )}

            <div className={styles.grupos}>
              {grupos.map((grupo) => (
                <div key={grupo.titulo} className={styles.grupo}>
                  <div className={styles.grupoHeader}>
                    <span className={styles.grupoTitulo}>{grupo.titulo}</span>
                    <span className={styles.grupoCuenta}>{grupo.cuenta}</span>
                  </div>
                  {grupo.libros.map((libro, i) => (
                    <div key={i} className={styles.libro}>
                      <div
                        className={styles.libroSpine}
                        style={{ background: libro.color || '#7a6a4a' }}
                      />
                      <div className={styles.libroText}>
                        <span className={styles.libroTitulo}>{libro.titulo}</span>
                        <span className={styles.libroMeta}>{libro.meta}</span>
                        {libro.mostrarNota && (
                          <span className={styles.libroNota}>{libro.nota}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LibrosPage;
